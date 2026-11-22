-- Supabase schema for HADIDJA.SHOP
-- ====================================================
-- Users (Supabase auth provides a `auth.users` table)
-- Profiles table (one-to-one with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text,
    avatar_url text,
    phone text,
    created_at timestamp with time zone DEFAULT now()
);

-- Categories
CREATE TABLE IF NOT EXISTS public.categories (
    id bigserial PRIMARY KEY,
    name text NOT NULL UNIQUE,
    slug text NOT NULL UNIQUE,
    created_at timestamp with time zone DEFAULT now()
);

-- Products
CREATE TABLE IF NOT EXISTS public.products (
    id bigserial PRIMARY KEY,
    name text NOT NULL,
    description text,
    price numeric NOT NULL,
    old_price numeric,
    badge text,
    material text,
    size text,
    category_id bigint REFERENCES public.categories(id) ON DELETE SET NULL,
    image_url text,
    colors jsonb,
    created_at timestamp with time zone DEFAULT now()
);

-- Favorites (many-to-many between users and products)
CREATE TABLE IF NOT EXISTS public.favorites (
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id bigint REFERENCES public.products(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, product_id)
);

-- Addresses
CREATE TABLE IF NOT EXISTS public.addresses (
    id bigserial PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    line1 text NOT NULL,
    line2 text,
    city text NOT NULL,
    postal_code text NOT NULL,
    country text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Orders
CREATE TABLE IF NOT EXISTS public.orders (
    id bigserial PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    status text NOT NULL DEFAULT 'pending',
    total numeric NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Order items (line items)
CREATE TABLE IF NOT EXISTS public.order_items (
    id bigserial PRIMARY KEY,
    order_id bigint REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id bigint REFERENCES public.products(id) ON DELETE SET NULL,
    quantity integer NOT NULL,
    price_at_purchase numeric NOT NULL
);

-- User settings (future extensibility)
CREATE TABLE IF NOT EXISTS public.user_settings (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    theme text NOT NULL DEFAULT 'light',
    notifications boolean NOT NULL DEFAULT true
);

-- ====================================================
-- Row Level Security (RLS) Policies
-- ====================================================
-- Enable RLS on all tables except public.categories (read‑only for all)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Profiles: each user can view & edit own profile
CREATE POLICY "Select own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Favorites: users can manage own favorites
CREATE POLICY "Select own favorites" ON public.favorites
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Insert own favorites" ON public.favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Delete own favorites" ON public.favorites
    FOR DELETE USING (auth.uid() = user_id);

-- Addresses: users can manage own addresses
CREATE POLICY "Select own addresses" ON public.addresses
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Insert own addresses" ON public.addresses
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Update own addresses" ON public.addresses
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Delete own addresses" ON public.addresses
    FOR DELETE USING (auth.uid() = user_id);

-- Orders: users can view own orders, admin can view all (admin role is defined by a custom claim)
CREATE POLICY "Select own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id OR auth.role() = 'admin');
CREATE POLICY "Insert own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Update own orders" ON public.orders
    FOR UPDATE USING (auth.uid() = user_id OR auth.role() = 'admin');

-- Order items: only accessible through orders (cascade) – no direct access needed
CREATE POLICY "Select own order items" ON public.order_items
    FOR SELECT USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR auth.role() = 'admin')));

-- User settings: own settings only
CREATE POLICY "Select own settings" ON public.user_settings
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Update own settings" ON public.user_settings
    FOR UPDATE USING (auth.uid() = user_id);

-- Public read access for categories (no RLS needed)
-- Optionally you can add a policy to allow SELECT for everyone:
CREATE POLICY "Public select categories" ON public.categories
    FOR SELECT USING (true);

-- ====================================================
-- End of Schema & Policies
-- ====================================================
