-- ==============================================================================
-- AIEL DESIGN & PRINTING STUDIO — APPAREL CATALOGUE MIGRATION
-- Adds product_categories, product_images, product_size_charts,
-- product_customizations tables + updates products table for apparel
-- ==============================================================================

-- 1. ADD NEW COLUMNS TO PRODUCTS TABLE
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS subcategory TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS fabric TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sku TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS printing_compatibility TEXT[] DEFAULT '{}';

-- 2. PRODUCT CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.product_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    parent_category TEXT,
    description TEXT,
    image TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. PRODUCT IMAGES TABLE (per-color images)
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    color_name TEXT,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    position TEXT NOT NULL DEFAULT 'front',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. PRODUCT SIZE CHARTS TABLE
CREATE TABLE IF NOT EXISTS public.product_size_charts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id TEXT NOT NULL,
    size_label TEXT NOT NULL,
    chest_cm NUMERIC(5,1),
    length_cm NUMERIC(5,1),
    shoulder_cm NUMERIC(5,1),
    sleeve_cm NUMERIC(5,1),
    hip_cm NUMERIC(5,1),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE (category_id, size_label)
);

-- 5. PRODUCT CUSTOMIZATIONS / QUOTE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.product_customizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    selected_color TEXT,
    selected_size TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    print_method TEXT,
    print_positions TEXT[] DEFAULT '{}',
    print_size TEXT,
    artwork_url TEXT,
    instructions TEXT,
    garment_price NUMERIC(10,2),
    estimated_print_cost NUMERIC(10,2),
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'reviewing', 'quoted', 'approved', 'rejected', 'completed')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. INDEXES
CREATE INDEX IF NOT EXISTS idx_product_categories_parent ON public.product_categories(parent_category);
CREATE INDEX IF NOT EXISTS idx_product_categories_slug ON public.product_categories(slug);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_color ON public.product_images(product_id, color_name);
CREATE INDEX IF NOT EXISTS idx_product_size_charts_category ON public.product_size_charts(category_id);
CREATE INDEX IF NOT EXISTS idx_product_customizations_product ON public.product_customizations(product_id);
CREATE INDEX IF NOT EXISTS idx_product_customizations_email ON public.product_customizations(customer_email);
CREATE INDEX IF NOT EXISTS idx_product_customizations_status ON public.product_customizations(status);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON public.products(subcategory);

-- 7. ENABLE RLS ON NEW TABLES
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_size_charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_customizations ENABLE ROW LEVEL SECURITY;

-- 8. RLS POLICIES

-- product_categories: Public read, service_role write
DROP POLICY IF EXISTS "Public can view categories" ON public.product_categories;
CREATE POLICY "Public can view categories"
    ON public.product_categories FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Service role manages categories" ON public.product_categories;
CREATE POLICY "Service role manages categories"
    ON public.product_categories FOR ALL
    TO service_role
    USING (true) WITH CHECK (true);

-- product_images: Public read, service_role write
DROP POLICY IF EXISTS "Public can view product images" ON public.product_images;
CREATE POLICY "Public can view product images"
    ON public.product_images FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Service role manages product images" ON public.product_images;
CREATE POLICY "Service role manages product images"
    ON public.product_images FOR ALL
    TO service_role
    USING (true) WITH CHECK (true);

-- product_size_charts: Public read, service_role write
DROP POLICY IF EXISTS "Public can view size charts" ON public.product_size_charts;
CREATE POLICY "Public can view size charts"
    ON public.product_size_charts FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Service role manages size charts" ON public.product_size_charts;
CREATE POLICY "Service role manages size charts"
    ON public.product_size_charts FOR ALL
    TO service_role
    USING (true) WITH CHECK (true);

-- product_customizations: Users can create and view own, service_role manages all
DROP POLICY IF EXISTS "Anyone can submit customization requests" ON public.product_customizations;
CREATE POLICY "Anyone can submit customization requests"
    ON public.product_customizations FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own customization requests" ON public.product_customizations;
CREATE POLICY "Users can view own customization requests"
    ON public.product_customizations FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Service role manages customizations" ON public.product_customizations;
CREATE POLICY "Service role manages customizations"
    ON public.product_customizations FOR ALL
    TO service_role
    USING (true) WITH CHECK (true);

-- Admin write policies for authenticated users (admin check done server-side)
DROP POLICY IF EXISTS "Authenticated users can manage products" ON public.products;
CREATE POLICY "Authenticated users can manage products"
    ON public.products FOR ALL
    TO authenticated
    USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can manage variants" ON public.variants;
CREATE POLICY "Authenticated users can manage variants"
    ON public.variants FOR ALL
    TO authenticated
    USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can manage product images" ON public.product_images;
CREATE POLICY "Authenticated users can manage product images"
    ON public.product_images FOR ALL
    TO authenticated
    USING (true) WITH CHECK (true);

-- 9. GRANTS
GRANT ALL ON TABLE public.product_categories TO postgres, service_role;
GRANT SELECT ON TABLE public.product_categories TO anon, authenticated;

GRANT ALL ON TABLE public.product_images TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.product_images TO authenticated;
GRANT SELECT ON TABLE public.product_images TO anon;

GRANT ALL ON TABLE public.product_size_charts TO postgres, service_role;
GRANT SELECT ON TABLE public.product_size_charts TO anon, authenticated;

GRANT ALL ON TABLE public.product_customizations TO postgres, service_role;
GRANT SELECT, INSERT ON TABLE public.product_customizations TO anon, authenticated;

-- Allow authenticated users full product/variant CRUD (admin operations)
GRANT INSERT, UPDATE, DELETE ON TABLE public.products TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.variants TO authenticated;

-- 10. TRIGGERS
DROP TRIGGER IF EXISTS trigger_product_categories_updated_at ON public.product_categories;
CREATE TRIGGER trigger_product_categories_updated_at
    BEFORE UPDATE ON public.product_categories
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_product_customizations_updated_at ON public.product_customizations;
CREATE TRIGGER trigger_product_customizations_updated_at
    BEFORE UPDATE ON public.product_customizations
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_variants_updated_at ON public.variants;
CREATE TRIGGER trigger_variants_updated_at
    BEFORE UPDATE ON public.variants
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 11. SEED APPAREL CATEGORIES
INSERT INTO public.product_categories (id, name, slug, parent_category, description, image, sort_order)
VALUES
    ('apparel', 'T-Shirts & Apparel', 'tshirts', NULL, 'Custom printed t-shirts, polos, hoodies, sweatshirts and sports jerseys', NULL, 1),
    ('round-neck', 'Round Neck T-Shirts', 'round-neck-tshirts', 'apparel', 'Classic crewneck cotton t-shirts in various GSM weights', NULL, 1),
    ('polo', 'Polo T-Shirts', 'polo-tshirts', 'apparel', 'Corporate and casual pique polo shirts with collar', NULL, 2),
    ('oversized', 'Oversized T-Shirts', 'oversized-tshirts', 'apparel', 'Streetwear drop-shoulder oversized silhouettes', NULL, 3),
    ('hoodie', 'Hoodies', 'hoodies', 'apparel', 'Pullover and zip-up hoodies in fleece and terry', NULL, 4),
    ('sweatshirt', 'Sweatshirts', 'sweatshirts', 'apparel', 'Crewneck sweatshirts in heavyweight cotton blends', NULL, 5),
    ('jersey', 'Sports Jerseys', 'sports-jerseys', 'apparel', 'Moisture-wicking sublimated team jerseys', NULL, 6)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order;

-- 12. SEED SIZE CHARTS

-- Round Neck T-Shirts
INSERT INTO public.product_size_charts (category_id, size_label, chest_cm, length_cm, shoulder_cm, sleeve_cm) VALUES
    ('round-neck', 'S', 96, 66, 43, 20),
    ('round-neck', 'M', 101, 69, 45, 21),
    ('round-neck', 'L', 106, 72, 47, 22),
    ('round-neck', 'XL', 111, 74, 49, 23),
    ('round-neck', 'XXL', 116, 76, 51, 24),
    ('round-neck', 'XXXL', 121, 78, 53, 25)
ON CONFLICT (category_id, size_label) DO NOTHING;

-- Polo T-Shirts
INSERT INTO public.product_size_charts (category_id, size_label, chest_cm, length_cm, shoulder_cm, sleeve_cm) VALUES
    ('polo', 'S', 96, 68, 44, 22),
    ('polo', 'M', 101, 70, 46, 23),
    ('polo', 'L', 106, 72, 48, 24),
    ('polo', 'XL', 111, 74, 50, 25),
    ('polo', 'XXL', 116, 76, 52, 26),
    ('polo', 'XXXL', 121, 78, 54, 27)
ON CONFLICT (category_id, size_label) DO NOTHING;

-- Oversized T-Shirts
INSERT INTO public.product_size_charts (category_id, size_label, chest_cm, length_cm, shoulder_cm, sleeve_cm) VALUES
    ('oversized', 'S', 106, 72, 52, 24),
    ('oversized', 'M', 111, 74, 54, 25),
    ('oversized', 'L', 116, 76, 56, 26),
    ('oversized', 'XL', 121, 78, 58, 27),
    ('oversized', 'XXL', 126, 80, 60, 28),
    ('oversized', 'XXXL', 131, 82, 62, 29)
ON CONFLICT (category_id, size_label) DO NOTHING;

-- Hoodies
INSERT INTO public.product_size_charts (category_id, size_label, chest_cm, length_cm, shoulder_cm, sleeve_cm) VALUES
    ('hoodie', 'S', 104, 66, 46, 60),
    ('hoodie', 'M', 109, 69, 48, 62),
    ('hoodie', 'L', 114, 72, 50, 64),
    ('hoodie', 'XL', 119, 74, 52, 66),
    ('hoodie', 'XXL', 124, 76, 54, 68),
    ('hoodie', 'XXXL', 129, 78, 56, 70)
ON CONFLICT (category_id, size_label) DO NOTHING;

-- Sweatshirts
INSERT INTO public.product_size_charts (category_id, size_label, chest_cm, length_cm, shoulder_cm, sleeve_cm) VALUES
    ('sweatshirt', 'S', 102, 64, 45, 58),
    ('sweatshirt', 'M', 107, 67, 47, 60),
    ('sweatshirt', 'L', 112, 70, 49, 62),
    ('sweatshirt', 'XL', 117, 72, 51, 64),
    ('sweatshirt', 'XXL', 122, 74, 53, 66),
    ('sweatshirt', 'XXXL', 127, 76, 55, 68)
ON CONFLICT (category_id, size_label) DO NOTHING;

-- Sports Jerseys
INSERT INTO public.product_size_charts (category_id, size_label, chest_cm, length_cm, shoulder_cm, sleeve_cm) VALUES
    ('jersey', 'S', 94, 68, 43, 20),
    ('jersey', 'M', 99, 70, 45, 21),
    ('jersey', 'L', 104, 72, 47, 22),
    ('jersey', 'XL', 109, 74, 49, 23),
    ('jersey', 'XXL', 114, 76, 51, 24),
    ('jersey', 'XXXL', 119, 78, 53, 25)
ON CONFLICT (category_id, size_label) DO NOTHING;

-- Force PostgREST schema cache reload
NOTIFY pgrst, 'reload schema';
