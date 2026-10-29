import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { PRODUCTS, type Product } from "@/data/products";
import type { CartItem } from "@/lib/cart";

export interface CustomerInput {
  email: string;
  fullName: string;
  phone?: string;
  city?: string;
  shippingAddress?: Record<string, unknown>;
  authUserId?: string;
}

export interface CreateOrderInput {
  customer: CustomerInput;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  grandTotal: number;
  notes?: string;
  paymentMethod?: "razorpay" | "whatsapp_upi" | "cod";
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  status: string;
  grandTotal: number;
  createdAt: string;
}

/**
 * Generate a clean, branded order number e.g. AIEL-2610-8472
 */
export function generateOrderNumber(): string {
  const date = new Date();
  const yearSuffix = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `AIEL-${yearSuffix}${month}-${randomPart}`;
}

/**
 * Fetch products from Supabase database with fallback to local PRODUCTS array
 */
export async function fetchProductsFromDatabase(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return PRODUCTS;
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      // Graceful fallback to rich local product catalog if DB table is empty
      return PRODUCTS;
    }

    return data.map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      category: row.category,
      categoryLabel: row.category_label,
      price: Number(row.price),
      originalPrice: Number(row.original_price || 0),
      badge: row.badge,
      isSoldOut: Boolean(row.is_sold_out),
      image: row.image,
      gallery: Array.isArray(row.gallery) ? row.gallery : [],
      description: row.description || "",
      sizes: Array.isArray(row.sizes) ? row.sizes : [],
      colors: Array.isArray(row.colors) ? row.colors : [],
      printTypes: Array.isArray(row.print_types) ? row.print_types : [],
      bulkPricing: Array.isArray(row.bulk_pricing) ? row.bulk_pricing : [],
      minOrder: Number(row.min_order || 1),
      turnaround: row.turnaround || "48h",
      rating: Number(row.rating || 4.9),
      reviewsCount: Number(row.reviews_count || 0),
    }));
  } catch (err) {
    console.warn("Falling back to local product data:", err);
    return PRODUCTS;
  }
}

/**
 * Create or update customer record, then persist an order and initial payment status in Supabase
 */
export async function createOrderInDatabase(input: CreateOrderInput): Promise<{
  success: boolean;
  order?: OrderRecord;
  error?: string;
}> {
  const orderNumber = generateOrderNumber();

  if (!isSupabaseConfigured()) {
    // Local / Offline fallback mode
    const mockOrder: OrderRecord = {
      id: `local-${Date.now()}`,
      orderNumber,
      status: "pending_payment",
      grandTotal: input.grandTotal,
      createdAt: new Date().toISOString(),
    };
    return { success: true, order: mockOrder };
  }

  try {
    let customerId: string | null = null;

    // 1. Try to find or insert customer
    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id")
      .eq("email", input.customer.email.toLowerCase().trim())
      .maybeSingle();

    if (existingCustomer?.id) {
      customerId = existingCustomer.id;
    } else {
      const { data: newCustomer, error: custErr } = await supabase
        .from("customers")
        .insert({
          email: input.customer.email.toLowerCase().trim(),
          full_name: input.customer.fullName.trim(),
          phone: input.customer.phone || null,
          city: input.customer.city || null,
          shipping_address: input.customer.shippingAddress || {},
          auth_user_id: input.customer.authUserId || null,
        })
        .select("id")
        .single();

      if (!custErr && newCustomer) {
        customerId = newCustomer.id;
      }
    }

    // 2. Insert order record
    const { data: orderData, error: orderErr } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_id: customerId,
        customer_email: input.customer.email.toLowerCase().trim(),
        customer_name: input.customer.fullName.trim(),
        customer_phone: input.customer.phone || null,
        shipping_city: input.customer.city || null,
        shipping_address: input.customer.shippingAddress || {},
        items: input.items.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          size: i.selectedSize,
          color: i.selectedColor,
          printType: i.selectedPrintType,
          customText: i.customText,
          notes: i.notes,
        })),
        subtotal: input.subtotal,
        shipping_fee: input.shippingFee,
        grand_total: input.grandTotal,
        status: "pending_payment",
        payment_method: input.paymentMethod || "razorpay",
        notes: input.notes || null,
      })
      .select("id, order_number, status, grand_total, created_at")
      .single();

    if (orderErr || !orderData) {
      console.error("Supabase order insert failed:", orderErr);

      // Handle missing table in schema cache (PGRST205) or database uninitialized
      if (
        orderErr?.code === "PGRST205" ||
        orderErr?.message?.includes("schema cache") ||
        orderErr?.message?.includes("does not exist")
      ) {
        console.warn(
          "Supabase table 'public.orders' is not yet initialized in the project schema cache. Falling back to local order fulfillment. Please run supabase/schema.sql in the Supabase SQL Editor.",
          orderErr
        );
        const fallbackOrder: OrderRecord = {
          id: `local-${Date.now()}`,
          orderNumber,
          status: "pending_payment",
          grandTotal: input.grandTotal,
          createdAt: new Date().toISOString(),
        };
        return {
          success: true,
          order: fallbackOrder,
        };
      }

      return { success: false, error: orderErr?.message || "Failed to create order" };
    }

    // 3. Insert initial payment_status record
    try {
      if (orderData?.id) {
        await supabase.from("payment_status").insert({
          order_id: orderData.id,
          gateway: input.paymentMethod || "razorpay",
          status: "created",
          amount: input.grandTotal,
          currency: "INR",
          payment_link: "https://razorpay.me/@stella3321",
        });
      }
    } catch (payErr) {
      console.warn("Non-fatal: could not create payment_status row:", payErr);
    }

    return {
      success: true,
      order: {
        id: orderData.id,
        orderNumber: orderData.order_number,
        status: orderData.status,
        grandTotal: Number(orderData.grand_total),
        createdAt: orderData.created_at,
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected database error";
    console.error("Order creation error:", err);
    return { success: false, error: message };
  }
}
