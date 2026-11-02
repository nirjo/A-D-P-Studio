import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import type { CartItem } from "@/lib/cart";

export interface CustomerProfile {
  id: string;
  authUserId: string | null;
  email: string;
  fullName: string;
  phone: string | null;
  city: string | null;
  shippingAddress: {
    address?: string;
    city?: string;
    pincode?: string;
    state?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string | null;
  shippingCity: string | null;
  shippingAddress: Record<string, any>;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
    printType?: string;
    customText?: string;
    notes?: string;
  }>;
  subtotal: number;
  shippingFee: number;
  grandTotal: number;
  status:
    | "pending_payment"
    | "payment_verified"
    | "mockup_approval"
    | "in_production"
    | "dispatched"
    | "delivered"
    | "cancelled";
  paymentMethod: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Sync or upsert customer profile on login/sign-up (including Google OAuth)
 */
export async function syncCustomerProfile(user: User): Promise<CustomerProfile | null> {
  if (!isSupabaseConfigured() || !user.email) return null;

  try {
    const email = user.email.toLowerCase().trim();
    const fullName =
      (user.user_metadata?.["full_name"] as string) ||
      (user.user_metadata?.["name"] as string) ||
      email.split("@")[0] ||
      "Customer";

    // 1. Check if customer already exists by auth_user_id or email
    const { data: existing, error: findErr } = await supabase
      .from("customers")
      .select("*")
      .or(`auth_user_id.eq.${user.id},email.eq.${email}`)
      .limit(1)
      .maybeSingle();

    if (existing) {
      // Update with auth_user_id if missing
      if (!existing.auth_user_id) {
        await supabase
          .from("customers")
          .update({
            auth_user_id: user.id,
            full_name: existing.full_name || fullName,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
      }
      return {
        id: existing.id,
        authUserId: user.id,
        email: existing.email,
        fullName: existing.full_name || fullName,
        phone: existing.phone,
        city: existing.city,
        shippingAddress: existing.shipping_address || {},
        createdAt: existing.created_at,
        updatedAt: existing.updated_at,
      };
    }

    // 2. Insert new customer record
    const { data: created, error: insertErr } = await supabase
      .from("customers")
      .insert({
        auth_user_id: user.id,
        email,
        full_name: fullName,
        phone: (user.user_metadata?.["phone"] as string) || null,
        shipping_address: {},
      })
      .select("*")
      .maybeSingle();

    if (insertErr || !created) {
      console.warn("Could not insert customer record:", insertErr?.message);
      return null;
    }

    return {
      id: created.id,
      authUserId: user.id,
      email: created.email,
      fullName: created.full_name,
      phone: created.phone,
      city: created.city,
      shippingAddress: created.shipping_address || {},
      createdAt: created.created_at,
      updatedAt: created.updated_at,
    };
  } catch (err) {
    console.warn("syncCustomerProfile exception:", err);
    return null;
  }
}

/**
 * Fetch customer profile by user ID or email
 */
export async function getCustomerProfile(user: User): Promise<CustomerProfile | null> {
  if (!isSupabaseConfigured() || !user.email) return null;

  try {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .or(`auth_user_id.eq.${user.id},email.eq.${user.email.toLowerCase().trim()}`)
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      // Fallback create
      return await syncCustomerProfile(user);
    }

    return {
      id: data.id,
      authUserId: data.auth_user_id || user.id,
      email: data.email,
      fullName: data.full_name,
      phone: data.phone,
      city: data.city,
      shippingAddress: data.shipping_address || {},
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (err) {
    console.warn("getCustomerProfile error:", err);
    return null;
  }
}

/**
 * Update customer profile details (Full name, phone, city, shipping address)
 */
export async function updateCustomerProfile(
  customerId: string,
  updates: {
    fullName?: string;
    phone?: string;
    city?: string;
    shippingAddress?: {
      address?: string;
      city?: string;
      pincode?: string;
      state?: string;
    };
  }
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: false, error: "Database not configured" };

  try {
    const payload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (updates.fullName !== undefined) payload.full_name = updates.fullName.trim();
    if (updates.phone !== undefined) payload.phone = updates.phone.trim();
    if (updates.city !== undefined) payload.city = updates.city.trim();
    if (updates.shippingAddress !== undefined) payload.shipping_address = updates.shippingAddress;

    const { error } = await supabase.from("customers").update(payload).eq("id", customerId);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Fetch all orders for a customer by user email or customer_id
 */
export async function getCustomerOrders(email: string, customerId?: string): Promise<CustomerOrder[]> {
  if (!isSupabaseConfigured() || !email) return [];

  try {
    let query = supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (customerId) {
      query = query.or(`customer_email.eq.${email.toLowerCase().trim()},customer_id.eq.${customerId}`);
    } else {
      query = query.eq("customer_email", email.toLowerCase().trim());
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((o) => ({
      id: o.id,
      orderNumber: o.order_number,
      customerEmail: o.customer_email,
      customerName: o.customer_name,
      customerPhone: o.customer_phone,
      shippingCity: o.shipping_city,
      shippingAddress: o.shipping_address || {},
      items: Array.isArray(o.items) ? o.items : [],
      subtotal: Number(o.subtotal || 0),
      shippingFee: Number(o.shipping_fee || 0),
      grandTotal: Number(o.grand_total || 0),
      status: o.status || "pending_payment",
      paymentMethod: o.payment_method || "razorpay",
      notes: o.notes,
      createdAt: o.created_at,
      updatedAt: o.updated_at,
    }));
  } catch (err) {
    console.warn("getCustomerOrders error:", err);
    return [];
  }
}
