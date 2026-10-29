/**
 * Razorpay Payment Gateway Integration
 * Supports:
 * 1. Standard Razorpay Checkout via Server Order creation (prevents "Oops! Something went wrong")
 * 2. Fallback Payment Link (https://razorpay.me/@stella3321?amount=...)
 */
import { createRazorpayServerOrder } from "./razorpay-server";

export const RAZORPAY_PAYMENT_LINK =
  import.meta.env.VITE_RAZORPAY_PAYMENT_LINK || "https://razorpay.me/@stella3321";

export const RAZORPAY_KEY_ID =
  import.meta.env.VITE_RAZORPAY_KEY_ID || "";

export const UPI_ID =
  import.meta.env.VITE_UPI_ID || "9150234277@ybl";

export const WHATSAPP_PHONE =
  import.meta.env.VITE_WHATSAPP_PHONE || "919150234277";

export interface RazorpayCheckoutOptions {
  orderNumber: string;
  amount: number; // in INR
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  onSuccess: (paymentId: string, orderId?: string, signature?: string) => void;
  onDismiss?: () => void;
  onError?: (err: unknown) => void;
}

/**
 * Generate a standard UPI payment URL (opens GPay, PhonePe, Paytm, BHIM on mobile)
 */
export function generateUpiUrl(amount: number, orderNumber: string): string {
  const params = new URLSearchParams({
    pa: UPI_ID,
    pn: "Aiel Design & Printing Studio",
    am: amount.toFixed(2),
    cu: "INR",
    tn: `Order #${orderNumber}`,
  });
  return `upi://pay?${params.toString()}`;
}

/**
 * Dynamically load Razorpay standard checkout script
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if ((window as unknown as { Razorpay?: unknown }).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Build pre-filled verified Razorpay payment link
 */
export function getPrefilledPaymentLink(amount: number, orderNumber?: string): string {
  try {
    const url = new URL(RAZORPAY_PAYMENT_LINK);
    url.searchParams.set("amount", String(amount));
    if (orderNumber) {
      url.searchParams.set("comment", `Order #${orderNumber}`);
    }
    return url.toString();
  } catch {
    return `${RAZORPAY_PAYMENT_LINK}?amount=${amount}`;
  }
}

/**
 * Trigger Razorpay checkout
 * - Attempts to create a server order first (required by Razorpay for INR payments)
 * - If server credentials are missing or order creation fails, falls back gracefully to payment link
 */
export async function initiateRazorpayPayment(options: RazorpayCheckoutOptions): Promise<void> {
  let serverOrderId: string | undefined;
  let effectiveKeyId: string = RAZORPAY_KEY_ID;

  // 1. Attempt server-side order creation (avoids Razorpay's "Oops! Something went wrong")
  try {
    const serverResult = await createRazorpayServerOrder({
      data: {
        amount: options.amount,
        orderNumber: options.orderNumber,
      },
    });

    if (serverResult.success && serverResult.orderId) {
      serverOrderId = serverResult.orderId;
      if (serverResult.keyId) {
        effectiveKeyId = serverResult.keyId;
      }
    } else if (serverResult.error) {
      console.warn("Razorpay server order creation skipped:", serverResult.error);
    }
  } catch (err) {
    console.warn("Server order endpoint unreachable:", err);
  }

  // 2. If no server orderId and no configured key, or standard checkout not available:
  // Fallback to pre-filled payment link
  if (!serverOrderId && !effectiveKeyId) {
    const paymentUrl = getPrefilledPaymentLink(options.amount, options.orderNumber);
    window.open(paymentUrl, "_blank", "noopener,noreferrer");
    options.onSuccess("payment-link-opened");
    return;
  }

  const loaded = await loadRazorpayScript();
  if (!loaded) {
    const paymentUrl = getPrefilledPaymentLink(options.amount, options.orderNumber);
    window.open(paymentUrl, "_blank", "noopener,noreferrer");
    options.onSuccess("fallback-link-opened");
    return;
  }

  interface RazorpayHandlerResponse {
    razorpay_payment_id: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  }

  const rzpOptions: Record<string, unknown> = {
    key: effectiveKeyId,
    amount: Math.round(options.amount * 100), // in paise
    currency: "INR",
    name: "Aiel Design & Printing Studio",
    description: `Order #${options.orderNumber} — Custom Prints Puducherry`,
    image: "/favicon.ico",
    prefill: {
      name: options.customerName,
      email: options.customerEmail,
      contact: options.customerPhone || "",
    },
    notes: {
      order_number: options.orderNumber,
      studio: "Aiel Studio Puducherry",
    },
    theme: {
      color: "#ec4899",
    },
    modal: {
      ondismiss: () => {
        options.onDismiss?.();
      },
    },
    handler: (response: RazorpayHandlerResponse) => {
      options.onSuccess(
        response.razorpay_payment_id,
        response.razorpay_order_id,
        response.razorpay_signature
      );
    },
  };

  if (serverOrderId) {
    rzpOptions.order_id = serverOrderId;
  }

  try {
    const RazorpayConstructor = (window as unknown as {
      Razorpay: new (opts: Record<string, unknown>) => {
        open: () => void;
        on: (event: string, handler: (err: unknown) => void) => void;
      };
    }).Razorpay;

    const rzp = new RazorpayConstructor(rzpOptions);

    rzp.on("payment.failed", (err: unknown) => {
      console.warn("Razorpay payment modal failed:", err);
      // If modal payment fails, fallback to verified link
      const fallbackUrl = getPrefilledPaymentLink(options.amount, options.orderNumber);
      window.open(fallbackUrl, "_blank", "noopener,noreferrer");
      options.onError?.(err);
    });

    rzp.open();
  } catch (err) {
    console.error("Razorpay instance initialization failed:", err);
    const fallbackUrl = getPrefilledPaymentLink(options.amount, options.orderNumber);
    window.open(fallbackUrl, "_blank", "noopener,noreferrer");
    options.onSuccess("fallback-link-opened");
  }
}
