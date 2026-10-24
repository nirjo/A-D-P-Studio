/**
 * Razorpay Payment Gateway Integration
 * Supports:
 * 1. Standard Razorpay Standard Checkout (Popup modal with Cards, UPI, NetBanking, Wallets)
 * 2. Fallback Payment Link (https://razorpay.me/@stella3321)
 */

export const RAZORPAY_PAYMENT_LINK =
  import.meta.env.VITE_RAZORPAY_PAYMENT_LINK || "https://razorpay.me/@stella3321";

export const RAZORPAY_KEY_ID =
  import.meta.env.VITE_RAZORPAY_KEY_ID || "";

export interface RazorpayCheckoutOptions {
  orderNumber: string;
  amount: number; // in INR (not paise; helper multiplies by 100)
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  onSuccess: (paymentId: string, orderId?: string, signature?: string) => void;
  onDismiss?: () => void;
  onError?: (err: unknown) => void;
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
 * Trigger Razorpay checkout
 * If server key is present, launches standard modal.
 * If server key is pending, seamlessly redirects to the verified Razorpay payment link.
 */
export async function initiateRazorpayPayment(options: RazorpayCheckoutOptions): Promise<void> {
  // If no API Key ID configured yet, use the verified payment link
  if (!RAZORPAY_KEY_ID) {
    const url = new URL(RAZORPAY_PAYMENT_LINK);
    // Many razorpay.me links accept amount query param or pre-fill note
    window.open(url.toString(), "_blank", "noopener,noreferrer");
    options.onSuccess("payment-link-opened");
    return;
  }

  const loaded = await loadRazorpayScript();
  if (!loaded) {
    // Fallback to payment link if script failed to load (e.g. adblocker)
    window.open(RAZORPAY_PAYMENT_LINK, "_blank", "noopener,noreferrer");
    options.onSuccess("fallback-link-opened");
    return;
  }

  interface RazorpayHandlerResponse {
    razorpay_payment_id: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  }

  const rzpOptions = {
    key: RAZORPAY_KEY_ID,
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
      color: "#ec4899", // Splash-pink matching theme
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

  const RazorpayConstructor = (window as unknown as { Razorpay: new (opts: typeof rzpOptions) => { open: () => void } }).Razorpay;
  const rzp = new RazorpayConstructor(rzpOptions);
  rzp.open();
}
