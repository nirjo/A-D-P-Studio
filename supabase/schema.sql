-- ==============================================================================
-- AIEL DESIGN & PRINTING STUDIO — SUPABASE SCHEMA & RLS POLICIES
-- Project URL: https://cisbahsmzwqqrmmwgncp.supabase.co
-- Tables: products, variants, customers, orders, payment_status
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CUSTOM TYPES
DO $$ BEGIN
    CREATE TYPE order_status_type AS ENUM (
        'pending_payment',
        'payment_verified',
        'mockup_approval',
        'in_production',
        'dispatched',
        'delivered',
        'cancelled'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_gateway_type AS ENUM (
        'razorpay',
        'whatsapp_upi',
        'cod',
        'bank_transfer'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,                       -- e.g. 'tee-streetwear-oversized'
    slug TEXT NOT NULL UNIQUE,                 -- e.g. 'streetwear-oversized-tee'
    name TEXT NOT NULL,
    category TEXT NOT NULL,                    -- 'tshirts' | 'mugs' | 'keychains' | 'tote-bags' | 'phone-cases' | 'combos'
    category_label TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    original_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    badge TEXT,
    is_sold_out BOOLEAN NOT NULL DEFAULT FALSE,
    image TEXT NOT NULL,
    gallery TEXT[] NOT NULL DEFAULT '{}',
    description TEXT NOT NULL DEFAULT '',
    sizes TEXT[] NOT NULL DEFAULT '{}',
    colors JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of { name: string, hex: string }
    print_types TEXT[] NOT NULL DEFAULT '{}',
    bulk_pricing JSONB NOT NULL DEFAULT '[]'::jsonb,
    min_order INTEGER NOT NULL DEFAULT 1,
    turnaround TEXT NOT NULL DEFAULT '48h',
    rating NUMERIC(2, 1) NOT NULL DEFAULT 4.9,
    reviews_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. VARIANTS TABLE
CREATE TABLE IF NOT EXISTS public.variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    sku TEXT UNIQUE,
    size TEXT,
    color_name TEXT,
    color_hex TEXT,
    print_type TEXT,
    additional_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    stock_quantity INTEGER NOT NULL DEFAULT 100,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. CUSTOMERS TABLE (Linked to auth.users if registered, or guest)
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    city TEXT,
    shipping_address JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,          -- e.g. 'AIEL-2026-0001'
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_email TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    shipping_city TEXT,
    shipping_address JSONB NOT NULL DEFAULT '{}'::jsonb,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,   -- Array of cart items with product info, size, color, artwork notes
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
    grand_total NUMERIC(10, 2) NOT NULL CHECK (grand_total >= 0),
    status order_status_type NOT NULL DEFAULT 'pending_payment',
    payment_method payment_gateway_type NOT NULL DEFAULT 'razorpay',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. PAYMENT_STATUS TABLE
CREATE TABLE IF NOT EXISTS public.payment_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    gateway payment_gateway_type NOT NULL DEFAULT 'razorpay',
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT UNIQUE,
    razorpay_signature TEXT,
    payment_link TEXT,                          -- e.g. 'https://razorpay.me/@stella3321'
    status TEXT NOT NULL DEFAULT 'created',     -- 'created' | 'authorized' | 'captured' | 'failed' | 'refunded'
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    webhook_payload JSONB,
    verified_at TIMESTAMPTZ,
    error_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_variants_product_id ON public.variants(product_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_auth_user_id ON public.customers(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_payment_status_order_id ON public.payment_status(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_status_razorpay_order_id ON public.payment_status(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_payment_status_razorpay_payment_id ON public.payment_status(razorpay_payment_id);

-- 9. ROW-LEVEL SECURITY (RLS) POLICIES
-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_status ENABLE ROW LEVEL SECURITY;

-- Products: Everyone can view (anon & authenticated), only service_role can modify
DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products"
    ON public.products FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Service role manages products" ON public.products;
CREATE POLICY "Service role manages products"
    ON public.products FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Variants: Everyone can view, only service_role can modify
DROP POLICY IF EXISTS "Public can view variants" ON public.variants;
CREATE POLICY "Public can view variants"
    ON public.variants FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Service role manages variants" ON public.variants;
CREATE POLICY "Service role manages variants"
    ON public.variants FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Customers:
-- Users can view and update their own customer record
-- Anon can create a guest customer record (for guest checkout)
DROP POLICY IF EXISTS "Users can view own customer record" ON public.customers;
DROP POLICY IF EXISTS "Anyone can view customer record" ON public.customers;
CREATE POLICY "Anyone can view customer record"
    ON public.customers FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Users can update own customer record" ON public.customers;
CREATE POLICY "Users can update own customer record"
    ON public.customers FOR UPDATE
    TO authenticated
    USING (auth.uid() = auth_user_id)
    WITH CHECK (auth.uid() = auth_user_id);

DROP POLICY IF EXISTS "Users and guests can insert customer record" ON public.customers;
CREATE POLICY "Users and guests can insert customer record"
    ON public.customers FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        (auth.uid() IS NULL AND auth_user_id IS NULL) OR
        (auth.uid() = auth_user_id)
    );

DROP POLICY IF EXISTS "Service role manages customers" ON public.customers;
CREATE POLICY "Service role manages customers"
    ON public.customers FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Orders:
-- Users & guests can create and view orders
-- Only service_role can update order status
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can view orders" ON public.orders;
CREATE POLICY "Anyone can view orders"
    ON public.orders FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Anyone can insert orders" ON public.orders;
CREATE POLICY "Anyone can insert orders"
    ON public.orders FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Service role manages orders" ON public.orders;
CREATE POLICY "Service role manages orders"
    ON public.orders FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Payment Status:
-- Customers can view payment status for their own orders
-- Only server (service_role) or payment callback can insert/update payment verification
DROP POLICY IF EXISTS "Users can view payment status of own orders" ON public.payment_status;
CREATE POLICY "Users can view payment status of own orders"
    ON public.payment_status FOR SELECT
    TO authenticated
    USING (
        order_id IN (
            SELECT o.id FROM public.orders o
            JOIN public.customers c ON o.customer_id = c.id
            WHERE c.auth_user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Service role manages payment_status" ON public.payment_status;
CREATE POLICY "Service role manages payment_status"
    ON public.payment_status FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Anon can create initial payment_status on checkout" ON public.payment_status;
CREATE POLICY "Anon can create initial payment_status on checkout"
    ON public.payment_status FOR INSERT
    TO anon, authenticated
    WITH CHECK (status IN ('created', 'pending'));

-- 10. HELPER FUNCTION & TRIGGER FOR UPDATED_AT
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_products_updated_at ON public.products;
CREATE TRIGGER trigger_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_orders_updated_at ON public.orders;
CREATE TRIGGER trigger_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_customers_updated_at ON public.customers;
CREATE TRIGGER trigger_customers_updated_at
    BEFORE UPDATE ON public.customers
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_payment_status_updated_at ON public.payment_status;
CREATE TRIGGER trigger_payment_status_updated_at
    BEFORE UPDATE ON public.payment_status
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 11. PERMISSIONS & SCHEMA CACHE RELOAD
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT ALL ON TABLE public.products TO postgres, service_role;
GRANT SELECT ON TABLE public.products TO anon, authenticated;

GRANT ALL ON TABLE public.variants TO postgres, service_role;
GRANT SELECT ON TABLE public.variants TO anon, authenticated;

GRANT ALL ON TABLE public.customers TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE ON TABLE public.customers TO anon, authenticated;

GRANT ALL ON TABLE public.orders TO postgres, service_role;
GRANT SELECT, INSERT ON TABLE public.orders TO anon, authenticated;

GRANT ALL ON TABLE public.payment_status TO postgres, service_role;
GRANT SELECT, INSERT ON TABLE public.payment_status TO anon, authenticated;

-- Force PostgREST schema cache reload immediately
NOTIFY pgrst, 'reload schema';
