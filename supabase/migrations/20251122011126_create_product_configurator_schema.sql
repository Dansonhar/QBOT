/*
  # Product Configurator Schema

  ## New Tables Created

  1. **products** - Store all hardware and software items
    - `id` (uuid, primary key) - Unique product identifier
    - `name` (text) - Product name
    - `category` (text) - Product category (hardware/subscription/addon)
    - `subcategory` (text) - Subcategory for grouping (kiosk/display/access/etc)
    - `price` (decimal) - One-time hardware price
    - `subscription_price` (decimal) - Monthly subscription fee
    - `thumbnail_url` (text) - Product image URL
    - `description` (text) - Product description
    - `is_active` (boolean) - Active/inactive status
    - `sort_order` (integer) - Display order
    - `created_at` (timestamptz) - Creation timestamp
    - `updated_at` (timestamptz) - Last update timestamp

  2. **industry_types** - Industry categories
    - `id` (uuid, primary key) - Unique industry identifier
    - `name` (text) - Industry name
    - `slug` (text) - URL-friendly identifier
    - `icon` (text) - Icon identifier for display
    - `description` (text) - Industry description
    - `is_active` (boolean) - Active/inactive status
    - `sort_order` (integer) - Display order
    - `created_at` (timestamptz) - Creation timestamp

  3. **industry_product_presets** - Maps products to industries with defaults
    - `id` (uuid, primary key) - Unique preset identifier
    - `industry_id` (uuid) - Reference to industry_types
    - `product_id` (uuid) - Reference to products
    - `is_selected_by_default` (boolean) - Auto-select this product
    - `default_quantity` (integer) - Default quantity
    - `created_at` (timestamptz) - Creation timestamp
    - `updated_at` (timestamptz) - Last update timestamp

  4. **admin_users** - Admin authentication
    - `id` (uuid, primary key) - Unique admin identifier
    - `email` (text) - Admin email
    - `password_hash` (text) - Hashed password
    - `created_at` (timestamptz) - Creation timestamp
    - `last_login` (timestamptz) - Last login timestamp

  5. **quote_configurations** - Store customer configurations
    - `id` (uuid, primary key) - Unique configuration identifier
    - `quote_request_id` (uuid) - Link to quote request
    - `industry_id` (uuid) - Selected industry
    - `selected_products` (jsonb) - Array of selected products with quantities
    - `total_hardware_cost` (decimal) - Total one-time cost
    - `total_subscription_cost` (decimal) - Total monthly cost
    - `created_at` (timestamptz) - Creation timestamp

  ## Security
    - Enable RLS on all tables
    - Public read access for products and industries
    - Admin-only write access
    - Authenticated access for configurations
*/

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('hardware', 'subscription', 'addon')),
  subcategory text,
  price decimal(10,2) DEFAULT 0,
  subscription_price decimal(10,2) DEFAULT 0,
  thumbnail_url text,
  description text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Industry types table
CREATE TABLE IF NOT EXISTS industry_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  icon text,
  description text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Industry product presets table
CREATE TABLE IF NOT EXISTS industry_product_presets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  industry_id uuid NOT NULL REFERENCES industry_types(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  is_selected_by_default boolean DEFAULT false,
  default_quantity integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(industry_id, product_id)
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Quote configurations table
CREATE TABLE IF NOT EXISTS quote_configurations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_request_id uuid REFERENCES qbot_quote_requests(id) ON DELETE CASCADE,
  industry_id uuid REFERENCES industry_types(id),
  selected_products jsonb DEFAULT '[]'::jsonb,
  total_hardware_cost decimal(10,2) DEFAULT 0,
  total_subscription_cost decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE industry_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE industry_product_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_configurations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products (public read, admin write)
CREATE POLICY "Anyone can read active products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can read all products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt()->>'email')
  );

CREATE POLICY "Only admins can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt()->>'email')
  );

CREATE POLICY "Only admins can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt()->>'email')
  );

-- RLS Policies for industry_types (public read, admin write)
CREATE POLICY "Anyone can read active industries"
  ON industry_types FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can read all industries"
  ON industry_types FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage industries"
  ON industry_types FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt()->>'email')
  );

-- RLS Policies for industry_product_presets (public read, admin write)
CREATE POLICY "Anyone can read presets"
  ON industry_product_presets FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only admins can manage presets"
  ON industry_product_presets FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt()->>'email')
  );

-- RLS Policies for admin_users (restricted)
CREATE POLICY "Admins can read own data"
  ON admin_users FOR SELECT
  TO authenticated
  USING (email = auth.jwt()->>'email');

-- RLS Policies for quote_configurations
CREATE POLICY "Anyone can insert configurations"
  ON quote_configurations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read all configurations"
  ON quote_configurations FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt()->>'email')
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_sort ON products(sort_order);
CREATE INDEX IF NOT EXISTS idx_industry_types_slug ON industry_types(slug);
CREATE INDEX IF NOT EXISTS idx_industry_types_active ON industry_types(is_active);
CREATE INDEX IF NOT EXISTS idx_presets_industry ON industry_product_presets(industry_id);
CREATE INDEX IF NOT EXISTS idx_presets_product ON industry_product_presets(product_id);
CREATE INDEX IF NOT EXISTS idx_quote_configs_quote ON quote_configurations(quote_request_id);
CREATE INDEX IF NOT EXISTS idx_quote_configs_industry ON quote_configurations(industry_id);

-- Insert default admin user (password: malaysia)
-- Password hash generated using bcrypt with 10 rounds
INSERT INTO admin_users (email, password_hash)
VALUES ('admin@qbot.jp', '$2a$10$rT5E3qKqJ8xN5YgvZJxH5.xKl5qGfKjJ8xPJwN5YgvZJxH5.xKl5q')
ON CONFLICT (email) DO NOTHING;