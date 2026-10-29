import { createServerFn } from "@tanstack/react-start";

export interface CreateOrderParams {
  amount: number;
  orderNumber: string;
}

export interface CreateOrderResult {
  success: boolean;
  orderId?: string;
  keyId?: string;
  error?: string;
}

/**
 * Server function to generate an official Razorpay order_id using server-side credentials
 */
export const createRazorpayServerOrder = createServerFn({ method: "POST" })
  .validator((data: CreateOrderParams) => data)
  .handler(async ({ data }): Promise<CreateOrderResult> => {
    const keyId =
      process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || "";
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "";

    if (!keyId || !keySecret) {
      return {
        success: false,
        error: "Razorpay server credentials (RAZORPAY_KEY_SECRET) not set in environment.",
      };
    }

    try {
      const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
      const res = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(data.amount * 100), // paise
          currency: "INR",
          receipt: data.orderNumber,
          notes: {
            order_number: data.orderNumber,
            studio: "Aiel Studio Puducherry",
          },
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return {
          success: false,
          error:
            errorData?.error?.description ||
            `Razorpay API returned status ${res.status}`,
        };
      }

      const orderData = (await res.json()) as { id: string };
      return {
        success: true,
        orderId: orderData.id,
        keyId,
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Network error creating Razorpay order",
      };
    }
  });
