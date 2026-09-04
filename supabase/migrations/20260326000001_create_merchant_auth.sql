-- Shared merchants table for free tools with Supabase Auth
-- This table is linked to auth.users and stores common merchant profile fields.
-- Tool-specific data lives in separate tables (waorder_categories, waorder_items, etc.)

CREATE TABLE merchants (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  business_name text NOT NULL,
  phone text,
  whatsapp_number text,
  logo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_merchants_email ON merchants(email);

-- RLS: merchants can only access their own row
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can view own profile"
  ON merchants FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Merchants can update own profile"
  ON merchants FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Merchants can insert own profile"
  ON merchants FOR INSERT
  WITH CHECK (auth.uid() = id);
