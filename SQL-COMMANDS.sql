-- =====================================================
-- COPY AND PASTE THIS ENTIRE FILE INTO SUPABASE SQL EDITOR
-- =====================================================

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
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts to orders
CREATE POLICY "Allow anonymous inserts to orders"
ON orders FOR INSERT
TO anon
WITH CHECK (true);

-- Allow anonymous inserts to order_items
CREATE POLICY "Allow anonymous inserts to order_items"
ON order_items FOR INSERT
TO anon
WITH CHECK (true);

-- Allow service role to read orders
CREATE POLICY "Allow service role to read orders"
ON orders FOR SELECT
TO service_role
USING (true);

-- Allow service role to read order_items
CREATE POLICY "Allow service role to read order_items"
ON order_items FOR SELECT
TO service_role
USING (true);

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('order-images', 'order-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anonymous uploads to storage
CREATE POLICY "Allow anonymous uploads"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'order-images');

-- Allow public access to storage files
CREATE POLICY "Allow public access to order images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'order-images');
