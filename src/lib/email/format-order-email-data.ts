/**
 * Transforms a Supabase order row into the props expected by the
 * OrderConfirmationEmail React Email template.
 */
import type { OrderConfirmationEmailProps, OrderItemProps } from "@/emails/order-confirmation";

/* ------------------------------------------------------------------ */
/*  Types matching the Supabase `orders` table                         */
/* ------------------------------------------------------------------ */

/** Shape of each item stored in orders.items JSONB */
interface OrderItemRow {
  productId?: string | undefined;
  name: string;
  price: number;
  quantity: number;
  size?: string | undefined;
  color?: string | undefined;
  printType?: string | undefined;
  customText?: string | undefined;
  notes?: string | undefined;
  image?: string | undefined;
}

/** Shape of the Supabase order row from a `.select("*")` query */
export interface SupabaseOrderRow {
  id: string;
  order_number: string;
  customer_email: string;
  customer_name: string;
  customer_phone?: string | null;
  shipping_city?: string | null;
  shipping_address?: Record<string, unknown> | null;
  items: OrderItemRow[];
  subtotal: number | string;
  shipping_fee: number | string;
  grand_total: number | string;
  status: string;
  payment_method: string;
  notes?: string | null;
  created_at: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function formatINR(value: number | string): string {
  return INR.format(typeof value === "string" ? parseFloat(value) : value);
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function buildShippingAddressString(
  address?: Record<string, unknown> | null,
  city?: string | null
): string | undefined {
  if (!address && !city) return undefined;

  const parts: string[] = [];
  if (address) {
    if (address["address"] && typeof address["address"] === "string") parts.push(address["address"]);
    if (address["city"] && typeof address["city"] === "string") parts.push(address["city"]);
    else if (city) parts.push(city);
    if (address["pincode"] && typeof address["pincode"] === "string") parts.push(address["pincode"]);
  } else if (city) {
    parts.push(city);
  }

  return parts.length > 0 ? parts.join(", ") : undefined;
}

/* ------------------------------------------------------------------ */
/*  Main formatter                                                     */
/* ------------------------------------------------------------------ */

export function formatOrderEmailData(
  order: SupabaseOrderRow
): OrderConfirmationEmailProps {
  const siteUrl =
    process.env["SITE_URL"] ||
    process.env["VITE_SITE_URL"] ||
    process.env["NEXT_PUBLIC_SITE_URL"] ||
    "https://aieldesignstudio.com";

  const supportEmail =
    process.env["SUPPORT_EMAIL"] || "orders@aieldesignstudio.com";

  const grandTotal = typeof order.grand_total === "string"
    ? parseFloat(order.grand_total)
    : order.grand_total;

  const subtotalNum = typeof order.subtotal === "string"
    ? parseFloat(order.subtotal)
    : order.subtotal;

  const shippingFeeNum = typeof order.shipping_fee === "string"
    ? parseFloat(order.shipping_fee)
    : order.shipping_fee;

  // Build email items from JSONB
  const items: OrderItemProps[] = (order.items || []).map((item) => ({
    name: item.name || "Product",
    image: item.image,
    size: item.size,
    color: item.color,
    printType: item.printType,
    customText: item.customText,
    quantity: item.quantity || 1,
    unitPrice: item.price || 0,
    lineTotal: (item.price || 0) * (item.quantity || 1),
  }));

  // Determine payment status
  const isPaid =
    order.status === "payment_verified" ||
    order.status === "in_production" ||
    order.status === "dispatched" ||
    order.status === "delivered";

  return {
    customerName: order.customer_name,
    orderNumber: order.order_number,
    orderDate: formatDate(order.created_at),
    orderStatus: order.status,
    items,
    subtotal: formatINR(subtotalNum),
    shippingFee: shippingFeeNum === 0 ? "FREE" : formatINR(shippingFeeNum),
    grandTotal: formatINR(grandTotal),
    paymentMethod: order.payment_method,
    amountPaid: isPaid ? formatINR(grandTotal) : undefined,
    amountOutstanding: !isPaid ? formatINR(grandTotal) : undefined,
    shippingAddress: buildShippingAddressString(
      order.shipping_address,
      order.shipping_city
    ),
    orderUrl: `${siteUrl}/orders/${order.order_number}`,
    shopUrl: siteUrl,
    supportEmail,
    whatsappPhone: "919150234277",
  };
}
