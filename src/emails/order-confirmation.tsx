/**
 * Order Confirmation Email — React Email Template
 * Aiel Design & Printing Studio
 *
 * Minimal, premium, mobile-first layout compatible with
 * Gmail, Outlook, Apple Mail, and Yahoo.
 */
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Row,
  Column,
  Text,
  Img,
  Button,
  Hr,
  Heading,
  Link,
} from "@react-email/components";
import * as React from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface OrderItemProps {
  name: string;
  image?: string | undefined;
  size?: string | undefined;
  color?: string | undefined;
  printType?: string | undefined;
  customText?: string | undefined;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderConfirmationEmailProps {
  customerName: string;
  orderNumber: string;
  orderDate: string;
  orderStatus: string;
  items: OrderItemProps[];
  subtotal: string;
  discount?: string | undefined;
  shippingFee: string;
  grandTotal: string;
  currency?: string | undefined;
  paymentMethod: string;
  amountPaid?: string | undefined;
  amountOutstanding?: string | undefined;
  shippingAddress?: string | undefined;
  estimatedDelivery?: string | undefined;
  trackingLink?: string | undefined;
  orderUrl: string;
  shopUrl: string;
  supportEmail: string;
  whatsappPhone?: string | undefined;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const STATUS_LABELS: Record<string, string> = {
  pending_payment: "Awaiting Payment",
  payment_verified: "Confirmed",
  mockup_approval: "Mockup Approval",
  in_production: "In Production",
  dispatched: "Dispatched",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function statusLabel(raw: string): string {
  return STATUS_LABELS[raw] || raw.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function statusColor(raw: string): string {
  if (raw === "payment_verified" || raw === "delivered") return "#10b981";
  if (raw === "cancelled" || raw === "failed") return "#ef4444";
  return "#f59e0b"; // amber for pending/processing
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  razorpay: "Razorpay (Cards / UPI / NetBanking)",
  whatsapp_upi: "WhatsApp UPI",
  cod: "Cash on Delivery",
  bank_transfer: "Bank Transfer",
};

/* ------------------------------------------------------------------ */
/*  Styles (inline for email compatibility)                            */
/* ------------------------------------------------------------------ */

const main: React.CSSProperties = {
  backgroundColor: "#f8f9fa",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  maxWidth: "600px",
  borderRadius: "12px",
  overflow: "hidden",
  border: "1px solid #e5e7eb",
};

const headerSection: React.CSSProperties = {
  backgroundColor: "#ffffff",
  padding: "32px 40px 24px",
  textAlign: "center" as const,
  borderBottom: "1px solid #f0f0f0",
};

const brandName: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: 800,
  letterSpacing: "-0.02em",
  color: "#1f2937",
  margin: "0",
};

const brandAccent: React.CSSProperties = {
  color: "#ec4899",
};

const tagline: React.CSSProperties = {
  fontSize: "11px",
  letterSpacing: "0.15em",
  textTransform: "uppercase" as const,
  color: "#9ca3af",
  margin: "4px 0 0",
};

const contentPadding: React.CSSProperties = {
  padding: "32px 40px",
};

const greetingHeading: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: 700,
  color: "#111827",
  margin: "0 0 8px",
};

const bodyText: React.CSSProperties = {
  fontSize: "14px",
  lineHeight: "1.6",
  color: "#4b5563",
  margin: "0 0 24px",
};

const orderBadge: React.CSSProperties = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "10px",
  padding: "16px 20px",
  marginBottom: "24px",
};

const orderBadgeLabel: React.CSSProperties = {
  fontSize: "10px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  color: "#9ca3af",
  margin: "0 0 2px",
};

const orderBadgeValue: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 700,
  color: "#ec4899",
  margin: "0",
};

const statusPill: React.CSSProperties = {
  display: "inline-block",
  fontSize: "11px",
  fontWeight: 600,
  borderRadius: "9999px",
  padding: "3px 10px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
};

const itemRow: React.CSSProperties = {
  borderBottom: "1px solid #f3f4f6",
  padding: "14px 0",
};

const itemName: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 600,
  color: "#1f2937",
  margin: "0 0 2px",
};

const itemMeta: React.CSSProperties = {
  fontSize: "12px",
  color: "#6b7280",
  margin: "0",
};

const itemPrice: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 600,
  color: "#1f2937",
  textAlign: "right" as const,
};

const summaryRow: React.CSSProperties = {
  fontSize: "13px",
  color: "#6b7280",
  padding: "4px 0",
};

const summaryValue: React.CSSProperties = {
  fontSize: "13px",
  color: "#1f2937",
  fontWeight: 500,
  textAlign: "right" as const,
};

const totalRow: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 700,
  color: "#111827",
  padding: "10px 0 0",
  borderTop: "2px solid #e5e7eb",
};

const totalValue: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: 800,
  color: "#ec4899",
  textAlign: "right" as const,
};

const primaryBtn: React.CSSProperties = {
  backgroundColor: "#ec4899",
  color: "#ffffff",
  fontSize: "13px",
  fontWeight: 700,
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  borderRadius: "9999px",
  padding: "14px 32px",
  textDecoration: "none",
  display: "inline-block",
  textAlign: "center" as const,
};

const secondaryLink: React.CSSProperties = {
  fontSize: "13px",
  color: "#ec4899",
  fontWeight: 600,
  textDecoration: "none",
};

const footerSection: React.CSSProperties = {
  padding: "24px 40px 32px",
  textAlign: "center" as const,
  backgroundColor: "#fafafa",
  borderTop: "1px solid #f0f0f0",
};

const footerText: React.CSSProperties = {
  fontSize: "12px",
  color: "#9ca3af",
  lineHeight: "1.6",
  margin: "0",
};

const footerLoveText: React.CSSProperties = {
  fontSize: "12px",
  color: "#6b7280",
  fontStyle: "italic",
  margin: "0 0 12px",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function OrderConfirmationEmail(props: OrderConfirmationEmailProps) {
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

  const sColor = statusColor(orderStatus);
  const sLabel = statusLabel(orderStatus);
  const pmLabel =
    PAYMENT_METHOD_LABELS[paymentMethod] || paymentMethod;

  const previewText = `Thank you for your order #${orderNumber}! Your order is ${sLabel.toLowerCase()}.`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* ---- Header ---- */}
          <Section style={headerSection}>
            <Heading as="h1" style={brandName}>
              AIEL DESIGN & <span style={brandAccent}>PRINTING STUDIO</span>
            </Heading>
            <Text style={tagline}>Bring Your Ideas to Life</Text>
          </Section>

          {/* ---- Content ---- */}
          <Section style={contentPadding}>
            {/* Greeting */}
            <Heading as="h2" style={greetingHeading}>
              Thank You for Your Order!
            </Heading>
            <Text style={bodyText}>
              Hi <strong>{customerName}</strong>, thank you for choosing Aiel
              Design &amp; Printing Studio. Your order has been received, and
              we&apos;re excited to bring your ideas to life!
            </Text>

            {/* Order Badge */}
            <Section style={orderBadge}>
              <Row>
                <Column>
                  <Text style={orderBadgeLabel}>Order Number</Text>
                  <Text style={orderBadgeValue}>#{orderNumber}</Text>
                </Column>
                <Column align="center">
                  <Text style={orderBadgeLabel}>Order Date</Text>
                  <Text style={{ ...orderBadgeValue, color: "#1f2937", fontSize: "14px" }}>
                    {orderDate}
                  </Text>
                </Column>
                <Column align="right">
                  <Text style={orderBadgeLabel}>Status</Text>
                  <Text
                    style={{
                      ...statusPill,
                      backgroundColor: `${sColor}15`,
                      color: sColor,
                    }}
                  >
                    {sLabel}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Items */}
            <Text
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#9ca3af",
                fontWeight: 600,
                margin: "0 0 8px",
              }}
            >
              Order Items
            </Text>

            {items.map((item, idx) => (
              <Section key={idx} style={itemRow}>
                <Row>
                  {item.image && (
                    <Column style={{ width: "56px", paddingRight: "12px" }}>
                      <Img
                        src={item.image}
                        alt={item.name}
                        width="52"
                        height="52"
                        style={{ borderRadius: "8px", objectFit: "cover" }}
                      />
                    </Column>
                  )}
                  <Column>
                    <Text style={itemName}>{item.name}</Text>
                    <Text style={itemMeta}>
                      Qty: {item.quantity}
                      {item.size ? ` · Size: ${item.size}` : ""}
                      {item.color ? ` · Color: ${item.color}` : ""}
                      {item.printType ? ` · Print: ${item.printType}` : ""}
                    </Text>
                    {item.customText && (
                      <Text style={{ ...itemMeta, fontStyle: "italic" }}>
                        Custom: &quot;{item.customText}&quot;
                      </Text>
                    )}
                  </Column>
                  <Column align="right" style={{ verticalAlign: "middle" }}>
                    <Text style={itemPrice}>₹{item.lineTotal}</Text>
                    {item.quantity > 1 && (
                      <Text style={{ ...itemMeta, textAlign: "right" }}>
                        ₹{item.unitPrice} each
                      </Text>
                    )}
                  </Column>
                </Row>
              </Section>
            ))}

            {/* Summary */}
            <Section style={{ marginTop: "20px" }}>
              <Row>
                <Column>
                  <Text style={summaryRow}>Subtotal</Text>
                </Column>
                <Column align="right">
                  <Text style={summaryValue}>{subtotal}</Text>
                </Column>
              </Row>

              {discount && (
                <Row>
                  <Column>
                    <Text style={summaryRow}>Discount</Text>
                  </Column>
                  <Column align="right">
                    <Text style={{ ...summaryValue, color: "#10b981" }}>
                      -{discount}
                    </Text>
                  </Column>
                </Row>
              )}

              <Row>
                <Column>
                  <Text style={summaryRow}>Shipping</Text>
                </Column>
                <Column align="right">
                  <Text
                    style={{
                      ...summaryValue,
                      color: shippingFee === "₹0" || shippingFee === "FREE" ? "#10b981" : "#1f2937",
                    }}
                  >
                    {shippingFee === "₹0" ? "FREE" : shippingFee}
                  </Text>
                </Column>
              </Row>

              <Hr style={{ border: "none", borderTop: "2px solid #e5e7eb", margin: "8px 0" }} />

              <Row>
                <Column>
                  <Text style={totalRow}>Grand Total</Text>
                </Column>
                <Column align="right">
                  <Text style={totalValue}>{grandTotal}</Text>
                </Column>
              </Row>

              {/* Payment info */}
              <Row style={{ marginTop: "8px" }}>
                <Column>
                  <Text style={summaryRow}>Payment Method</Text>
                </Column>
                <Column align="right">
                  <Text style={summaryValue}>{pmLabel}</Text>
                </Column>
              </Row>

              {amountPaid && (
                <Row>
                  <Column>
                    <Text style={summaryRow}>Amount Paid</Text>
                  </Column>
                  <Column align="right">
                    <Text style={{ ...summaryValue, color: "#10b981" }}>
                      {amountPaid}
                    </Text>
                  </Column>
                </Row>
              )}

              {amountOutstanding && (
                <Row>
                  <Column>
                    <Text style={summaryRow}>Amount Due</Text>
                  </Column>
                  <Column align="right">
                    <Text style={{ ...summaryValue, color: "#f59e0b" }}>
                      {amountOutstanding}
                    </Text>
                  </Column>
                </Row>
              )}
            </Section>

            {/* Delivery Details */}
            {(shippingAddress || estimatedDelivery || trackingLink) && (
              <>
                <Hr
                  style={{
                    border: "none",
                    borderTop: "1px solid #e5e7eb",
                    margin: "24px 0 16px",
                  }}
                />
                <Text
                  style={{
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#9ca3af",
                    fontWeight: 600,
                    margin: "0 0 8px",
                  }}
                >
                  Delivery Details
                </Text>

                {shippingAddress && (
                  <Text style={{ ...bodyText, marginBottom: "8px" }}>
                    <strong>Ship to:</strong> {shippingAddress}
                  </Text>
                )}

                {estimatedDelivery && (
                  <Text style={{ ...bodyText, marginBottom: "8px" }}>
                    <strong>Estimated Delivery:</strong> {estimatedDelivery}
                  </Text>
                )}

                {trackingLink && (
                  <Text style={{ ...bodyText, marginBottom: "8px" }}>
                    <strong>Tracking:</strong>{" "}
                    <Link href={trackingLink} style={secondaryLink}>
                      Track your order →
                    </Link>
                  </Text>
                )}
              </>
            )}

            {/* CTA Buttons */}
            <Section style={{ textAlign: "center", margin: "32px 0 16px" }}>
              <Button href={orderUrl} style={primaryBtn}>
                View Your Order
              </Button>
            </Section>

            <Section style={{ textAlign: "center", marginBottom: "8px" }}>
              <Link href={shopUrl} style={secondaryLink}>
                Continue Shopping →
              </Link>
            </Section>

            {/* WhatsApp */}
            {whatsappPhone && (
              <Section style={{ textAlign: "center", marginTop: "16px" }}>
                <Text style={{ fontSize: "12px", color: "#6b7280" }}>
                  Questions? Chat with us on{" "}
                  <Link
                    href={`https://wa.me/${whatsappPhone}`}
                    style={{ color: "#10b981", fontWeight: 600, textDecoration: "none" }}
                  >
                    WhatsApp
                  </Link>
                </Text>
              </Section>
            )}
          </Section>

          {/* ---- Footer ---- */}
          <Section style={footerSection}>
            <Text style={footerLoveText}>
              Every order is special to us. Thank you for trusting us with your creativity!
            </Text>
            <Text style={footerText}>
              Need help?{" "}
              <Link href={`mailto:${supportEmail}`} style={{ color: "#ec4899", textDecoration: "none" }}>
                {supportEmail}
              </Link>
            </Text>
            <Text style={footerText}>
              Aiel Design &amp; Printing Studio · Puducherry, India
              <br />© {new Date().getFullYear()} Aiel Studio. All rights reserved.
            </Text>
            <Text style={{ ...footerText, marginTop: "12px", fontSize: "10px" }}>
              You received this email because you placed an order. This is a transactional message, not marketing.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default OrderConfirmationEmail;
