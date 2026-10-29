/**
 * @deprecated Use `@/lib/email/send-order-confirmation` and `@/emails/order-confirmation` instead.
 * Kept for backwards compatibility.
 * Resend Email Service for Aiel Design & Printing Studio
 * Note: Resend API requires a server secret (`RESEND_API_KEY`).
 * This module is designed to be called securely from server endpoints or server actions.
 */

export interface OrderConfirmationEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
    printType?: string;
  }>;
  subtotal: number;
  shippingFee: number;
  grandTotal: number;
  shippingCity?: string;
}

/**
 * Generate responsive, branded HTML email for order confirmation
 */
export function buildOrderConfirmationEmailHtml(data: OrderConfirmationEmailData): string {
  const itemsRows = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #2a203c;">
          <strong style="color: #ffffff; font-size: 14px;">${item.name}</strong><br />
          <span style="color: #9ca3af; font-size: 12px;">
            Qty: ${item.quantity} ${item.size ? `• Size: ${item.size}` : ""} ${item.color ? `• Color: ${item.color}` : ""} ${item.printType ? `• Print: ${item.printType}` : ""}
          </span>
        </td>
        <td style="padding: 12px 0; text-align: right; color: #f3f4f6; font-size: 14px; font-weight: bold; border-bottom: 1px solid #2a203c;">
          ₹${item.price * item.quantity}
        </td>
      </tr>
    `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>Order Confirmation #${data.orderNumber}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0c0814; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #f3f4f6;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0c0814; padding: 32px 16px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #171124; border: 1px solid #2e2343; border-radius: 20px; overflow: hidden; padding: 32px;">
              <!-- Header Brand -->
              <tr>
                <td align="center" style="padding-bottom: 24px; border-bottom: 1px solid #2e2343;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.02em; color: #ffffff;">
                    AIEL <span style="color: #ec4899;">STUDIO</span>
                  </h1>
                  <p style="margin: 4px 0 0; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #9ca3af;">
                    Puducherry Custom Prints
                  </p>
                </td>
              </tr>

              <!-- Greeting -->
              <tr>
                <td style="padding: 24px 0 16px;">
                  <h2 style="margin: 0 0 8px; font-size: 20px; color: #ffffff;">Order Confirmed! 🎉</h2>
                  <p style="margin: 0; font-size: 14px; color: #9ca3af; line-height: 1.6;">
                    Hi <strong>${data.customerName}</strong>, thank you for your order! We have received your order details and our design team in Puducherry is preparing your pre-print mockups.
                  </p>
                </td>
              </tr>

              <!-- Order Badge -->
              <tr>
                <td style="background-color: #211933; border: 1px solid #3d2f5c; border-radius: 12px; padding: 16px; margin: 16px 0;">
                  <table width="100%">
                    <tr>
                      <td>
                        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af;">Order Number</span><br />
                        <strong style="font-size: 16px; color: #ec4899;">#${data.orderNumber}</strong>
                      </td>
                      <td align="right">
                        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af;">Turnaround</span><br />
                        <strong style="font-size: 14px; color: #10b981;">48h Rush Dispatch</strong>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Items Table -->
              <tr>
                <td style="padding-top: 20px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <thead>
                      <tr>
                        <th align="left" style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af; padding-bottom: 8px;">Product</th>
                        <th align="right" style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af; padding-bottom: 8px;">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsRows}
                    </tbody>
                  </table>
                </td>
              </tr>

              <!-- Totals -->
              <tr>
                <td style="padding-top: 16px;">
                  <table width="100%">
                    <tr>
                      <td style="color: #9ca3af; font-size: 13px; padding: 4px 0;">Subtotal:</td>
                      <td align="right" style="color: #f3f4f6; font-size: 13px;">₹${data.subtotal}</td>
                    </tr>
                    <tr>
                      <td style="color: #9ca3af; font-size: 13px; padding: 4px 0;">Shipping (${data.shippingCity || "Pan-India"}):</td>
                      <td align="right" style="color: #10b981; font-size: 13px;">
                        ${data.shippingFee === 0 ? "FREE" : `₹${data.shippingFee}`}
                      </td>
                    </tr>
                    <tr>
                      <td style="color: #ffffff; font-size: 16px; font-weight: bold; padding-top: 8px; border-top: 1px solid #2e2343;">Grand Total:</td>
                      <td align="right" style="color: #ec4899; font-size: 20px; font-weight: bold; padding-top: 8px; border-top: 1px solid #2e2343;">₹${data.grandTotal}</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Next Steps -->
              <tr>
                <td style="padding-top: 32px; border-top: 1px solid #2e2343; margin-top: 24px;">
                  <h3 style="margin: 0 0 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #f97316;">What happens next?</h3>
                  <p style="margin: 0 0 12px; font-size: 13px; color: #9ca3af; line-height: 1.6;">
                    1. <strong>Pre-print Digital Proof:</strong> Our team will share your artwork placement mockup on WhatsApp for 100% approval before printing.<br />
                    2. <strong>Precision Printing:</strong> Once approved, we print with high-density Japanese DTF / UV cured inks.<br />
                    3. <strong>Express Dispatch:</strong> Dispatched via courier with live tracking.
                  </p>
                  <p style="margin: 0; font-size: 13px; color: #9ca3af;">
                    Need changes? Chat with us directly on WhatsApp: <a href="https://wa.me/919150234277" style="color: #ec4899; text-decoration: none; font-weight: bold;">+91 91502 34277</a>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td align="center" style="padding-top: 32px; font-size: 11px; color: #6b7280;">
                  Aiel Design &amp; Printing Studio • Puducherry, India<br />
                  &copy; ${new Date().getFullYear()} Aiel Studio. All rights reserved.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Send order confirmation email via Resend API
 * Safe to call on server (Node / Edge / Cloudflare / Nitro).
 * Returns success or error description without throwing uncaught exceptions.
 */
export async function sendOrderConfirmationEmail(
  data: OrderConfirmationEmailData,
  apiKeyOverride?: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  const apiKey =
    apiKeyOverride ||
    (typeof process !== "undefined" && process.env?.RESEND_API_KEY) ||
    "";

  if (!apiKey) {
    console.warn("Resend email skipped: RESEND_API_KEY is not configured on the server.");
    return {
      success: false,
      error: "RESEND_API_KEY is missing. Configure it in Hostinger / Vercel environment variables.",
    };
  }

  const verifiedFrom =
    (typeof process !== "undefined" && process.env?.RESEND_FROM_EMAIL) ||
    "Aiel Studio <orders@aieldesignstudio.com>";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: verifiedFrom,
        to: [data.customerEmail],
        subject: `Order Confirmed: #${data.orderNumber} — Aiel Studio Puducherry`,
        html: buildOrderConfirmationEmailHtml(data),
      }),
    });

    const result = (await response.json()) as { id?: string; message?: string; name?: string };

    if (!response.ok) {
      console.error("Resend API error:", result);
      return {
        success: false,
        error: result.message || "Failed to send email via Resend",
      };
    }

    return {
      success: true,
      id: result.id,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Network error contacting Resend";
    console.error("Resend delivery exception:", err);
    return { success: false, error: msg };
  }
}
