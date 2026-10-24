import { useQuery } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { PRODUCTS, type Product, type ProductColor, type BulkPriceTier } from "@/data/products";

export interface DatabaseProduct extends Product {
  gsm?: number | string;
  material?: string;
  fit?: string;
  careInstructions?: string;
  inStock?: boolean;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku?: string;
  size?: string;
  colorName?: string;
  colorHex?: string;
  printType?: string;
  additionalPrice: number;
  stockQuantity: number;
  isAvailable: boolean;
}

/**
 * Maps raw Supabase row into strongly-typed Product object
 */
export function mapRowToProduct(row: Record<string, any>): DatabaseProduct {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    category: row.category,
    categoryLabel: String(row.category_label || row.category),
    price: Number(row.price),
    originalPrice: Number(row.original_price || 0),
    badge: row.badge || undefined,
    isSoldOut: Boolean(row.is_sold_out || row.in_stock === false),
    inStock: row.in_stock !== undefined ? Boolean(row.in_stock) : !Boolean(row.is_sold_out),
    image: String(row.image),
    gallery: Array.isArray(row.gallery) && row.gallery.length > 0 ? row.gallery : [String(row.image)],
    description: String(row.description || ""),
    sizes: Array.isArray(row.sizes) ? row.sizes : [],
    colors: Array.isArray(row.colors) ? (row.colors as ProductColor[]) : [],
    printTypes: Array.isArray(row.print_types) ? row.print_types : [],
    bulkPricing: Array.isArray(row.bulk_pricing) ? (row.bulk_pricing as BulkPriceTier[]) : [],
    minOrder: Number(row.min_order || 1),
    turnaround: String(row.turnaround || "48h"),
    rating: Number(row.rating || 4.9),
    reviewsCount: Number(row.reviews_count || 12),
    gsm: row.gsm || undefined,
    material: row.material || undefined,
    fit: row.fit || undefined,
    careInstructions: row.care_instructions || undefined,
  };
}

/**
 * Fetch all products from Supabase with fallback to catalog
 */
export async function getProductsFromSupabase(): Promise<DatabaseProduct[]> {
  if (!isSupabaseConfigured()) {
    return PRODUCTS as DatabaseProduct[];
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return PRODUCTS as DatabaseProduct[];
    }

    return data.map(mapRowToProduct);
  } catch (err) {
    console.warn("Supabase products fetch failed, using fallback catalog:", err);
    return PRODUCTS as DatabaseProduct[];
  }
}

/**
 * Fetch a single product by slug from Supabase
 */
export async function getProductBySlugFromSupabase(slug: string): Promise<DatabaseProduct | null> {
  if (!isSupabaseConfigured()) {
    const local = PRODUCTS.find((p) => p.slug === slug);
    return (local as DatabaseProduct) || null;
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) {
      const local = PRODUCTS.find((p) => p.slug === slug);
      return (local as DatabaseProduct) || null;
    }

    return mapRowToProduct(data);
  } catch (err) {
    console.warn(`Supabase getProductBySlug failed for ${slug}:`, err);
    const local = PRODUCTS.find((p) => p.slug === slug);
    return (local as DatabaseProduct) || null;
  }
}

/**
 * Fetch product variants for a given product id
 */
export async function getProductVariants(productId: string): Promise<ProductVariant[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("variants")
      .select("*")
      .eq("product_id", productId);

    if (error || !data) return [];

    return data.map((v) => ({
      id: v.id,
      productId: v.product_id,
      sku: v.sku,
      size: v.size,
      colorName: v.color_name,
      colorHex: v.color_hex,
      printType: v.print_type,
      additionalPrice: Number(v.additional_price || 0),
      stockQuantity: Number(v.stock_quantity || 0),
      isAvailable: Boolean(v.is_available),
    }));
  } catch (err) {
    console.warn(`Failed to fetch variants for ${productId}:`, err);
    return [];
  }
}

/**
 * React Hook for live Supabase products
 */
export function useProducts(initialData?: DatabaseProduct[]) {
  return useQuery<DatabaseProduct[]>({
    queryKey: ["products"],
    queryFn: getProductsFromSupabase,
    initialData: initialData && initialData.length > 0 ? initialData : (PRODUCTS as DatabaseProduct[]),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}

/**
 * React Hook for single product
 */
export function useProduct(slug: string, initialProduct?: DatabaseProduct | null) {
  return useQuery<DatabaseProduct | null>({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlugFromSupabase(slug),
    initialData: initialProduct ?? undefined,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * React Hook for variants
 */
export function useProductVariants(productId: string) {
  return useQuery<ProductVariant[]>({
    queryKey: ["product-variants", productId],
    queryFn: () => getProductVariants(productId),
    enabled: Boolean(productId),
    staleTime: 1000 * 60 * 5,
  });
}
