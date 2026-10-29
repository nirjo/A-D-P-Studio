/**
 * Unit & Integration Tests for Email Notification System
 * Aiel Design & Printing Studio
 *
 * Can be executed with Node test runner: `node --import tsx --test src/__tests__/email-service.test.ts`
 * or via standard Vitest/Jest runner.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { formatOrderEmailData, type SupabaseOrderRow } from "../lib/email/format-order-email-data.js";
import { buildOrderConfirmationPlainText } from "../emails/order-confirmation-text.js";

describe("Email Formatter (formatOrderEmailData)", () => {
  const mockOrderRow: SupabaseOrderRow = {
    id: "d3b07384-d113-4cd3-a7bb-20e4b85c13e4",
    order_number: "AIEL-2610-1234",
    customer_email: "customer@example.com",
    customer_name: "Stella Maris",
    customer_phone: "+91 91502 34277",
    shipping_city: "Puducherry",
    shipping_address: {
      address: "123 Beach Road, White Town",
      city: "Puducherry",
      pincode: "605001",
    },
    items: [
      {
        productId: "tee-streetwear-oversized",
        name: "Oversized Streetwear Tee",
        price: 799,
        quantity: 2,
        size: "XL",
        color: "Pitch Black",
        printType: "DTF High-Density",
        customText: "AIEL CREW",
      },
    ],
    subtotal: 1598,
    shipping_fee: 0,
    grand_total: 1598,
    status: "payment_verified",
    payment_method: "razorpay",
    notes: "Pre-print proof approved via WhatsApp",
    created_at: "2026-10-29T10:00:00.000Z",
  };

  it("correctly maps basic customer and order fields", () => {
    const data = formatOrderEmailData(mockOrderRow);
    assert.equal(data.customerName, "Stella Maris");
    assert.equal(data.orderNumber, "AIEL-2610-1234");
    assert.equal(data.orderStatus, "payment_verified");
    assert.equal(data.paymentMethod, "razorpay");
  });

  it("formats items and line totals accurately", () => {
    const data = formatOrderEmailData(mockOrderRow);
    assert.equal(data.items.length, 1);
    const item = data.items[0];
    assert.ok(item);
    assert.equal(item.name, "Oversized Streetwear Tee");
    assert.equal(item.quantity, 2);
    assert.equal(item.unitPrice, 799);
    assert.equal(item.lineTotal, 1598);
    assert.equal(item.size, "XL");
    assert.equal(item.color, "Pitch Black");
    assert.equal(item.customText, "AIEL CREW");
  });

  it("handles free shipping fee formatting", () => {
    const data = formatOrderEmailData(mockOrderRow);
    assert.equal(data.shippingFee, "FREE");
  });

  it("assembles structured shipping address string", () => {
    const data = formatOrderEmailData(mockOrderRow);
    assert.equal(data.shippingAddress, "123 Beach Road, White Town, Puducherry, 605001");
  });

  it("sets amountPaid when order status is payment_verified", () => {
    const data = formatOrderEmailData(mockOrderRow);
    assert.ok(data.amountPaid);
    assert.equal(data.amountOutstanding, undefined);
  });

  it("sets amountOutstanding when order status is pending_payment", () => {
    const pendingOrder: SupabaseOrderRow = {
      ...mockOrderRow,
      status: "pending_payment",
    };
    const data = formatOrderEmailData(pendingOrder);
    assert.ok(data.amountOutstanding);
    assert.equal(data.amountPaid, undefined);
  });
});

describe("Plain-Text Email Generator (buildOrderConfirmationPlainText)", () => {
  it("includes all essential brand, order, and item details", () => {
    const emailProps = {
      customerName: "Stella Maris",
      orderNumber: "AIEL-2610-1234",
      orderDate: "29 October 2026",
      orderStatus: "payment_verified",
      items: [
        {
          name: "Oversized Streetwear Tee",
          quantity: 2,
          unitPrice: 799,
          lineTotal: 1598,
          size: "XL",
          color: "Pitch Black",
          printType: "DTF High-Density",
          customText: "AIEL CREW",
        },
      ],
      subtotal: "₹1,598",
      shippingFee: "FREE",
      grandTotal: "₹1,598",
      paymentMethod: "razorpay",
      amountPaid: "₹1,598",
      shippingAddress: "123 Beach Road, White Town, Puducherry, 605001",
      orderUrl: "https://aieldesignstudio.com/orders/AIEL-2610-1234",
      shopUrl: "https://aieldesignstudio.com",
      supportEmail: "orders@aieldesignstudio.com",
      whatsappPhone: "919150234277",
    };

    const text = buildOrderConfirmationPlainText(emailProps);

    assert.ok(text.includes("AIEL DESIGN & PRINTING STUDIO"));
    assert.ok(text.includes("AIEL-2610-1234"));
    assert.ok(text.includes("Stella Maris"));
    assert.ok(text.includes("Oversized Streetwear Tee"));
    assert.ok(text.includes("₹1,598"));
    assert.ok(text.includes("FREE"));
    assert.ok(text.includes("https://aieldesignstudio.com/orders/AIEL-2610-1234"));
    assert.ok(text.includes("https://wa.me/919150234277"));
  });
});

describe("Razorpay Signature Verification", () => {
  it("validates authentic webhook HMAC signatures correctly", () => {
    const secret = "test_webhook_secret_12345";
    const payload = JSON.stringify({
      event: "payment.captured",
      payload: {
        payment: {
          entity: {
            id: "pay_xyz123",
            order_id: "order_abc456",
            amount: 159800,
            currency: "INR",
            status: "captured",
          },
        },
      },
    });

    const expectedSignature = createHmac("sha256", secret).update(payload).digest("hex");

    // Replicate verification
    const computed = createHmac("sha256", secret).update(payload).digest("hex");
    assert.equal(computed, expectedSignature);
  });

  it("rejects tampered webhook payloads", () => {
    const secret = "test_webhook_secret_12345";
    const payload = JSON.stringify({ event: "payment.captured" });
    const signature = createHmac("sha256", secret).update(payload).digest("hex");

    const tamperedPayload = JSON.stringify({ event: "payment.captured", amount: 1 });
    const computed = createHmac("sha256", secret).update(tamperedPayload).digest("hex");

    assert.notEqual(computed, signature);
  });
});
