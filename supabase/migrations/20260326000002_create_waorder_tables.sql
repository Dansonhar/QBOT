-- WhatsApp Order: categories and items tables

-- Categories
CREATE TABLE waorder_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  name text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_waorder_categories_merchant ON waorder_categories(merchant_id);

ALTER TABLE waorder_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants manage own categories"
  ON waorder_categories FOR ALL
  USING (auth.uid() = merchant_id);

CREATE POLICY "Public can read categories"
  ON waorder_categories FOR SELECT
  USING (true);

-- Items
CREATE TABLE waorder_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES waorder_categories(id) ON DELETE CASCADE,
  merchant_id uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  name text NOT NULL,
  price decimal(10,2) NOT NULL DEFAULT 0,
  description text,
  image_url text,
  is_available boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_waorder_items_category ON waorder_items(category_id);
CREATE INDEX idx_waorder_items_merchant ON waorder_items(merchant_id);

ALTER TABLE waorder_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants manage own items"
  ON waorder_items FOR ALL
  USING (auth.uid() = merchant_id);

CREATE POLICY "Public can read available items"
  ON waorder_items FOR SELECT
  USING (true);
