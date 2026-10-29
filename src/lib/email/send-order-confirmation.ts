/**
 * Core service: send an order confirmation email with idempotent
 * duplicate-prevention via the order_email_notifications table.
 *
 * This module is server-only (uses process.env, service_role client).
 */
import { render } from "@react-email/render";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getResendClient, getFromAddress } from "@/lib/email/resend-client";
import { formatOrderEmailData, type SupabaseOrderRow } from "@/lib/email/format-order-email-data";
import { OrderConfirmationEmail } from "@/emails/order-confirmation";
import { buildOrderConfirmationPlainText } from "@/emails/order-confirmation-text";

export interface SendEmailResult {
  success: boolean;
  skipped?: boolean;
  resendId?: string;
  error?: string;
}

export async function sendOrderConfirmationEmail(
  orderId: string
): Promise<SendEmailResult> {
  try {
    const supabase = createServerSupabaseClient();

    // 1. Fetch order from Supabase
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .maybeSingle();

    if (orderErr || !order) {
      return {
        success: false,
        error: orderErr?.message || `Order ${orderId} not found.`,
      };
    }

    const orderRow = order as SupabaseOrderRow;

    // 2. Atomic claim — prevents duplicate emails
    const { data: claimed, error: claimErr } = await supabase.rpc(
      "claim_email_notification",
      {
        p_order_id: orderId,
        p_notification_type: "order_confirmation",
      }
    );

    if (claimErr) {
      console.error("[send-order-confirmation] Claim RPC error:", claimErr.message);
      // If the RPC table doesn't exist yet, proceed anyway (graceful degradation)
      if (!claimErr.message?.includes("does not exist")) {
        return { success: false, error: claimErr.message };
      }
    }

    // If the claim returned nothing, the notification was already sent or is being sent
    if (claimed && Array.isArray(claimed) && claimed.length === 0) {
      return { success: true, skipped: true };
    }

    const notificationId =
      claimed && Array.isArray(claimed) && claimed.length > 0
        ? (claimed[0] as { id: string }).id
        : null;

    // 3. Format data for the email
    const emailProps = formatOrderEmailData(orderRow);

    // 4. Render HTML & plain text
    let html: string;
    let text: string;
    try {
      html = await render(OrderConfirmationEmail(emailProps));
      text = buildOrderConfirmationPlainText(emailProps);
    } catch (renderErr) {
      const msg =
        renderErr instanceof Error
          ? renderErr.message
          : "Email template render failed";
      console.error("[send-order-confirmation] Render error:", msg);

      // Mark notification as failed
      if (notificationId) {
        await supabase
          .from("order_email_notifications")
          .update({ status: "failed", last_error: msg })
          .eq("id", notificationId);
      }
      return { success: false, error: msg };
    }

    // 5. Send via Resend
    const resend = getResendClient();
    const fromAddress = getFromAddress();

    const { data: sendResult, error: sendErr } = await resend.emails.send({
      from: fromAddress,
      to: [orderRow.customer_email],
      subject: `Order Confirmed: #${orderRow.order_number} — Aiel Studio`,
      html,
      text,
    });

    if (sendErr || !sendResult) {
      const errMsg =
        sendErr?.message || "Resend API rejected the email";
      console.error("[send-order-confirmation] Resend error:", errMsg);

      // Mark notification as failed
      if (notificationId) {
        await supabase
          .from("order_email_notifications")
          .update({ status: "failed", last_error: errMsg })
          .eq("id", notificationId);
      }
      return { success: false, error: errMsg };
    }

    // 6. Mark notification as sent
    if (notificationId) {
      await supabase
        .from("order_email_notifications")
        .update({
          status: "sent",
          resend_email_id: sendResult.id,
          sent_at: new Date().toISOString(),
        })
        .eq("id", notificationId);
    }

    console.log(
      `[send-order-confirmation] Email sent for order ${orderRow.order_number} → ${sendResult.id}`
    );

    return { success: true, resendId: sendResult.id };
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : "Unexpected error sending email";
    console.error("[send-order-confirmation] Unhandled:", msg);
    return { success: false, error: msg };
  }
}
