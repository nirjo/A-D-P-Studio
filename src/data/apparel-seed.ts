/**
 * AIEL Apparel Seed Script
 * Generates 36+ high quality apparel products across 6 categories:
 * - Round Neck T-Shirts (rn-01 to rn-06)
 * - Polo T-Shirts (pl-01 to pl-06)
 * - Oversized T-Shirts (os-01 to os-06)
 * - Hoodies (hd-01 to hd-06)
 * - Sweatshirts (sw-01 to sw-06)
 * - Sports Jerseys (sj-01 to sj-06)
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://cisbahsmzwqqrmmwgncp.supabase.co";
const SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpc2JhaHNtendxcXJtbXdnbmNwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjY1MjI2NSwiZXhwIjoyMTA4MjI4MjY1fQ.2S-yAhvbMqBWHa852L3NjELLIPsmAcEbKfKembHK8mQ";

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

export interface ColorDefinition {
  name: string;
  hex: string;
  frontImage: string;
  backImage: string;
}

export interface ApparelSeedProduct {
  id: string;
  slug: string;
  name: string;
  category: "tshirts";
  category_label: string; // e.g. "Round Neck T-Shirts"
  subcategory: "round-neck" | "polo" | "oversized" | "hoodie" | "sweatshirt" | "jersey";
  price: number;
  original_price: number;
  badge?: "Best Seller" | "New" | "48h Rush" | "Made to order" | "Hot Deal" | "Bulk Fav";
  in_stock: boolean;
  is_sold_out: boolean;
  image: string;
  gallery: string[];
  description: string;
  sizes: string[];
  colors: ColorDefinition[];
  print_types: string[];
  bulk_pricing: { qty: string; price: number }[];
  min_order: number;
  turnaround: string;
  rating: number;
  reviews_count: number;
  gsm: number;
  material: string;
  fit: string;
  fabric: string;
  sku: string;
  care_instructions: string;
  printing_compatibility: string[];
}

export const APPAREL_SEED_PRODUCTS: ApparelSeedProduct[] = [
  // ─────────────────────────────────────────────────────────────
  // 1. ROUND NECK T-SHIRTS (6 items)
  // ─────────────────────────────────────────────────────────────
  {
    id: "rn-01",
    slug: "classic-180-gsm-bio-wash-round-neck",
    name: "Classic 180 GSM Bio-Wash Crewneck Tee",
    category: "tshirts",
    category_label: "Round Neck T-Shirts",
    subcategory: "round-neck",
    price: 399,
    original_price: 549,
    badge: "Best Seller",
    in_stock: true,
    is_sold_out: false,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80"
    ],
    description: "Everyday staple crafted from 100% super-combed ring-spun cotton. Ultra-smooth enzyme bio-washed surface prevents pilling and ensures vibrant color retention after 50+ washes. Ideal for brand drops, startups, and college fests.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    colors: [
      {
        name: "Black",
        hex: "#18181B",
        frontImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80"
      },
      {
        name: "White",
        hex: "#FFFFFF",
        frontImage: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80"
      },
      {
        name: "Navy Blue",
        hex: "#1E3A5F",
        frontImage: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"
      },
      {
        name: "Maroon",
        hex: "#800020",
        frontImage: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"
      },
      {
        name: "Forest Green",
        hex: "#228B22",
        frontImage: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80"
      },
      {
        name: "Grey Melange",
        hex: "#9CA3AF",
        frontImage: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"
      }
    ],
    print_types: ["DTF (Direct to Film)", "Plastisol Screen Print", "Puff 3D Print", "Vinyl Heat Seal"],
    bulk_pricing: [
      { qty: "1-9 pcs", price: 399 },
      { qty: "10-24 pcs", price: 339 },
      { qty: "25-49 pcs", price: 289 },
      { qty: "50+ pcs", price: 239 }
    ],
    min_order: 1,
    turnaround: "24-48 Hours",
    rating: 4.9,
    reviews_count: 124,
    gsm: 180,
    material: "100% Super-Combed Ring-Spun Cotton",
    fit: "Regular Unisex Fit",
    fabric: "Single Jersey 180 GSM",
    sku: "RN-180-BIO",
    care_instructions: "Machine wash cold inside out, tumble dry low, do not iron on print.",
    printing_compatibility: ["DTF", "Screen Print", "Vinyl", "Embroidery"]
  },
  {
    id: "rn-02",
    slug: "premium-200-gsm-combed-cotton-crewneck",
    name: "Premium 200 GSM Heavy Combed Crewneck",
    category: "tshirts",
    category_label: "Round Neck T-Shirts",
    subcategory: "round-neck",
    price: 449,
    original_price: 599,
    badge: "48h Rush",
    in_stock: true,
    is_sold_out: false,
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"
    ],
    description: "Substantial 200 GSM structured cotton tee with reinforced lycra neck ribbing. Pre-shrunk silicon washed fabric offers an exceptionally clean drape and zero transparency.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    colors: [
      {
        name: "White",
        hex: "#FFFFFF",
        frontImage: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"
      },
      {
        name: "Black",
        hex: "#18181B",
        frontImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80"
      },
      {
        name: "Beige",
        hex: "#D2B48C",
        frontImage: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"
      },
      {
        name: "Charcoal",
        hex: "#36454F",
        frontImage: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"
      }
    ],
    print_types: ["DTF (Direct to Film)", "High-Density Puff Print", "Screen Print"],
    bulk_pricing: [
      { qty: "1-9 pcs", price: 449 },
      { qty: "10-24 pcs", price: 389 },
      { qty: "25-49 pcs", price: 329 },
      { qty: "50+ pcs", price: 279 }
    ],
    min_order: 1,
    turnaround: "48 Hours",
    rating: 4.8,
    reviews_count: 89,
    gsm: 200,
    material: "100% Combed Compact Cotton",
    fit: "Tailored Relaxed Fit",
    fabric: "Single Jersey 200 GSM",
    sku: "RN-200-HVY",
    care_instructions: "Cold wash with similar colours, gentle cycle, do not bleach.",
    printing_compatibility: ["DTF", "Screen Print", "Vinyl"]
  },
  {
    id: "rn-03",
    slug: "acid-wash-vintage-round-neck",
    name: "Acid Wash Vintage Mineral-Dyed Tee",
    category: "tshirts",
    category_label: "Round Neck T-Shirts",
    subcategory: "round-neck",
    price: 549,
    original_price: 749,
    badge: "Hot Deal",
    in_stock: true,
    is_sold_out: false,
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"
    ],
    description: "Individually hand-dipped mineral acid-washed tee. Each garment carries a unique vintage fade with broken-in softness, double-needle stitched seams, and distressed vibes.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    colors: [
      {
        name: "Charcoal",
        hex: "#36454F",
        frontImage: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"
      },
      {
        name: "Olive",
        hex: "#556B2F",
        frontImage: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80"
      },
      {
        name: "Maroon",
        hex: "#800020",
        frontImage: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"
      }
    ],
    print_types: ["DTF (Direct to Film)", "Vintage Discharge Print", "Distressed Screen"],
    bulk_pricing: [
      { qty: "1-9 pcs", price: 549 },
      { qty: "10-24 pcs", price: 469 },
      { qty: "25-49 pcs", price: 409 },
      { qty: "50+ pcs", price: 349 }
    ],
    min_order: 1,
    turnaround: "48 Hours",
    rating: 5.0,
    reviews_count: 67,
    gsm: 220,
    material: "100% Mineral-Washed Cotton",
    fit: "Vintage Boxy Fit",
    fabric: "Acid Washed Single Jersey",
    sku: "RN-220-ACD",
    care_instructions: "Wash separately in cold water on first wash.",
    printing_compatibility: ["DTF", "Screen Print", "Vinyl"]
  },
  {
    id: "rn-04",
    slug: "ultra-soft-160-gsm-summer-crew",
    name: "Ultra-Soft 160 GSM Summer Crewneck",
    category: "tshirts",
    category_label: "Round Neck T-Shirts",
    subcategory: "round-neck",
    price: 349,
    original_price: 499,
    badge: "New",
    in_stock: true,
    is_sold_out: false,
    image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80",
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80"
    ],
    description: "Featherlight 160 GSM single jersey designed specifically for hot Indian summers and coastal humidity. Breathable, sweat-absorbent, and light on the body.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      {
        name: "White",
        hex: "#FFFFFF",
        frontImage: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"
      },
      {
        name: "Sky Blue",
        hex: "#87CEEB",
        frontImage: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80"
      },
      {
        name: "Navy Blue",
        hex: "#1E3A5F",
        frontImage: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"
      }
    ],
    print_types: ["DTF (Direct to Film)", "Sublimation", "Vinyl Heat Seal"],
    bulk_pricing: [
      { qty: "1-9 pcs", price: 349 },
      { qty: "10-24 pcs", price: 299 },
      { qty: "25-49 pcs", price: 249 },
      { qty: "50+ pcs", price: 199 }
    ],
    min_order: 1,
    turnaround: "24-48 Hours",
    rating: 4.7,
    reviews_count: 53,
    gsm: 160,
    material: "100% Breathable Combed Cotton",
    fit: "Regular Slim Fit",
    fabric: "Lightweight Jersey 160 GSM",
    sku: "RN-160-SMR",
    care_instructions: "Machine wash cold with mild detergent.",
    printing_compatibility: ["DTF", "Screen Print", "Sublimation", "Vinyl"]
  },
  {
    id: "rn-05",
    slug: "organic-cotton-eco-friendly-tee",
    name: "GOTS Certified 100% Organic Cotton Tee",
    category: "tshirts",
    category_label: "Round Neck T-Shirts",
    subcategory: "round-neck",
    price: 499,
    original_price: 699,
    badge: "Made to order",
    in_stock: true,
    is_sold_out: false,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
      "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80"
    ],
    description: "Sustainably cultivated organic cotton free of harmful pesticides. Paired with water-based non-toxic inks for zero environmental footprint. Zero chemical odour.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    colors: [
      {
        name: "Forest Green",
        hex: "#228B22",
        frontImage: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80"
      },
      {
        name: "Beige",
        hex: "#D2B48C",
        frontImage: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80"
      },
      {
        name: "White",
        hex: "#FFFFFF",
        frontImage: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"
      }
    ],
    print_types: ["DTF (Direct to Film)", "Eco Water-Based Screen Print"],
    bulk_pricing: [
      { qty: "1-9 pcs", price: 499 },
      { qty: "10-24 pcs", price: 429 },
      { qty: "25-49 pcs", price: 369 },
      { qty: "50+ pcs", price: 319 }
    ],
    min_order: 1,
    turnaround: "48 Hours",
    rating: 4.9,
    reviews_count: 41,
    gsm: 190,
    material: "100% GOTS Certified Organic Cotton",
    fit: "Comfort Regular Fit",
    fabric: "Organic Combed Single Jersey",
    sku: "RN-190-ORG",
    care_instructions: "Wash cold, line dry in shade.",
    printing_compatibility: ["DTF", "Screen Print"]
  },
  {
    id: "rn-06",
    slug: "heavyweight-220-gsm-ring-spun-tee",
    name: "Heavyweight 220 GSM Ring-Spun Street Crew",
    category: "tshirts",
    category_label: "Round Neck T-Shirts",
    subcategory: "round-neck",
    price: 479,
    original_price: 649,
    badge: "Bulk Fav",
    in_stock: true,
    is_sold_out: false,
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"
    ],
    description: "Thick, structured collar crewneck made with 24-singles ring-spun cotton. High stitch density creates a smooth canvas for sharp photo prints and intricate vector typography.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    colors: [
      {
        name: "Black",
        hex: "#18181B",
        frontImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80"
      },
      {
        name: "Navy Blue",
        hex: "#1E3A5F",
        frontImage: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"
      },
      {
        name: "Red",
        hex: "#DC2626",
        frontImage: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"
      }
    ],
    print_types: ["DTF (Direct to Film)", "Puff 3D Print", "Plastisol Screen Print"],
    bulk_pricing: [
      { qty: "1-9 pcs", price: 479 },
      { qty: "10-24 pcs", price: 409 },
      { qty: "25-49 pcs", price: 349 },
      { qty: "50+ pcs", price: 299 }
    ],
    min_order: 1,
    turnaround: "48 Hours",
    rating: 4.8,
    reviews_count: 76,
    gsm: 220,
    material: "100% Ring-Spun Cotton",
    fit: "Boxy Modern Fit",
    fabric: "Dense Ring-Spun Jersey",
    sku: "RN-220-STR",
    care_instructions: "Warm machine wash, iron on reverse side.",
    printing_compatibility: ["DTF", "Screen Print", "Vinyl"]
  },

  // ─────────────────────────────────────────────────────────────
  // 2. POLO T-SHIRTS (6 items)
  // ─────────────────────────────────────────────────────────────
  {
    id: "pl-01",
    slug: "classic-220-gsm-honeycomb-pique-polo",
    name: "Classic 220 GSM Honeycomb Pique Polo",
    category: "tshirts",
    category_label: "Polo T-Shirts",
    subcategory: "polo",
    price: 549,
    original_price: 749,
    badge: "Best Seller",
    in_stock: true,
    is_sold_out: false,
    image: "https://images.unsplash.com/photo-1625910513413-5fc35f97eabf?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1625910513413-5fc35f97eabf?w=800&q=80",
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80"
    ],
    description: "Traditional 220 GSM waffle knit honeycomb pique polo. Structured collar that stays sharp all day, 2-button placket with tone-on-tone buttons, and side vents for easy movement.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    colors: [
      {
        name: "Navy Blue",
        hex: "#1E3A5F",
        frontImage: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1625910513413-5fc35f97eabf?w=800&q=80"
      },
      {
        name: "White",
        hex: "#FFFFFF",
        frontImage: "https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1625910513413-5fc35f97eabf?w=800&q=80"
      },
      {
        name: "Black",
        hex: "#18181B",
        frontImage: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1625910513413-5fc35f97eabf?w=800&q=80"
      },
      {
        name: "Maroon",
        hex: "#800020",
        frontImage: "https://images.unsplash.com/photo-1625910513413-5fc35f97eabf?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80"
      }
    ],
    print_types: ["Left Chest Embroidery", "DTF (Direct to Film)", "Silicone Crest Badge"],
    bulk_pricing: [
      { qty: "1-9 pcs", price: 549 },
      { qty: "10-24 pcs", price: 469 },
      { qty: "25-49 pcs", price: 409 },
      { qty: "50+ pcs", price: 349 }
    ],
    min_order: 1,
    turnaround: "48 Hours",
    rating: 4.9,
    reviews_count: 110,
    gsm: 220,
    material: "60% Combed Cotton, 40% Polyester Pique",
    fit: "Classic Semi-Formal Fit",
    fabric: "Honeycomb Pique Knit",
    sku: "PL-220-PIQ",
    care_instructions: "Warm machine wash, do not tumble dry, warm iron.",
    printing_compatibility: ["Embroidery", "DTF", "Vinyl"]
  },
  {
    id: "pl-02",
    slug: "corporate-embroidered-executive-polo",
    name: "Corporate Executive Polo with Custom Crest",
    category: "tshirts",
    category_label: "Polo T-Shirts",
    subcategory: "polo",
    price: 649,
    original_price: 849,
    badge: "Bulk Fav",
    in_stock: true,
    is_sold_out: false,
    image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80",
      "https://images.unsplash.com/photo-1625910513413-5fc35f97eabf?w=800&q=80"
    ],
    description: "Designed for software companies, corporate teams, and hospitality brands. Mother-of-pearl buttons, double-layer collar stand, and precision Japanese computerized embroidery up to 10,000 stitches.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    colors: [
      {
        name: "Navy Blue",
        hex: "#1E3A5F",
        frontImage: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1625910513413-5fc35f97eabf?w=800&q=80"
      },
      {
        name: "Charcoal",
        hex: "#36454F",
        frontImage: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80"
      },
      {
        name: "White",
        hex: "#FFFFFF",
        frontImage: "https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1625910513413-5fc35f97eabf?w=800&q=80"
      }
    ],
    print_types: ["Precision Computerized Embroidery", "High-Definition DTF", "Metallic Foil Crest"],
    bulk_pricing: [
      { qty: "1-9 pcs", price: 649 },
      { qty: "10-24 pcs", price: 549 },
      { qty: "25-49 pcs", price: 479 },
      { qty: "50+ pcs", price: 399 }
    ],
    min_order: 1,
    turnaround: "48 Hours",
    rating: 5.0,
    reviews_count: 85,
    gsm: 240,
    material: "100% Super-Combed Egyptian Cotton",
    fit: "Executive Tailored Fit",
    fabric: "Matty Heavyweight Pique",
    sku: "PL-240-EXEC",
    care_instructions: "Dry clean or gentle hand wash, iron on collar and body.",
    printing_compatibility: ["Embroidery", "DTF"]
  },
  {
    id: "pl-03",
    slug: "dry-fit-moisture-wicking-sport-polo",
    name: "Dry-Fit Performance Moisture-Wicking Polo",
    category: "tshirts",
    category_label: "Polo T-Shirts",
    subcategory: "polo",
    price: 499,
    original_price: 699,
    badge: "48h Rush",
    in_stock: true,
    is_sold_out: false,
    image: "https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=800&q=80",
      "https://images.unsplash.com/photo-1625910513413-5fc35f97eabf?w=800&q=80"
    ],
    description: "Athletic jacquard mesh knit engineered to pull moisture away from the skin. 4-way mechanical stretch fabric keeps you cool during golf outings, field teams, and sports events.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    colors: [
      {
        name: "White",
        hex: "#FFFFFF",
        frontImage: "https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1625910513413-5fc35f97eabf?w=800&q=80"
      },
      {
        name: "Navy Blue",
        hex: "#1E3A5F",
        frontImage: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=800&q=80"
      },
      {
        name: "Black",
        hex: "#18181B",
        frontImage: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=800&q=80"
      }
    ],
    print_types: ["Sublimation Print", "Vinyl Heat Seal", "DTF (Direct to Film)"],
    bulk_pricing: [
      { qty: "1-9 pcs", price: 499 },
      { qty: "10-24 pcs", price: 429 },
      { qty: "25-49 pcs", price: 369 },
      { qty: "50+ pcs", price: 319 }
    ],
    min_order: 1,
    turnaround: "24-48 Hours",
    rating: 4.8,
    reviews_count: 64,
    gsm: 180,
    material: "100% Micro-Polyester Jacquard Knit",
    fit: "Athletic Active Fit",
    fabric: "Moisture-Wicking Honeycomb Knit",
    sku: "PL-180-DRY",
    care_instructions: "Quick cold machine wash, quick drying, no iron required.",
    printing_compatibility: ["Sublimation", "Vinyl", "DTF"]
  },
  {
    id: "pl-04",
    slug: "premium-tipped-collar-heritage-polo",
    name: "Tipped Ribbed Collar Heritage Polo",
    category: "tshirts",
    category_label: "Polo T-Shirts",
    subcategory: "polo",
    price: 599,
    original_price: 799,
    badge: "New",
    in_stock: true,
    is_sold_out: false,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
      "https://images.unsplash.com/photo-1625910513413-5fc35f97eabf?w=800&q=80"
    ],
    description: "Sporting contrast dual-stripe tipping on collar ribs and sleeve cuffs. Premium pre-washed combed yarn with rich texture and superior shape retention.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      {
        name: "Black",
        hex: "#18181B",
        frontImage: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1625910513413-5fc35f97eabf?w=800&q=80"
      },
      {
        name: "White",
        hex: "#FFFFFF",
        frontImage: "https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80"
      },
      {
        name: "Forest Green",
        hex: "#228B22",
        frontImage: "https://images.unsplash.com/photo-1625910513413-5fc35f97eabf?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80"
      }
    ],
    print_types: ["Left Chest Embroidery", "DTF (Direct to Film)"],
    bulk_pricing: [
      { qty: "1-9 pcs", price: 599 },
      { qty: "10-24 pcs", price: 519 },
      { qty: "25-49 pcs", price: 449 },
      { qty: "50+ pcs", price: 389 }
    ],
    min_order: 1,
    turnaround: "48 Hours",
    rating: 4.9,
    reviews_count: 48,
    gsm: 230,
    material: "95% Combed Cotton, 5% Spandex",
    fit: "Modern Regular Fit",
    fabric: "Tipped Honeycomb Pique",
    sku: "PL-230-TIP",
    care_instructions: "Cold wash with similar shades, dry flat.",
    printing_compatibility: ["Embroidery", "DTF"]
  },
  {
    id: "pl-05",
    slug: "slim-fit-stretch-cotton-polo",
    name: "Slim-Fit Stretch Spandex Lycra Polo",
    category: "tshirts",
    category_label: "Polo T-Shirts",
    subcategory: "polo",
    price: 569,
    original_price: 769,
    badge: "Made to order",
    in_stock: true,
    is_sold_out: false,
    image: "https://images.unsplash.com/photo-1625910513413-5fc35f97eabf?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1625910513413-5fc35f97eabf?w=800&q=80",
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80"
    ],
    description: "Contemporary tailored silhouette with 5% elastane stretch for freedom of motion and flattering drape. Reinforced seam tape prevents stretching around the back neckline.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      {
        name: "Maroon",
        hex: "#800020",
        frontImage: "https://images.unsplash.com/photo-1625910513413-5fc35f97eabf?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80"
      },
      {
        name: "Navy Blue",
        hex: "#1E3A5F",
        frontImage: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1625910513413-5fc35f97eabf?w=800&q=80"
      },
      {
        name: "Black",
        hex: "#18181B",
        frontImage: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1625910513413-5fc35f97eabf?w=800&q=80"
      }
    ],
    print_types: ["Left Chest Embroidery", "DTF (Direct to Film)"],
    bulk_pricing: [
      { qty: "1-9 pcs", price: 569 },
      { qty: "10-24 pcs", price: 489 },
      { qty: "25-49 pcs", price: 419 },
      { qty: "50+ pcs", price: 359 }
    ],
    min_order: 1,
    turnaround: "48 Hours",
    rating: 4.7,
    reviews_count: 39,
    gsm: 210,
    material: "95% Combed Cotton, 5% Lycra",
    fit: "Athletic Slim Fit",
    fabric: "Stretch Pique Jersey",
    sku: "PL-210-STR",
    care_instructions: "Cold wash, iron on low temperature.",
    printing_compatibility: ["Embroidery", "DTF"]
  },
  {
    id: "pl-06",
    slug: "striped-rugby-heritage-polo",
    name: "Heavy 260 GSM Striped Rugby Polo",
    category: "tshirts",
    category_label: "Polo T-Shirts",
    subcategory: "polo",
    price: 629,
    original_price: 829,
    badge: "Hot Deal",
    in_stock: true,
    is_sold_out: false,
    image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80",
      "https://images.unsplash.com/photo-1625910513413-5fc35f97eabf?w=800&q=80"
    ],
    description: "Rugged 260 GSM yarn-dyed horizontal block striped polo. Heavy twill white collar and rubber buttons engineered in classic collegiate sportswear heritage.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    colors: [
      {
        name: "Navy Blue",
        hex: "#1E3A5F",
        frontImage: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1625910513413-5fc35f97eabf?w=800&q=80"
      },
      {
        name: "Maroon",
        hex: "#800020",
        frontImage: "https://images.unsplash.com/photo-1625910513413-5fc35f97eabf?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80"
      }
    ],
    print_types: ["Left Chest Embroidery", "Heavy Screen Print"],
    bulk_pricing: [
      { qty: "1-9 pcs", price: 629 },
      { qty: "10-24 pcs", price: 539 },
      { qty: "25-49 pcs", price: 469 },
      { qty: "50+ pcs", price: 399 }
    ],
    min_order: 1,
    turnaround: "48 Hours",
    rating: 4.8,
    reviews_count: 45,
    gsm: 260,
    material: "100% Heavy Yarn-Dyed Cotton",
    fit: "Relaxed Vintage Fit",
    fabric: "Yarn-Dyed Heavy Pique",
    sku: "PL-260-RGB",
    care_instructions: "Wash inside out with cold water.",
    printing_compatibility: ["Embroidery", "Screen Print"]
  },

  // ─────────────────────────────────────────────────────────────
  // 3. OVERSIZED T-SHIRTS (6 items)
  // ─────────────────────────────────────────────────────────────
  {
    id: "os-01",
    slug: "heavyweight-240-gsm-drop-shoulder-oversized",
    name: "Heavyweight 240 GSM Drop-Shoulder Oversized Tee",
    category: "tshirts",
    category_label: "Oversized T-Shirts",
    subcategory: "oversized",
    price: 599,
    original_price: 799,
    badge: "Best Seller",
    in_stock: true,
    is_sold_out: false,
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80"
    ],
    description: "The definitive Indian streetwear silhouette. Dense 240 GSM French terry combed cotton with dramatic dropped shoulders, longer elbow-length sleeves, and high-density Japanese DTF print reproduction.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    colors: [
      {
        name: "Black",
        hex: "#18181B",
        frontImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80"
      },
      {
        name: "Beige",
        hex: "#D2B48C",
        frontImage: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"
      },
      {
        name: "Navy Blue",
        hex: "#1E3A5F",
        frontImage: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"
      },
      {
        name: "White",
        hex: "#FFFFFF",
        frontImage: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"
      },
      {
        name: "Olive",
        hex: "#556B2F",
        frontImage: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80"
      }
    ],
    print_types: ["High-Density DTF", "Puff 3D Print", "Back Big Graphic Screen", "Plastisol Screen"],
    bulk_pricing: [
      { qty: "1-9 pcs", price: 599 },
      { qty: "10-24 pcs", price: 519 },
      { qty: "25-49 pcs", price: 449 },
      { qty: "50+ pcs", price: 379 }
    ],
    min_order: 1,
    turnaround: "48 Hours",
    rating: 5.0,
    reviews_count: 156,
    gsm: 240,
    material: "100% Super-Combed French Terry Cotton",
    fit: "Boxy Drop-Shoulder Oversized",
    fabric: "French Terry 240 GSM",
    sku: "OS-240-DRP",
    care_instructions: "Reverse wash cold, tumble dry low, do not iron on print.",
    printing_compatibility: ["DTF", "Screen Print", "Vinyl", "Embroidery"]
  },
  {
    id: "os-02",
    slug: "260-gsm-heavy-french-terry-street-drop",
    name: "260 GSM Ultra-Heavy French Terry Street Tee",
    category: "tshirts",
    category_label: "Oversized T-Shirts",
    subcategory: "oversized",
    price: 649,
    original_price: 849,
    badge: "Hot Deal",
    in_stock: true,
    is_sold_out: false,
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80"
    ],
    description: "Our heaviest tee in the collection. 260 GSM unbrushed French terry with heavy 1.25-inch ribbing that will never bacon. Built to endure oversized typography and full-back art.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    colors: [
      {
        name: "Charcoal",
        hex: "#36454F",
        frontImage: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"
      },
      {
        name: "Black",
        hex: "#18181B",
        frontImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80"
      },
      {
        name: "Beige",
        hex: "#D2B48C",
        frontImage: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80"
      }
    ],
    print_types: ["High-Density DTF", "Puff 3D Print", "Back Big Graphic Screen"],
    bulk_pricing: [
      { qty: "1-9 pcs", price: 649 },
      { qty: "10-24 pcs", price: 559 },
      { qty: "25-49 pcs", price: 489 },
      { qty: "50+ pcs", price: 419 }
    ],
    min_order: 1,
    turnaround: "48 Hours",
    rating: 4.9,
    reviews_count: 92,
    gsm: 260,
    material: "100% Combed French Terry Cotton",
    fit: "Ultra-Boxy Oversized",
    fabric: "Heavyweight Loopback Terry",
    sku: "OS-260-TER",
    care_instructions: "Cold wash inside out, iron on reverse.",
    printing_compatibility: ["DTF", "Screen Print", "Vinyl"]
  },
  {
    id: "os-03",
    slug: "acid-wash-240-gsm-streetwear-drop",
    name: "Acid Wash 240 GSM Vintage Streetwear Drop",
    category: "tshirts",
    category_label: "Oversized T-Shirts",
    subcategory: "oversized",
    price: 699,
    original_price: 949,
    badge: "New",
    in_stock: true,
    is_sold_out: false,
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80"
    ],
    description: "Custom vintage mineral acid-wash on heavyweight 240 GSM cotton. Dramatic marble pattern across body and sleeves with a plush hand feel. Perfect backdrop for retro anime & street art.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    colors: [
      {
        name: "Charcoal",
        hex: "#36454F",
        frontImage: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80"
      },
      {
        name: "Olive",
        hex: "#556B2F",
        frontImage: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80"
      }
    ],
    print_types: ["Puff 3D Print", "High-Density DTF", "Distressed Screen"],
    bulk_pricing: [
      { qty: "1-9 pcs", price: 699 },
      { qty: "10-24 pcs", price: 619 },
      { qty: "25-49 pcs", price: 549 },
      { qty: "50+ pcs", price: 479 }
    ],
    min_order: 1,
    turnaround: "48 Hours",
    rating: 5.0,
    reviews_count: 78,
    gsm: 240,
    material: "100% Mineral-Washed Cotton",
    fit: "Dropped-Shoulder Relaxed Fit",
    fabric: "Mineral Washed Terry",
    sku: "OS-240-ACD",
    care_instructions: "Wash separately cold, do not dry clean.",
    printing_compatibility: ["DTF", "Screen Print", "Vinyl"]
  },
  {
    id: "os-04",
    slug: "pastel-collection-oversized-tee",
    name: "Pastel Collection 220 GSM Relaxed Tee",
    category: "tshirts",
    category_label: "Oversized T-Shirts",
    subcategory: "oversized",
    price: 579,
    original_price: 779,
    badge: "48h Rush",
    in_stock: true,
    is_sold_out: false,
    image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80",
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80"
    ],
    description: "Aesthetic muted pastel tones crafted from premium combed single jersey. Subtle drop-shoulder fit that looks incredible in minimalist typography and line-art prints.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      {
        name: "Beige",
        hex: "#D2B48C",
        frontImage: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80"
      },
      {
        name: "White",
        hex: "#FFFFFF",
        frontImage: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80"
      },
      {
        name: "Forest Green",
        hex: "#228B22",
        frontImage: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80"
      }
    ],
    print_types: ["High-Density DTF", "Puff 3D Print", "Eco Water-Based Screen"],
    bulk_pricing: [
      { qty: "1-9 pcs", price: 579 },
      { qty: "10-24 pcs", price: 499 },
      { qty: "25-49 pcs", price: 439 },
      { qty: "50+ pcs", price: 379 }
    ],
    min_order: 1,
    turnaround: "48 Hours",
    rating: 4.8,
    reviews_count: 61,
    gsm: 220,
    material: "100% Super-Combed Cotton",
    fit: "Muted Relaxed Oversized",
    fabric: "Single Jersey 220 GSM",
    sku: "OS-220-PST",
    care_instructions: "Gentle cold cycle, dry inside out.",
    printing_compatibility: ["DTF", "Screen Print"]
  },
  {
    id: "os-05",
    slug: "heavyweight-pocket-oversized-tee",
    name: "Heavyweight 240 GSM Utility Pocket Oversized",
    category: "tshirts",
    category_label: "Oversized T-Shirts",
    subcategory: "oversized",
    price: 619,
    original_price: 819,
    badge: "Made to order",
    in_stock: true,
    is_sold_out: false,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80"
    ],
    description: "Workwear-inspired utility box pocket on left chest. Heavyweight 240 GSM French terry construction with reinforced bar-tacks for urban utility lifestyle.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    colors: [
      {
        name: "Black",
        hex: "#18181B",
        frontImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80"
      },
      {
        name: "Olive",
        hex: "#556B2F",
        frontImage: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"
      },
      {
        name: "Charcoal",
        hex: "#36454F",
        frontImage: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"
      }
    ],
    print_types: ["Pocket Minimal DTF", "Back Poster Print", "Puff 3D Print"],
    bulk_pricing: [
      { qty: "1-9 pcs", price: 619 },
      { qty: "10-24 pcs", price: 539 },
      { qty: "25-49 pcs", price: 469 },
      { qty: "50+ pcs", price: 399 }
    ],
    min_order: 1,
    turnaround: "48 Hours",
    rating: 4.9,
    reviews_count: 52,
    gsm: 240,
    material: "100% Cotton French Terry",
    fit: "Boxy Street Pocket Cut",
    fabric: "Loopback Cotton Terry",
    sku: "OS-240-PKT",
    care_instructions: "Cold wash inside out, iron on reverse.",
    printing_compatibility: ["DTF", "Screen Print", "Vinyl"]
  },
  {
    id: "os-06",
    slug: "washed-oversized-graphic-ready-blank",
    name: "Enzyme-Washed 220 GSM Blank Canvas Drop",
    category: "tshirts",
    category_label: "Oversized T-Shirts",
    subcategory: "oversized",
    price: 569,
    original_price: 769,
    badge: "Bulk Fav",
    in_stock: true,
    is_sold_out: false,
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80"
    ],
    description: "Clean, silky smooth blank canvas optimized for multi-color anime, hip-hop, and brand graphics. Zero surface lint ensures crisp detail transfer at 1200 DPI.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    colors: [
      {
        name: "White",
        hex: "#FFFFFF",
        frontImage: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"
      },
      {
        name: "Black",
        hex: "#18181B",
        frontImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80"
      },
      {
        name: "Navy Blue",
        hex: "#1E3A5F",
        frontImage: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"
      }
    ],
    print_types: ["High-Density DTF", "Plastisol Screen Print", "Puff 3D Print"],
    bulk_pricing: [
      { qty: "1-9 pcs", price: 569 },
      { qty: "10-24 pcs", price: 489 },
      { qty: "25-49 pcs", price: 419 },
      { qty: "50+ pcs", price: 359 }
    ],
    min_order: 1,
    turnaround: "24-48 Hours",
    rating: 4.9,
    reviews_count: 83,
    gsm: 220,
    material: "100% Super-Combed Cotton",
    fit: "Dropped-Shoulder Loose Fit",
    fabric: "Enzyme-Washed Single Jersey",
    sku: "OS-220-BLN",
    care_instructions: "Machine wash cold with mild detergent.",
    printing_compatibility: ["DTF", "Screen Print", "Vinyl"]
  },

  // ─────────────────────────────────────────────────────────────
  // 4. HOODIES (6 items)
  // ─────────────────────────────────────────────────────────────
  {
    id: "hd-01",
    slug: "360-gsm-fleece-pullover-hoodie",
    name: "Heavyweight 360 GSM Fleece Pullover Hoodie",
    category: "tshirts",
    category_label: "Hoodies",
    subcategory: "hoodie",
    price: 899,
    original_price: 1199,
    badge: "Best Seller",
    in_stock: true,
    is_sold_out: false,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
      "https://images.unsplash.com/photo-1578768079470-0a4536d7282c?w=800&q=80",
      "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=800&q=80"
    ],
    description: "Plush 360 GSM brushed fleece with double-layer cross hood that holds its structure. Features heavy gauge round drawstrings with metal aglets, kangaroo pocket with bar-tack reinforcements, and heavy rib cuff trims.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    colors: [
      {
        name: "Black",
        hex: "#18181B",
        frontImage: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1578768079470-0a4536d7282c?w=800&q=80"
      },
      {
        name: "Grey Melange",
        hex: "#9CA3AF",
        frontImage: "https://images.unsplash.com/photo-1578768079470-0a4536d7282c?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80"
      },
      {
        name: "Maroon",
        hex: "#800020",
        frontImage: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80"
      },
      {
        name: "Navy Blue",
        hex: "#1E3A5F",
        frontImage: "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80"
      }
    ],
    print_types: ["High-Density DTF", "Left Chest Embroidery", "Puff 3D Print", "Back Poster Print"],
    bulk_pricing: [
      { qty: "1-9 pcs", price: 899 },
      { qty: "10-24 pcs", price: 779 },
      { qty: "25-49 pcs", price: 689 },
      { qty: "50+ pcs", price: 599 }
    ],
    min_order: 1,
    turnaround: "48 Hours",
    rating: 5.0,
    reviews_count: 142,
    gsm: 360,
    material: "80% Super-Combed Cotton, 20% Polyester Brushed Fleece",
    fit: "Comfort Relaxed Street Fit",
    fabric: "Heavy Brushed Cotton Fleece",
    sku: "HD-360-FLC",
    care_instructions: "Machine wash cold inside out, do not bleach, tumble dry low.",
    printing_compatibility: ["DTF", "Embroidery", "Screen Print", "Vinyl"]
  },
  {
    id: "hd-02",
    slug: "zip-up-320-gsm-french-terry-hoodie",
    name: "Full Zip-Up 320 GSM French Terry Hoodie",
    category: "tshirts",
    category_label: "Hoodies",
    subcategory: "hoodie",
    price: 949,
    original_price: 1249,
    badge: "48h Rush",
    in_stock: true,
    is_sold_out: false,
    image: "https://images.unsplash.com/photo-1578768079470-0a4536d7282c?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1578768079470-0a4536d7282c?w=800&q=80",
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80"
    ],
    description: "Versatile full-zip hoodie with heavy antique YKK brass zipper, split kangaroo pouch pocket, and clean jersey-lined hood. Ideal for year-round layering.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    colors: [
      {
        name: "Grey Melange",
        hex: "#9CA3AF",
        frontImage: "https://images.unsplash.com/photo-1578768079470-0a4536d7282c?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80"
      },
      {
        name: "Black",
        hex: "#18181B",
        frontImage: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1578768079470-0a4536d7282c?w=800&q=80"
      },
      {
        name: "Navy Blue",
        hex: "#1E3A5F",
        frontImage: "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80"
      }
    ],
    print_types: ["Left Chest Embroidery", "Back Big Graphic DTF", "Sleeve Print"],
    bulk_pricing: [
      { qty: "1-9 pcs", price: 949 },
      { qty: "10-24 pcs", price: 819 },
      { qty: "25-49 pcs", price: 729 },
      { qty: "50+ pcs", price: 639 }
    ],
    min_order: 1,
    turnaround: "48 Hours",
    rating: 4.8,
    reviews_count: 87,
    gsm: 320,
    material: "100% Combed Cotton French Terry",
    fit: "Regular Athletic Fit",
    fabric: "Loopback French Terry",
    sku: "HD-320-ZIP",
    care_instructions: "Wash with zipper closed, cold cycle, hang dry.",
    printing_compatibility: ["DTF", "Embroidery", "Screen Print"]
  },
  {
    id: "hd-03",
    slug: "oversized-380-gsm-street-hoodie",
    name: "Ultra-Heavy 380 GSM Streetwear Boxy Hoodie",
    category: "tshirts",
    category_label: "Hoodies",
    subcategory: "hoodie",
    price: 999,
    original_price: 1349,
    badge: "Hot Deal",
    in_stock: true,
    is_sold_out: false,
    image: "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=800&q=80",
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80"
    ],
    description: "Built for true streetwear enthusiasts: no drawstrings for a clean contemporary neck line, dropped shoulders, and ultra-dense 380 GSM thermal cotton fleece that keeps you warm in freezing air.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    colors: [
      {
        name: "Black",
        hex: "#18181B",
        frontImage: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=800&q=80"
      },
      {
        name: "Beige",
        hex: "#D2B48C",
        frontImage: "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80"
      },
      {
        name: "Forest Green",
        hex: "#228B22",
        frontImage: "https://images.unsplash.com/photo-1578768079470-0a4536d7282c?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80"
      }
    ],
    print_types: ["Puff 3D Print", "High-Density DTF", "Embossed Embroidery"],
    bulk_pricing: [
      { qty: "1-9 pcs", price: 999 },
      { qty: "10-24 pcs", price: 869 },
      { qty: "25-49 pcs", price: 779 },
      { qty: "50+ pcs", price: 679 }
    ],
    min_order: 1,
    turnaround: "48 Hours",
    rating: 5.0,
    reviews_count: 104,
    gsm: 380,
    material: "100% Super-Heavy Combed Cotton",
    fit: "Boxy Dropped Shoulder Fit",
    fabric: "380 GSM Heavy Thermal Fleece",
    sku: "HD-380-STR",
    care_instructions: "Reverse wash cold, line dry in shade.",
    printing_compatibility: ["DTF", "Embroidery", "Screen Print"]
  },
  {
    id: "hd-04",
    slug: "acid-wash-vintage-pullover-hoodie",
    name: "Acid Wash 340 GSM Vintage Hoodie",
    category: "tshirts",
    category_label: "Hoodies",
    subcategory: "hoodie",
    price: 979,
    original_price: 1299,
    badge: "New",
    in_stock: true,
    is_sold_out: false,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80",
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80"
    ],
    description: "Mineral-washed aesthetic hoodie with distressed ribbing and a soft worn-in texture. Every hoodie is hand treated, ensuring zero two pieces look identical.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      {
        name: "Maroon",
        hex: "#800020",
        frontImage: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80"
      },
      {
        name: "Charcoal",
        hex: "#36454F",
        frontImage: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80"
      }
    ],
    print_types: ["Distressed DTF", "Puff 3D Print", "Tonal Embroidery"],
    bulk_pricing: [
      { qty: "1-9 pcs", price: 979 },
      { qty: "10-24 pcs", price: 849 },
      { qty: "25-49 pcs", price: 749 },
      { qty: "50+ pcs", price: 659 }
    ],
    min_order: 1,
    turnaround: "48 Hours",
    rating: 4.9,
    reviews_count: 57,
    gsm: 340,
    material: "100% Mineral-Washed Cotton Fleece",
    fit: "Vintage Oversized Fit",
    fabric: "Mineral Washed Cotton Fleece",
    sku: "HD-340-ACD",
    care_instructions: "Wash cold separately, tumble dry low.",
    printing_compatibility: ["DTF", "Embroidery"]
  },
  {
    id: "hd-05",
    slug: "cropped-boxy-women-hoodie",
    name: "Cropped 300 GSM Boxy Fleece Hoodie",
    category: "tshirts",
    category_label: "Hoodies",
    subcategory: "hoodie",
    price: 849,
    original_price: 1149,
    badge: "Made to order",
    in_stock: true,
    is_sold_out: false,
    image: "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=800&q=80",
      "https://images.unsplash.com/photo-1578768079470-0a4536d7282c?w=800&q=80"
    ],
    description: "Cropped waistline with raw edge hem and wide dropped sleeves. Chic streetwear silhouette tailored for female creators, dance crews, and gym fashion.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      {
        name: "Beige",
        hex: "#D2B48C",
        frontImage: "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80"
      },
      {
        name: "Black",
        hex: "#18181B",
        frontImage: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=800&q=80"
      }
    ],
    print_types: ["Chest Minimal DTF", "Left Sleeve Print", "Back Neck Monogram"],
    bulk_pricing: [
      { qty: "1-9 pcs", price: 849 },
      { qty: "10-24 pcs", price: 729 },
      { qty: "25-49 pcs", price: 649 },
      { qty: "50+ pcs", price: 569 }
    ],
    min_order: 1,
    turnaround: "48 Hours",
    rating: 4.8,
    reviews_count: 43,
    gsm: 300,
    material: "100% Combed Cotton Fleece",
    fit: "Cropped Boxy Fit",
    fabric: "Brushed Cotton Fleece",
    sku: "HD-300-CRP",
    care_instructions: "Cold wash, dry flat.",
    printing_compatibility: ["DTF", "Embroidery", "Vinyl"]
  },
  {
    id: "hd-06",
    slug: "heavyweight-embroidery-ready-hoodie",
    name: "Classic 320 GSM Clean Minimal Hoodie",
    category: "tshirts",
    category_label: "Hoodies",
    subcategory: "hoodie",
    price: 929,
    original_price: 1199,
    badge: "Bulk Fav",
    in_stock: true,
    is_sold_out: false,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
      "https://images.unsplash.com/photo-1578768079470-0a4536d7282c?w=800&q=80"
    ],
    description: "Tailored for college merch, startup employee kits, and corporate gifting. Silicon soft washed fleece with matching flat drawstrings and premium nickel eyelets.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    colors: [
      {
        name: "Navy Blue",
        hex: "#1E3A5F",
        frontImage: "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80"
      },
      {
        name: "Black",
        hex: "#18181B",
        frontImage: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=800&q=80"
      },
      {
        name: "Grey Melange",
        hex: "#9CA3AF",
        frontImage: "https://images.unsplash.com/photo-1578768079470-0a4536d7282c?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80"
      }
    ],
    print_types: ["Left Chest Embroidery", "DTF Full Back", "Vinyl Heat Seal"],
    bulk_pricing: [
      { qty: "1-9 pcs", price: 929 },
      { qty: "10-24 pcs", price: 799 },
      { qty: "25-49 pcs", price: 719 },
      { qty: "50+ pcs", price: 629 }
    ],
    min_order: 1,
    turnaround: "48 Hours",
    rating: 4.9,
    reviews_count: 96,
    gsm: 320,
    material: "85% Cotton, 15% Polyester",
    fit: "Standard Comfort Fit",
    fabric: "Brushed Fleece 320 GSM",
    sku: "HD-320-CLN",
    care_instructions: "Machine wash cold with like colours.",
    printing_compatibility: ["DTF", "Embroidery", "Screen Print"]
  },

  // ─────────────────────────────────────────────────────────────
  // 5. SWEATSHIRTS (6 items)
  // ─────────────────────────────────────────────────────────────
  {
    id: "sw-01",
    slug: "classic-300-gsm-crewneck-sweatshirt",
    name: "Classic 300 GSM Brushed Crewneck Sweatshirt",
    category: "tshirts",
    category_label: "Sweatshirts",
    subcategory: "sweatshirt",
    price: 749,
    original_price: 999,
    badge: "Best Seller",
    in_stock: true,
    is_sold_out: false,
    image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80",
      "https://images.unsplash.com/photo-1614975059251-992f11792571?w=800&q=80"
    ],
    description: "Essential crewneck pullover featuring heavy ribbed neckline with triangle V-stitch detail. 300 GSM fleece provides dependable warmth and soft luxury comfort all winter.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    colors: [
      {
        name: "Grey Melange",
        hex: "#9CA3AF",
        frontImage: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1614975059251-992f11792571?w=800&q=80"
      },
      {
        name: "Navy Blue",
        hex: "#1E3A5F",
        frontImage: "https://images.unsplash.com/photo-1609873814058-a8928924184a?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80"
      },
      {
        name: "Black",
        hex: "#18181B",
        frontImage: "https://images.unsplash.com/photo-1572495532056-8583af1cbae0?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80"
      },
      {
        name: "Forest Green",
        hex: "#228B22",
        frontImage: "https://images.unsplash.com/photo-1614975059251-992f11792571?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80"
      }
    ],
    print_types: ["High-Density DTF", "Computerized Embroidery", "Puff 3D Print"],
    bulk_pricing: [
      { qty: "1-9 pcs", price: 749 },
      { qty: "10-24 pcs", price: 649 },
      { qty: "25-49 pcs", price: 579 },
      { qty: "50+ pcs", price: 499 }
    ],
    min_order: 1,
    turnaround: "48 Hours",
    rating: 4.9,
    reviews_count: 118,
    gsm: 300,
    material: "80% Combed Cotton, 20% Polyester Fleece",
    fit: "Classic Regular Fit",
    fabric: "Brushed Loopback Fleece",
    sku: "SW-300-CRW",
    care_instructions: "Machine wash cold inside out, warm iron.",
    printing_compatibility: ["DTF", "Embroidery", "Screen Print"]
  },
  {
    id: "sw-02",
    slug: "oversized-drop-shoulder-sweatshirt",
    name: "Oversized 340 GSM Drop-Shoulder Sweatshirt",
    category: "tshirts",
    category_label: "Sweatshirts",
    subcategory: "sweatshirt",
    price: 799,
    original_price: 1049,
    badge: "Hot Deal",
    in_stock: true,
    is_sold_out: false,
    image: "https://images.unsplash.com/photo-1614975059251-992f11792571?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1614975059251-992f11792571?w=800&q=80",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80"
    ],
    description: "Trendsetting dropped shoulder cut in 340 GSM heavy French terry. Thick rib collar and waist cuffs provide a clean slouchy look beloved by streetwear brands.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    colors: [
      {
        name: "Beige",
        hex: "#D2B48C",
        frontImage: "https://images.unsplash.com/photo-1614975059251-992f11792571?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80"
      },
      {
        name: "Black",
        hex: "#18181B",
        frontImage: "https://images.unsplash.com/photo-1572495532056-8583af1cbae0?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1614975059251-992f11792571?w=800&q=80"
      },
      {
        name: "Charcoal",
        hex: "#36454F",
        frontImage: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1614975059251-992f11792571?w=800&q=80"
      }
    ],
    print_types: ["Puff 3D Print", "High-Density DTF", "Back Poster Print"],
    bulk_pricing: [
      { qty: "1-9 pcs", price: 799 },
      { qty: "10-24 pcs", price: 689 },
      { qty: "25-49 pcs", price: 609 },
      { qty: "50+ pcs", price: 529 }
    ],
    min_order: 1,
    turnaround: "48 Hours",
    rating: 5.0,
    reviews_count: 89,
    gsm: 340,
    material: "100% Super-Combed French Terry",
    fit: "Boxy Dropped Shoulder Cut",
    fabric: "Loopback Cotton Terry",
    sku: "SW-340-DRP",
    care_instructions: "Reverse wash cold, dry flat.",
    printing_compatibility: ["DTF", "Screen Print", "Embroidery"]
  },
  {
    id: "sw-03",
    slug: "half-zip-mock-neck-sweatshirt",
    name: "Half-Zip 320 GSM Mock-Neck Sweatshirt",
    category: "tshirts",
    category_label: "Sweatshirts",
    subcategory: "sweatshirt",
    price: 849,
    original_price: 1099,
    badge: "New",
    in_stock: true,
    is_sold_out: false,
    image: "https://images.unsplash.com/photo-1609873814058-a8928924184a?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1609873814058-a8928924184a?w=800&q=80",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80"
    ],
    description: "Sophisticated corporate quarter-zip mock neck. Heavy brass zipper with customized puller option, set-in sleeves, and double-needle finish.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    colors: [
      {
        name: "Navy Blue",
        hex: "#1E3A5F",
        frontImage: "https://images.unsplash.com/photo-1609873814058-a8928924184a?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80"
      },
      {
        name: "Black",
        hex: "#18181B",
        frontImage: "https://images.unsplash.com/photo-1572495532056-8583af1cbae0?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1609873814058-a8928924184a?w=800&q=80"
      },
      {
        name: "Grey Melange",
        hex: "#9CA3AF",
        frontImage: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1609873814058-a8928924184a?w=800&q=80"
      }
    ],
    print_types: ["Left Chest Embroidery", "Minimalist DTF", "Collar Monogram"],
    bulk_pricing: [
      { qty: "1-9 pcs", price: 849 },
      { qty: "10-24 pcs", price: 739 },
      { qty: "25-49 pcs", price: 649 },
      { qty: "50+ pcs", price: 569 }
    ],
    min_order: 1,
    turnaround: "48 Hours",
    rating: 4.8,
    reviews_count: 54,
    gsm: 320,
    material: "85% Cotton, 15% Polyester",
    fit: "Executive Tailored Fit",
    fabric: "High-Density Compact Fleece",
    sku: "SW-320-ZIP",
    care_instructions: "Wash with zipper closed, gentle tumble dry.",
    printing_compatibility: ["Embroidery", "DTF"]
  },
  {
    id: "sw-04",
    slug: "french-terry-raglan-sweatshirt",
    name: "Heritage Raglan Sleeve French Terry Sweatshirt",
    category: "tshirts",
    category_label: "Sweatshirts",
    subcategory: "sweatshirt",
    price: 769,
    original_price: 999,
    badge: "48h Rush",
    in_stock: true,
    is_sold_out: false,
    image: "https://images.unsplash.com/photo-1572495532056-8583af1cbae0?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1572495532056-8583af1cbae0?w=800&q=80",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80"
    ],
    description: "Athletic raglan sleeve construction that extends in one piece fully to the collar, allowing limitless arm mobility. Flatlock stitched seams prevent skin abrasion.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      {
        name: "Black",
        hex: "#18181B",
        frontImage: "https://images.unsplash.com/photo-1572495532056-8583af1cbae0?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80"
      },
      {
        name: "Grey Melange",
        hex: "#9CA3AF",
        frontImage: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1572495532056-8583af1cbae0?w=800&q=80"
      },
      {
        name: "Maroon",
        hex: "#800020",
        frontImage: "https://images.unsplash.com/photo-1572495532056-8583af1cbae0?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80"
      }
    ],
    print_types: ["Center Chest DTF", "Embroidery", "Plastisol Screen"],
    bulk_pricing: [
      { qty: "1-9 pcs", price: 769 },
      { qty: "10-24 pcs", price: 669 },
      { qty: "25-49 pcs", price: 589 },
      { qty: "50+ pcs", price: 519 }
    ],
    min_order: 1,
    turnaround: "48 Hours",
    rating: 4.8,
    reviews_count: 67,
    gsm: 310,
    material: "100% Combed Cotton French Terry",
    fit: "Athletic Raglan Cut",
    fabric: "French Terry 310 GSM",
    sku: "SW-310-RAG",
    care_instructions: "Cold wash inside out, iron on reverse.",
    printing_compatibility: ["DTF", "Embroidery", "Screen Print"]
  },
  {
    id: "sw-05",
    slug: "fleece-lined-winter-crewneck",
    name: "Heavy 360 GSM Polar Fleece-Lined Crewneck",
    category: "tshirts",
    category_label: "Sweatshirts",
    subcategory: "sweatshirt",
    price: 879,
    original_price: 1149,
    badge: "Made to order",
    in_stock: true,
    is_sold_out: false,
    image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80",
      "https://images.unsplash.com/photo-1614975059251-992f11792571?w=800&q=80"
    ],
    description: "Extreme winter weight sweatshirt packed with dense inner sherpa fleece lining. Retains body warmth in cold weather while keeping an ultra-clean matte exterior.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    colors: [
      {
        name: "Forest Green",
        hex: "#228B22",
        frontImage: "https://images.unsplash.com/photo-1614975059251-992f11792571?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80"
      },
      {
        name: "Navy Blue",
        hex: "#1E3A5F",
        frontImage: "https://images.unsplash.com/photo-1609873814058-a8928924184a?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80"
      },
      {
        name: "Charcoal",
        hex: "#36454F",
        frontImage: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1614975059251-992f11792571?w=800&q=80"
      }
    ],
    print_types: ["High-Density DTF", "Chenille Patch", "Computerized Embroidery"],
    bulk_pricing: [
      { qty: "1-9 pcs", price: 879 },
      { qty: "10-24 pcs", price: 769 },
      { qty: "25-49 pcs", price: 679 },
      { qty: "50+ pcs", price: 589 }
    ],
    min_order: 1,
    turnaround: "48 Hours",
    rating: 4.9,
    reviews_count: 58,
    gsm: 360,
    material: "70% Cotton, 30% Polyester Polar Fleece",
    fit: "Insulated Heavy Cut",
    fabric: "Polar Fleece-Lined Cotton",
    sku: "SW-360-PLR",
    care_instructions: "Gentle cold cycle, dry flat, do not iron fleece.",
    printing_compatibility: ["DTF", "Embroidery"]
  },
  {
    id: "sw-06",
    slug: "vintage-washed-crewneck-sweatshirt",
    name: "Enzyme Vintage Washed 320 GSM Crewneck",
    category: "tshirts",
    category_label: "Sweatshirts",
    subcategory: "sweatshirt",
    price: 819,
    original_price: 1079,
    badge: "Bulk Fav",
    in_stock: true,
    is_sold_out: false,
    image: "https://images.unsplash.com/photo-1572495532056-8583af1cbae0?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1572495532056-8583af1cbae0?w=800&q=80",
      "https://images.unsplash.com/photo-1609873814058-a8928924184a?w=800&q=80"
    ],
    description: "Pre-aged garment-dyed wash gives this piece a soft lived-in colorway with subtle weathering along seams and cuffs. Zero shrink guarantee.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    colors: [
      {
        name: "Charcoal",
        hex: "#36454F",
        frontImage: "https://images.unsplash.com/photo-1572495532056-8583af1cbae0?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80"
      },
      {
        name: "Olive",
        hex: "#556B2F",
        frontImage: "https://images.unsplash.com/photo-1614975059251-992f11792571?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1572495532056-8583af1cbae0?w=800&q=80"
      }
    ],
    print_types: ["Puff 3D Print", "High-Density DTF", "Distressed Screen"],
    bulk_pricing: [
      { qty: "1-9 pcs", price: 819 },
      { qty: "10-24 pcs", price: 719 },
      { qty: "25-49 pcs", price: 629 },
      { qty: "50+ pcs", price: 549 }
    ],
    min_order: 1,
    turnaround: "48 Hours",
    rating: 4.8,
    reviews_count: 73,
    gsm: 320,
    material: "100% Garment-Dyed Cotton",
    fit: "Vintage Relaxed Fit",
    fabric: "Enzyme Washed Fleece",
    sku: "SW-320-VNT",
    care_instructions: "Wash cold with like shades.",
    printing_compatibility: ["DTF", "Screen Print", "Embroidery"]
  },

  // ─────────────────────────────────────────────────────────────
  // 6. SPORTS JERSEYS (6 items)
  // ─────────────────────────────────────────────────────────────
  {
    id: "sj-01",
    slug: "pro-dryfit-sublimated-team-jersey",
    name: "Pro Dry-Fit Full Sublimated Team Jersey",
    category: "tshirts",
    category_label: "Sports Jerseys",
    subcategory: "jersey",
    price: 499,
    original_price: 699,
    badge: "Best Seller",
    in_stock: true,
    is_sold_out: false,
    image: "https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=800&q=80",
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80"
    ],
    description: "Complete 360-degree all-over dye sublimation jersey with personalized squad player names, numbers, team logos, and sponsor graphics. Moisture-transport honeycomb mesh keeps athletes bone dry.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    colors: [
      {
        name: "Royal Blue",
        hex: "#4169E1",
        frontImage: "https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80"
      },
      {
        name: "Red",
        hex: "#DC2626",
        frontImage: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=800&q=80"
      },
      {
        name: "Black",
        hex: "#18181B",
        frontImage: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=800&q=80"
      }
    ],
    print_types: ["All-Over Sublimation", "Vinyl Heat Seal Name/No", "Silicone Crest Badge"],
    bulk_pricing: [
      { qty: "1-9 pcs", price: 499 },
      { qty: "10-24 pcs", price: 429 },
      { qty: "25-49 pcs", price: 369 },
      { qty: "50+ pcs", price: 319 }
    ],
    min_order: 1,
    turnaround: "48-72 Hours",
    rating: 5.0,
    reviews_count: 168,
    gsm: 160,
    material: "100% Moisture-Wicking Micro-Polyester Jacquard",
    fit: "Ergonomic Athletic Fit",
    fabric: "Breathable Honeycomb Jacquard",
    sku: "SJ-160-SUB",
    care_instructions: "Cold wash, no fabric softener, do not iron on vinyl numbers.",
    printing_compatibility: ["Sublimation", "Vinyl"]
  },
  {
    id: "sj-02",
    slug: "cricket-team-custom-collar-jersey",
    name: "Tournament Cricket Team Sublimated Jersey",
    category: "tshirts",
    category_label: "Sports Jerseys",
    subcategory: "jersey",
    price: 549,
    original_price: 749,
    badge: "Bulk Fav",
    in_stock: true,
    is_sold_out: false,
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80",
      "https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=800&q=80"
    ],
    description: "Polo collar cricket tournament jersey with breathable underarm air-mesh panels. UPF 30+ sun protection and anti-odor silver ion finish for full-day matches in bright sunlight.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    colors: [
      {
        name: "Royal Blue",
        hex: "#4169E1",
        frontImage: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=800&q=80"
      },
      {
        name: "White",
        hex: "#FFFFFF",
        frontImage: "https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80"
      },
      {
        name: "Forest Green",
        hex: "#228B22",
        frontImage: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80"
      }
    ],
    print_types: ["All-Over Sublimation", "Embroidered Club Crest", "Vinyl Numbers"],
    bulk_pricing: [
      { qty: "1-9 pcs", price: 549 },
      { qty: "10-24 pcs", price: 469 },
      { qty: "25-49 pcs", price: 409 },
      { qty: "50+ pcs", price: 349 }
    ],
    min_order: 1,
    turnaround: "48-72 Hours",
    rating: 4.9,
    reviews_count: 122,
    gsm: 180,
    material: "100% Interlock Dry-Fit Micro-Poly",
    fit: "Cricket Match Active Fit",
    fabric: "Sun-Shield Interlock Poly",
    sku: "SJ-180-CRK",
    care_instructions: "Quick wash cold, hang dry in breeze.",
    printing_compatibility: ["Sublimation", "Vinyl", "Embroidery"]
  },
  {
    id: "sj-03",
    slug: "football-club-sublimation-kit",
    name: "Football Club Sublimation Match Jersey",
    category: "tshirts",
    category_label: "Sports Jerseys",
    subcategory: "jersey",
    price: 579,
    original_price: 799,
    badge: "Hot Deal",
    in_stock: true,
    is_sold_out: false,
    image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80",
      "https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=800&q=80"
    ],
    description: "V-neck pro football jersey featuring ventilated laser-cut side perforations. Includes sponsor chest logo, chest federation badge, custom sleeve patches, and player squad numbers.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    colors: [
      {
        name: "Red",
        hex: "#DC2626",
        frontImage: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=800&q=80"
      },
      {
        name: "Black",
        hex: "#18181B",
        frontImage: "https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80"
      },
      {
        name: "Royal Blue",
        hex: "#4169E1",
        frontImage: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80"
      }
    ],
    print_types: ["All-Over Sublimation", "Vinyl Heat Seal Name/No", "Silicone Crest Badge"],
    bulk_pricing: [
      { qty: "1-9 pcs", price: 579 },
      { qty: "10-24 pcs", price: 499 },
      { qty: "25-49 pcs", price: 439 },
      { qty: "50+ pcs", price: 379 }
    ],
    min_order: 1,
    turnaround: "48-72 Hours",
    rating: 4.9,
    reviews_count: 95,
    gsm: 165,
    material: "100% Breathable Dimple Mesh Poly",
    fit: "Modern Football Match Fit",
    fabric: "Dimple Knit Micro-Mesh",
    sku: "SJ-165-FTB",
    care_instructions: "Cold wash inside out, do not iron.",
    printing_compatibility: ["Sublimation", "Vinyl"]
  },
  {
    id: "sj-04",
    slug: "basketball-tank-jersey",
    name: "Pro Court Basketball Mesh Tank Jersey",
    category: "tshirts",
    category_label: "Sports Jerseys",
    subcategory: "jersey",
    price: 449,
    original_price: 649,
    badge: "New",
    in_stock: true,
    is_sold_out: false,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80",
      "https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=800&q=80"
    ],
    description: "Classic open-hole eyelet mesh basketball singlet with contrast knit ribbing around armholes and neck. Lightweight, ultra-breathable, and quick dry.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    colors: [
      {
        name: "Black",
        hex: "#18181B",
        frontImage: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=800&q=80"
      },
      {
        name: "Red",
        hex: "#DC2626",
        frontImage: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80"
      },
      {
        name: "White",
        hex: "#FFFFFF",
        frontImage: "https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80"
      }
    ],
    print_types: ["Sublimation", "Vinyl Heat Seal Name/No"],
    bulk_pricing: [
      { qty: "1-9 pcs", price: 449 },
      { qty: "10-24 pcs", price: 379 },
      { qty: "25-49 pcs", price: 329 },
      { qty: "50+ pcs", price: 279 }
    ],
    min_order: 1,
    turnaround: "48 Hours",
    rating: 4.8,
    reviews_count: 51,
    gsm: 170,
    material: "100% Polyester Eyelet Mesh",
    fit: "Loose Basketball Tank Cut",
    fabric: "Classic Eyelet Sport Mesh",
    sku: "SJ-170-BSK",
    care_instructions: "Cold wash, quick dry.",
    printing_compatibility: ["Sublimation", "Vinyl"]
  },
  {
    id: "sj-05",
    slug: "marathon-running-singlet",
    name: "Ultra-Lightweight 120 GSM Marathon Singlet",
    category: "tshirts",
    category_label: "Sports Jerseys",
    subcategory: "jersey",
    price: 399,
    original_price: 599,
    badge: "48h Rush",
    in_stock: true,
    is_sold_out: false,
    image: "https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=800&q=80",
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80"
    ],
    description: "Weighing only 85 grams, this featherlight runner singlet eliminates chafe over 42km marathons. Micro-dot ventilation channels air directly to the skin.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      {
        name: "Royal Blue",
        hex: "#4169E1",
        frontImage: "https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80"
      },
      {
        name: "Red",
        hex: "#DC2626",
        frontImage: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=800&q=80"
      }
    ],
    print_types: ["All-Over Sublimation", "Reflective Vinyl Print"],
    bulk_pricing: [
      { qty: "1-9 pcs", price: 399 },
      { qty: "10-24 pcs", price: 339 },
      { qty: "25-49 pcs", price: 289 },
      { qty: "50+ pcs", price: 239 }
    ],
    min_order: 1,
    turnaround: "48 Hours",
    rating: 4.8,
    reviews_count: 62,
    gsm: 120,
    material: "100% Feather-Poly Microdot",
    fit: "Athletic Runner Tank",
    fabric: "Featherlight Micro-Dot Poly",
    sku: "SJ-120-MTH",
    care_instructions: "Machine wash cold, line dry instantly.",
    printing_compatibility: ["Sublimation", "Vinyl"]
  },
  {
    id: "sj-06",
    slug: "esports-gaming-jersey",
    name: "eSports Pro Gaming Sublimated Jersey",
    category: "tshirts",
    category_label: "Sports Jerseys",
    subcategory: "jersey",
    price: 529,
    original_price: 729,
    badge: "Made to order",
    in_stock: true,
    is_sold_out: false,
    image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80",
      "https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=800&q=80"
    ],
    description: "Designed for competitive gaming athletes and tournament streaming squads. Low profile mandarin zip-collar, gamertag back personalization, and anti-static poly weave.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    colors: [
      {
        name: "Black",
        hex: "#18181B",
        frontImage: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=800&q=80"
      },
      {
        name: "Royal Blue",
        hex: "#4169E1",
        frontImage: "https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=800&q=80",
        backImage: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80"
      }
    ],
    print_types: ["All-Over Sublimation", "Metallic Vinyl Gamertag"],
    bulk_pricing: [
      { qty: "1-9 pcs", price: 529 },
      { qty: "10-24 pcs", price: 449 },
      { qty: "25-49 pcs", price: 389 },
      { qty: "50+ pcs", price: 329 }
    ],
    min_order: 1,
    turnaround: "48-72 Hours",
    rating: 5.0,
    reviews_count: 88,
    gsm: 170,
    material: "100% Anti-Static Cool-Max Polyester",
    fit: "Modern Gamer Ergonomic Fit",
    fabric: "Anti-Static Cool-Max Knit",
    sku: "SJ-170-ESP",
    care_instructions: "Cold wash, no bleach, do not iron over gamertag.",
    printing_compatibility: ["Sublimation", "Vinyl"]
  }
];

export async function seedApparelData() {
  console.log(`Starting seed of ${APPAREL_SEED_PRODUCTS.length} apparel products...`);

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

    const { error: pErr } = await supabase.from("products").upsert(row, { onConflict: "id" });
    if (pErr) {
      console.error(`Error inserting product ${p.id}:`, pErr.message);
    } else {
      console.log(`✓ Product ${p.id}: ${p.name}`);
    }

    // Insert variants
    for (const color of p.colors) {
      for (const size of p.sizes) {
        const sku = `${p.sku}-${color.name.slice(0, 3).toUpperCase()}-${size}`;
        const variantRow = {
          product_id: p.id,
          sku,
          size,
          color_name: color.name,
          color_hex: color.hex,
          additional_price: size === "XXL" ? 40 : size === "XXXL" ? 80 : 0,
          stock_quantity: Math.floor(Math.random() * 150) + 50,
          is_available: true,
        };

        const { error: vErr } = await supabase.from("variants").upsert(variantRow, { onConflict: "sku" });
        if (vErr && !vErr.message.includes("duplicate")) {
          // ignore minor duplicate warnings
        }
      }
    }
  }

  console.log("Apparel seed completed successfully!");
}

// Run immediately if executed via node
if (process.argv[1] && process.argv[1].endsWith("seed-apparel.ts")) {
  seedApparelData().catch(console.error);
}
