import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { DatabaseProduct } from "@/lib/products-service";
import { APPAREL_SEED_PRODUCTS } from "@/data/apparel-seed";

export interface AdminProductPayload {
  id?: string;
  slug: string;
  name: string;
  category: string;
  category_label: string;
  subcategory?: string;
  price: number;
  original_price: number;
  badge?: string;
  in_stock: boolean;
  is_sold_out: boolean;
  image: string;
  gallery: string[];
  description: string;
  sizes: string[];
  colors: { name: string; hex: string; frontImage?: string; backImage?: string }[];
  print_types: string[];
  bulk_pricing?: { qty: string; price: number }[];
  min_order?: number;
  turnaround?: string;
  gsm?: number;
  material?: string;
  fit?: string;
  care_instructions?: string;
}

export interface AdminVariantPayload {
  id?: string;
  product_id: string;
  sku: string;
  size: string;
  color_name: string;
  color_hex?: string;
  additional_price: number;
  stock_quantity: number;
  is_available: boolean;
}

/**
 * Fetch all products for admin
 */
export async function adminGetProducts(): Promise<DatabaseProduct[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as DatabaseProduct[];
}

/**
 * Create a new product
 */
export async function adminCreateProduct(payload: AdminProductPayload): Promise<{ data: any; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: "Supabase credentials not configured." };
  }

  const id = payload.id || payload.slug || `prod-${Date.now()}`;
  const row = {
    ...payload,
    id,
  };

  const { data, error } = await supabase.from("products").insert(row).select().single();
  return { data, error: error?.message || null };
}

/**
 * Update an existing product
 */
export async function adminUpdateProduct(
  id: string,
  updates: Partial<AdminProductPayload>
): Promise<{ data: any; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: "Supabase credentials not configured." };
  }

  const { data, error } = await supabase.from("products").update(updates).eq("id", id).select().single();
  return { data, error: error?.message || null };
}

/**
 * Delete a product
 */
export async function adminDeleteProduct(id: string): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase credentials not configured." };
  }

  // First delete associated variants
  await supabase.from("variants").delete().eq("product_id", id);
  const { error } = await supabase.from("products").delete().eq("id", id);
  return { error: error?.message || null };
}

/**
 * Upload an image to Supabase Storage
 */
export async function adminUploadImage(file: File): Promise<{ url: string | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { url: null, error: "Supabase not configured" };
  }

  try {
    const ext = file.name.split(".").pop();
    const fileName = `apparel-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const filePath = `products/${fileName}`;

    // Try uploading to 'products' or 'public' bucket
    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(filePath, file, { cacheControl: "3600", upsert: true });

    if (uploadError) {
      // If bucket does not exist, return object URL or fallback
      return { url: null, error: uploadError.message };
    }

    const { data } = supabase.storage.from("products").getPublicUrl(filePath);
    return { url: data.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err.message || "Failed to upload image" };
  }
}

/**
 * Fetch variants for a product
 */
export async function adminGetVariants(productId: string): Promise<any[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await supabase.from("variants").select("*").eq("product_id", productId);
  if (error || !data) return [];
  return data;
}

/**
 * Update a variant's stock or price
 */
export async function adminUpdateVariant(
  id: string,
  updates: Partial<AdminVariantPayload>
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase not configured" };
  }
  const { error } = await supabase.from("variants").update(updates).eq("id", id);
  return { error: error?.message || null };
}

/**
 * Trigger online seed import
 */
export async function adminSyncSeedData(): Promise<{ success: boolean; count: number; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { success: false, count: 0, error: "Supabase not configured." };
  }

  let count = 0;
  try {
    for (const p of APPAREL_SEED_PRODUCTS) {
      const row = {
        id: p.id,
        slug: p.slug,
        name: p.name,
        category: p.category,
        category_label: p.category_label,
        price: p.price,
        original_price: p.original_price,
        badge: p.badge,
        in_stock: p.in_stock,
        is_sold_out: p.is_sold_out,
        image: p.image,
        gallery: p.gallery,
        description: p.description,
        sizes: p.sizes,
        colors: p.colors,
        print_types: p.print_types,
        bulk_pricing: p.bulk_pricing,
        min_order: p.min_order,
        turnaround: p.turnaround,
        rating: p.rating,
        reviews_count: p.reviews_count,
        gsm: p.gsm,
        material: p.material,
        fit: p.fit,
        care_instructions: p.care_instructions,
      };

      const { error } = await supabase.from("products").upsert(row, { onConflict: "id" });
      if (!error) count++;
    }

    return { success: true, count, error: null };
  } catch (err: any) {
    return { success: false, count, error: err.message };
  }
}

/**
 * Fetch customization quote requests
 */
export async function adminGetCustomizationRequests(): Promise<any[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from("product_customizations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) {
      // Fallback to checking orders
      const { data: orders } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);
      return orders || [];
    }
    return data;
  } catch {
    return [];
  }
}
