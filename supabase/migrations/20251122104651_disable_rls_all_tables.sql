/*
  # Disable RLS on All Tables

  ## Changes
  - Disable Row Level Security on all tables
  - This allows unrestricted access to all data through the anon key
  - All operations will work without authentication checks

  ## Tables affected
  - orders
  - products
  - industry_types
  - industry_product_presets
  - admin_users
  - quote_configurations
  - qbot_quote_requests
*/

-- Disable RLS on all tables
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE industry_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE industry_product_presets DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE quote_configurations DISABLE ROW LEVEL SECURITY;
ALTER TABLE qbot_quote_requests DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies (optional, but ensures clean slate)
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can update orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can view all orders" ON orders;
DROP POLICY IF EXISTS "Public can view orders via payment link" ON orders;

DROP POLICY IF EXISTS "Anyone can read active products" ON products;
DROP POLICY IF EXISTS "Authenticated users can read all products" ON products;
DROP POLICY IF EXISTS "Only admins can insert products" ON products;
DROP POLICY IF EXISTS "Only admins can update products" ON products;
DROP POLICY IF EXISTS "Only admins can delete products" ON products;

DROP POLICY IF EXISTS "Anyone can read active industries" ON industry_types;
DROP POLICY IF EXISTS "Authenticated users can read all industries" ON industry_types;
DROP POLICY IF EXISTS "Only admins can manage industries" ON industry_types;

DROP POLICY IF EXISTS "Anyone can read presets" ON industry_product_presets;
DROP POLICY IF EXISTS "Only admins can manage presets" ON industry_product_presets;

DROP POLICY IF EXISTS "Admins can read own data" ON admin_users;

DROP POLICY IF EXISTS "Anyone can insert configurations" ON quote_configurations;
DROP POLICY IF EXISTS "Authenticated users can read all configurations" ON quote_configurations;

DROP POLICY IF EXISTS "Anyone can insert quote requests" ON qbot_quote_requests;
DROP POLICY IF EXISTS "Authenticated users can view all quote requests" ON qbot_quote_requests;
