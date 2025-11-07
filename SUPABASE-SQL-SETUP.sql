-- ============================================
-- DTF SUBMISSION - SUPABASE SQL SETUP
-- Copy and paste this entire file into your Supabase SQL Editor
-- ============================================

-- Create orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  delivery_method TEXT NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for order images
INSERT INTO storage.buckets (id, name, public)
VALUES ('order-images', 'order-images', false);

-- Set up storage policies to allow uploads
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'order-images');

CREATE POLICY "Allow public downloads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'order-images');

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for orders table
CREATE POLICY "Allow public insert on orders"
ON orders FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public select on orders"
ON orders FOR SELECT
TO public
USING (true);

-- Create policies for order_items table
CREATE POLICY "Allow public insert on order_items"
ON order_items FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public select on order_items"
ON order_items FOR SELECT
TO public
USING (true);

-- ============================================
-- Setup complete!
-- Next steps:
-- 1. Deploy the Edge Function (see README-SETUP.md)
-- 2. Test the application
-- ============================================
