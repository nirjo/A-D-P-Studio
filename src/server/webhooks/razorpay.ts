/**
 * Razorpay Webhook Handler — Server-Only
 *
 * Verifies Razorpay HMAC signature, updates order/payment state in Supabase,
 * and triggers order confirmation email via Resend.
 */
import { createHmac } from "node:crypto";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { sendOrderConfirmationEmail } from "@/lib/email/send-order-confirmation";

interface RazorpayPaymentEntity {
  id: string; // pay_xxxxx
  order_id: string; // order_xxxxx
  amount: number; // in paise
  currency: string;
  status: string;
  method?: string | undefined;
  email?: string | undefined;
  contact?: string | undefined;
  error_code?: string | undefined;
  error_description?: string | undefined;
  notes?: Record<string, string> | undefined;
}

interface RazorpayWebhookPayload {
  event: string;
  payload: {
    payment?: {
      entity: RazorpayPaymentEntity;
    };
  };
}

function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  const expected = createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  return expected === signature;
}

export async function handleRazorpayWebhook(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const webhookSecret = process.env["RAZORPAY_WEBHOOK_SECRET"] || "";

  if (!webhookSecret) {
    console.error(
      "[razorpay-webhook] RAZORPAY_WEBHOOK_SECRET is not set in environment. Rejecting."
    );
    return new Response(
      JSON.stringify({ error: "Webhook secret not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // 1. Read raw body for signature verification
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") || "";

  if (!signature) {
    return new Response(
      JSON.stringify({ error: "Missing signature header" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // 2. Verify HMAC signature
  if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
    console.warn("[razorpay-webhook] Invalid signature. Rejecting.");
    return new Response(
      JSON.stringify({ error: "Invalid webhook signature" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // 3. Parse payload
  let payload: RazorpayWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as RazorpayWebhookPayload;
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON payload" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const event = payload.event;
  const paymentEntity = payload.payload?.payment?.entity;

  if (!paymentEntity) {
    return new Response(JSON.stringify({ status: "ignored" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  console.log(
    `[razorpay-webhook] Event: ${event}, Payment: ${paymentEntity.id}, RazorpayOrder: ${paymentEntity.order_id}`
  );

  const supabase = createServerSupabaseClient();
  const razorpayOrderId = paymentEntity.order_id;

  // 4. Look up internal payment_status row
  const { data: paymentRow, error: psErr } = await supabase
    .from("payment_status")
    .select("id, order_id, amount, currency")
    .eq("razorpay_order_id", razorpayOrderId)
    .maybeSingle();

  if (psErr || !paymentRow) {
    console.warn(
      `[razorpay-webhook] No payment_status row for razorpay_order_id=${razorpayOrderId}`
    );
    return new Response(
      JSON.stringify({ status: "no_matching_order" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  const internalOrderId = paymentRow["order_id"] as string;
  const dbAmount = paymentRow["amount"] as string | number;
  const expectedAmountPaise = Math.round(
    (typeof dbAmount === "string" ? parseFloat(dbAmount) : dbAmount) * 100
  );

  // 5. Validate amount & currency
  const dbCurrency = (paymentRow["currency"] as string) || "INR";
  if (
    paymentEntity.amount !== expectedAmountPaise ||
    paymentEntity.currency !== dbCurrency
  ) {
    console.error(
      `[razorpay-webhook] Amount/currency mismatch! Expected ${expectedAmountPaise} ${dbCurrency}, got ${paymentEntity.amount} ${paymentEntity.currency}`
    );
    return new Response(
      JSON.stringify({ error: "Amount/currency mismatch" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // 6. Handle events
  if (event === "payment.captured") {
    await supabase
      .from("payment_status")
      .update({
        status: "captured",
        razorpay_payment_id: paymentEntity.id,
        webhook_payload: payload,
        verified_at: new Date().toISOString(),
      })
      .eq("id", paymentRow["id"] as string);

    await supabase
      .from("orders")
      .update({ status: "payment_verified" })
      .eq("id", internalOrderId);

    console.log(
      `[razorpay-webhook] Payment captured for order ${internalOrderId}`
    );

    // Send confirmation email (fire-and-forget)
    try {
      const emailResult = await sendOrderConfirmationEmail(internalOrderId);
      if (!emailResult.success && !emailResult.skipped) {
        console.warn(
          `[razorpay-webhook] Email delivery note: ${emailResult.error}`
        );
      }
    } catch (emailErr) {
      console.error("[razorpay-webhook] Email error:", emailErr);
    }

    return new Response(
      JSON.stringify({ status: "captured", order_id: internalOrderId }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  if (event === "payment.authorized") {
    await supabase
      .from("payment_status")
      .update({
        status: "authorized",
        razorpay_payment_id: paymentEntity.id,
        webhook_payload: payload,
      })
      .eq("id", paymentRow["id"] as string);

    return new Response(
      JSON.stringify({ status: "authorized" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  if (event === "payment.failed") {
    await supabase
      .from("payment_status")
      .update({
        status: "failed",
        razorpay_payment_id: paymentEntity.id,
        error_description:
          paymentEntity.error_description || "Payment failed",
        webhook_payload: payload,
      })
      .eq("id", paymentRow["id"] as string);

    console.log(
      `[razorpay-webhook] Payment failed for order ${internalOrderId}`
    );

    return new Response(
      JSON.stringify({ status: "failed" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ status: "acknowledged", event }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
