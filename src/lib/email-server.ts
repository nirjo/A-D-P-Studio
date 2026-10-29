/**
 * TanStack Start server function for sending order confirmation emails.
 * This wraps the core sendOrderConfirmationEmail service so it can be
 * called from client components (e.g. after checkout success) or from
 * other server functions.
 *
 * The claim mechanism in the email service prevents duplicate sends,
 * so it's safe to call this from multiple places (webhook + client).
 */
import { createServerFn } from "@tanstack/react-start";
import { sendOrderConfirmationEmail } from "@/lib/email/send-order-confirmation";

export const triggerOrderConfirmationEmail = createServerFn({ method: "POST" })
  .validator((data: { orderId: string }) => data)
  .handler(async ({ data }) => {
    const result = await sendOrderConfirmationEmail(data.orderId);
    return result;
  });
