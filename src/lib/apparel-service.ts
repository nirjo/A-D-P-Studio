import { useQuery } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { DatabaseProduct } from "@/lib/products-service";
import type { ProductColor } from "@/data/products";

/* ─── Types ─── */

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  parentCategory: string | null;
  description: string | null;
  image: string | null;
  sortOrder: number;
}

export interface ProductImage {
  id: string;
  productId: string;
  colorName: string | null;
  imageUrl: string;
  altText: string | null;
  position: string;
  sortOrder: number;
}

export interface SizeChartEntry {
  id: string;
  categoryId: string;
  sizeLabel: string;
  chestCm: number | null;
  lengthCm: number | null;
  shoulderCm: number | null;
  sleeveCm: number | null;
  hipCm: number | null;
}

export type ApparelSubcategory =
  | "all"
  | "round-neck"
  | "polo"
  | "oversized"
  | "hoodie"
  | "sweatshirt"
  | "jersey";

export const APPAREL_SUBCATEGORIES: {
  id: ApparelSubcategory;
  label: string;
  icon: string;
}[] = [
  { id: "all", label: "All Apparel", icon: "👕" },
  { id: "round-neck", label: "Round Neck", icon: "👔" },
  { id: "polo", label: "Polo", icon: "🎽" },
  { id: "oversized", label: "Oversized", icon: "🧥" },
  { id: "hoodie", label: "Hoodies", icon: "🧥" },
  { id: "sweatshirt", label: "Sweatshirts", icon: "👘" },
  { id: "jersey", label: "Jerseys", icon: "⚽" },
];

export const APPAREL_COLORS: ProductColor[] = [
  { name: "Black", hex: "#1A1A1A" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Navy Blue", hex: "#1E3A5F" },
  { name: "Maroon", hex: "#800020" },
  { name: "Red", hex: "#DC2626" },
  { name: "Forest Green", hex: "#228B22" },
  { name: "Grey Melange", hex: "#9CA3AF" },
  { name: "Beige", hex: "#D2B48C" },
  { name: "Olive", hex: "#556B2F" },
  { name: "Charcoal", hex: "#36454F" },
];

export const APPAREL_SIZES = ["S", "M", "L", "XL", "XXL", "XXXL"];

/* ─── Data Fetching ─── */

/**
 * Fetch all apparel products (category = 'tshirts')
 */
export async function getApparelProducts(): Promise<DatabaseProduct[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", "tshirts")
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map(mapApparelRow);
  } catch {
    console.warn("Failed to fetch apparel products");
    return [];
  }
}

/**
 * Fetch apparel products by subcategory
 */
export async function getApparelBySubcategory(
  subcategory: string
): Promise<DatabaseProduct[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const query = supabase
      .from("products")
      .select("*")
      .eq("category", "tshirts")
      .order("created_at", { ascending: false });

    if (subcategory !== "all") {
      query.ilike("category_label", `%${subcategory}%`);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map(mapApparelRow);
  } catch {
    return [];
  }
}

/**
 * Fetch product_images for a product, optionally filtered by color
 */
export async function getProductImages(
  productId: string,
  colorName?: string
): Promise<ProductImage[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    let query = supabase
      .from("product_images")
      .select("*")
      .eq("product_id", productId)
      .order("sort_order", { ascending: true });

    if (colorName) {
      query = query.or(`color_name.eq.${colorName},color_name.is.null`);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return (data as any[]).map((row) => ({
      id: row["id"],
      productId: row["product_id"],
      colorName: row["color_name"],
      imageUrl: row["image_url"],
      altText: row["alt_text"],
      position: row["position"],
      sortOrder: row["sort_order"],
    }));
  } catch {
    return [];
  }
}

/**
 * Fetch apparel categories
 */
export async function getApparelCategories(): Promise<ProductCategory[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const { data, error } = await supabase
      .from("product_categories")
      .select("*")
      .eq("parent_category", "apparel")
      .order("sort_order", { ascending: true });

    if (error || !data) return [];

    return (data as any[]).map((row) => ({
      id: row["id"],
      name: row["name"],
      slug: row["slug"],
      parentCategory: row["parent_category"],
      description: row["description"],
      image: row["image"],
      sortOrder: row["sort_order"],
    }));
  } catch {
    return [];
  }
}

/**
 * Fetch size chart for a subcategory
 */
export async function getSizeChart(
  categoryId: string
): Promise<SizeChartEntry[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const { data, error } = await supabase
      .from("product_size_charts")
      .select("*")
      .eq("category_id", categoryId)
      .order("chest_cm", { ascending: true });

    if (error || !data) return [];

    return (data as any[]).map((row) => ({
      id: row["id"],
      categoryId: row["category_id"],
      sizeLabel: row["size_label"],
      chestCm: row["chest_cm"],
      lengthCm: row["length_cm"],
      shoulderCm: row["shoulder_cm"],
      sleeveCm: row["sleeve_cm"],
      hipCm: row["hip_cm"],
    }));
  } catch {
    return [];
  }
}

export interface CustomizationRequestPayload {
  productId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | undefined;
  selectedColor?: string | undefined;
  selectedSize?: string | undefined;
  quantity: number;
  printMethod?: string | undefined;
  printPositions: string[];
  printSize?: string | undefined;
  artworkUrl?: string | undefined;
  instructions?: string | undefined;
  garmentPrice?: number | undefined;
}

/**
 * Submit a customization / quotation request
 */
export async function submitCustomizationRequest(
  req: CustomizationRequestPayload
): Promise<{ success: boolean; error?: string | undefined }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Database not configured" };
  }

  try {
    const { error } = await supabase
      .from("product_customizations")
      .insert({
        product_id: req.productId,
        customer_name: req.customerName,
        customer_email: req.customerEmail,
        customer_phone: req.customerPhone ?? null,
        selected_color: req.selectedColor ?? null,
        selected_size: req.selectedSize ?? null,
        quantity: req.quantity,
        print_method: req.printMethod ?? null,
        print_positions: req.printPositions,
        print_size: req.printSize ?? null,
        artwork_url: req.artworkUrl ?? null,
        instructions: req.instructions ?? null,
        garment_price: req.garmentPrice ?? null,
        status: "pending",
      });

    if (error) {
      // Fallback: save as order request in orders table
      const orderNumber = `QUOTE-${Date.now().toString(36).toUpperCase()}`;
      await supabase.from("orders").insert({
        order_number: orderNumber,
        customer_name: req.customerName,
        customer_email: req.customerEmail,
        customer_phone: req.customerPhone ?? null,
        subtotal: (req.garmentPrice || 0) * req.quantity,
        grand_total: (req.garmentPrice || 0) * req.quantity,
        status: "mockup_approval",
        payment_method: "whatsapp_upi",
        notes: `Custom Quote Request: ${req.printMethod || "DTF"} on ${req.printPositions.join(", ")} | Size: ${req.printSize || "Standard"}. Instructions: ${req.instructions || "None"}`,
        items: [
          {
            productId: req.productId,
            quantity: req.quantity,
            selectedColor: req.selectedColor,
            selectedSize: req.selectedSize,
          },
        ],
      });
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to submit" };
  }
}

/* ─── Mapping ─── */

function mapApparelRow(r: any): DatabaseProduct {
  return {
    id: String(r["id"]),
    slug: String(r["slug"]),
    name: String(r["name"]),
    category: r["category"],
    categoryLabel: String(r["category_label"] || "T-Shirts & Apparel"),
    subcategory: r["subcategory"] || undefined,
    price: Number(r["price"]),
    originalPrice: Number(r["original_price"] || 0),
    badge: r["badge"] || undefined,
    isSoldOut: Boolean(r["is_sold_out"]),
    inStock:
      r["in_stock"] !== undefined
        ? Boolean(r["in_stock"])
        : !Boolean(r["is_sold_out"]),
    image: String(r["image"]),
    gallery:
      Array.isArray(r["gallery"]) && r["gallery"].length > 0
        ? r["gallery"]
        : [String(r["image"])],
    description: String(r["description"] || ""),
    sizes: Array.isArray(r["sizes"]) ? r["sizes"] : [],
    colors: Array.isArray(r["colors"]) ? (r["colors"] as ProductColor[]) : [],
    printTypes: Array.isArray(r["print_types"]) ? r["print_types"] : [],
    bulkPricing: Array.isArray(r["bulk_pricing"]) ? r["bulk_pricing"] : [],
    minOrder: Number(r["min_order"] || 1),
    turnaround: String(r["turnaround"] || "48h"),
    rating: Number(r["rating"] || 4.9),
    reviewsCount: Number(r["reviews_count"] || 0),
    gsm: r["gsm"] || undefined,
    material: r["material"] || undefined,
    fit: r["fit"] || undefined,
    fabric: r["fabric"] || undefined,
    careInstructions: r["care_instructions"] || undefined,
  } as DatabaseProduct;
}

/* ─── React Hooks ─── */

export function useApparelProducts(subcategory: ApparelSubcategory = "all") {
  return useQuery<DatabaseProduct[]>({
    queryKey: ["apparel-products", subcategory],
    queryFn: () =>
      subcategory === "all"
        ? getApparelProducts()
        : getApparelBySubcategory(subcategory),
    staleTime: 1000 * 60 * 5,
  });
}

export function useProductImages(productId: string, colorName?: string) {
  return useQuery<ProductImage[]>({
    queryKey: ["product-images", productId, colorName],
    queryFn: () => getProductImages(productId, colorName),
    enabled: Boolean(productId),
    staleTime: 1000 * 60 * 10,
  });
}

export function useApparelCategories() {
  return useQuery<ProductCategory[]>({
    queryKey: ["apparel-categories"],
    queryFn: getApparelCategories,
    staleTime: 1000 * 60 * 30,
  });
}

export function useSizeChart(categoryId: string) {
  return useQuery<SizeChartEntry[]>({
    queryKey: ["size-chart", categoryId],
    queryFn: () => getSizeChart(categoryId),
    enabled: Boolean(categoryId),
    staleTime: 1000 * 60 * 30,
  });
}
