/**
 * Plain-text version of the order confirmation email.
 * Used as the text fallback for email clients that don't render HTML.
 */
import type { OrderConfirmationEmailProps } from "./order-confirmation";

const STATUS_LABELS: Record<string, string> = {
  pending_payment: "Awaiting Payment",
  payment_verified: "Confirmed",
  mockup_approval: "Mockup Approval",
  in_production: "In Production",
  dispatched: "Dispatched",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  razorpay: "Razorpay (Cards / UPI / NetBanking)",
  whatsapp_upi: "WhatsApp UPI",
  cod: "Cash on Delivery",
  bank_transfer: "Bank Transfer",
};

export function buildOrderConfirmationPlainText(
  props: OrderConfirmationEmailProps
): string {
  const {
    customerName,
    orderNumber,
    orderDate,
    orderStatus,
    items,
    subtotal,
    discount,
    shippingFee,
    grandTotal,
    paymentMethod,
    amountPaid,
    amountOutstanding,
    shippingAddress,
    estimatedDelivery,
    trackingLink,
    orderUrl,
    shopUrl,
    supportEmail,
    whatsappPhone,
  } = props;

  const sLabel = STATUS_LABELS[orderStatus] || orderStatus;
  const pmLabel = PAYMENT_METHOD_LABELS[paymentMethod] || paymentMethod;

  const lines: string[] = [];

  lines.push("AIEL DESIGN & PRINTING STUDIO");
  lines.push("Bring Your Ideas to Life");
  lines.push("═".repeat(48));
  lines.push("");
  lines.push("THANK YOU FOR YOUR ORDER!");
  lines.push("");
  lines.push(
    `Hi ${customerName}, thank you for choosing Aiel Design & Printing Studio. Your order has been received, and we're excited to bring your ideas to life!`
  );
  lines.push("");

  // Order badge
  lines.push("─".repeat(48));
  lines.push(`Order Number:  #${orderNumber}`);
  lines.push(`Order Date:    ${orderDate}`);
  lines.push(`Status:        ${sLabel}`);
  lines.push("─".repeat(48));
  lines.push("");

  // Items
  lines.push("ORDER ITEMS");
  lines.push("");
  items.forEach((item, idx) => {
    lines.push(`${idx + 1}. ${item.name}`);
    const details: string[] = [`Qty: ${item.quantity}`];
    if (item.size) details.push(`Size: ${item.size}`);
    if (item.color) details.push(`Color: ${item.color}`);
    if (item.printType) details.push(`Print: ${item.printType}`);
    lines.push(`   ${details.join(" · ")}`);
    if (item.customText) {
      lines.push(`   Custom Text: "${item.customText}"`);
    }
    lines.push(
      `   ${item.quantity > 1 ? `₹${item.unitPrice} × ${item.quantity} = ` : ""}₹${item.lineTotal}`
    );
    lines.push("");
  });

  // Summary
  lines.push("─".repeat(48));
  lines.push(`Subtotal:         ${subtotal}`);
  if (discount) {
    lines.push(`Discount:        -${discount}`);
  }
  lines.push(`Shipping:         ${shippingFee === "₹0" ? "FREE" : shippingFee}`);
  lines.push("─".repeat(48));
  lines.push(`GRAND TOTAL:      ${grandTotal}`);
  lines.push("");
  lines.push(`Payment Method:   ${pmLabel}`);
  if (amountPaid) {
    lines.push(`Amount Paid:      ${amountPaid}`);
  }
  if (amountOutstanding) {
    lines.push(`Amount Due:       ${amountOutstanding}`);
  }
  lines.push("");

  // Delivery
  if (shippingAddress || estimatedDelivery || trackingLink) {
    lines.push("DELIVERY DETAILS");
    if (shippingAddress) lines.push(`Ship to: ${shippingAddress}`);
    if (estimatedDelivery) lines.push(`Estimated Delivery: ${estimatedDelivery}`);
    if (trackingLink) lines.push(`Track your order: ${trackingLink}`);
    lines.push("");
  }

  // Links
  lines.push("─".repeat(48));
  lines.push(`View Your Order: ${orderUrl}`);
  lines.push(`Continue Shopping: ${shopUrl}`);
  if (whatsappPhone) {
    lines.push(`Chat on WhatsApp: https://wa.me/${whatsappPhone}`);
  }
  lines.push("");

  // Footer
  lines.push("─".repeat(48));
  lines.push(
    "Every order is special to us. Thank you for trusting us with your creativity!"
  );
  lines.push(`Need help? ${supportEmail}`);
  lines.push("");
  lines.push(`Aiel Design & Printing Studio · Puducherry, India`);
  lines.push(`© ${new Date().getFullYear()} Aiel Studio. All rights reserved.`);

  return lines.join("\n");
}
