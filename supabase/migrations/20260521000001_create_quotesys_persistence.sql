/*
  # QuoteSys + QuoteStudio shared persistence

  Three tables — all shared across the password-gated sales team
  (single password gate, so no per-user scoping). Each row tags itself
  with `tool` so quotesys and quotestudio can have separate catalogs of
  templates, companies and custom items.

  1. quotesys_templates    — saved item-bundle templates
  2. quotesys_companies    — reusable company / PIC contact directory
  3. quotesys_custom_items — custom catalog items added once, kept forever

  Permissive RLS (anon can read/write) matches the existing
  quotestudio_requests / qbot_quote_requests pattern. Access is
  controlled by the app password gate, not Postgres.
*/

-- ─── Templates ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quotesys_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool text NOT NULL CHECK (tool IN ('quotesys', 'quotestudio')),
  name text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quotesys_templates_tool ON quotesys_templates(tool);
CREATE INDEX IF NOT EXISTS idx_quotesys_templates_created ON quotesys_templates(created_at DESC);

ALTER TABLE quotesys_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anon read templates"   ON quotesys_templates;
DROP POLICY IF EXISTS "Anon insert templates" ON quotesys_templates;
DROP POLICY IF EXISTS "Anon update templates" ON quotesys_templates;
DROP POLICY IF EXISTS "Anon delete templates" ON quotesys_templates;

CREATE POLICY "Anon read templates"   ON quotesys_templates FOR SELECT TO anon USING (true);
CREATE POLICY "Anon insert templates" ON quotesys_templates FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon update templates" ON quotesys_templates FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon delete templates" ON quotesys_templates FOR DELETE TO anon USING (true);

-- ─── Companies (contact directory) ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quotesys_companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool text NOT NULL CHECK (tool IN ('quotesys', 'quotestudio')),
  company_name text NOT NULL,
  pic_name text,
  pic_contact text,
  pic_email text,
  delivery_address text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quotesys_companies_tool ON quotesys_companies(tool);
CREATE INDEX IF NOT EXISTS idx_quotesys_companies_name ON quotesys_companies(company_name);

ALTER TABLE quotesys_companies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anon read companies"   ON quotesys_companies;
DROP POLICY IF EXISTS "Anon insert companies" ON quotesys_companies;
DROP POLICY IF EXISTS "Anon update companies" ON quotesys_companies;
DROP POLICY IF EXISTS "Anon delete companies" ON quotesys_companies;

CREATE POLICY "Anon read companies"   ON quotesys_companies FOR SELECT TO anon USING (true);
CREATE POLICY "Anon insert companies" ON quotesys_companies FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon update companies" ON quotesys_companies FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon delete companies" ON quotesys_companies FOR DELETE TO anon USING (true);

-- ─── Custom catalog items (permanent additions) ─────────────────────────────
CREATE TABLE IF NOT EXISTS quotesys_custom_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool text NOT NULL CHECK (tool IN ('quotesys', 'quotestudio')),
  title text NOT NULL,
  description text,
  price numeric(12,2) NOT NULL DEFAULT 0,
  sst numeric(4,3) NOT NULL DEFAULT 0.08,
  item_type text NOT NULL DEFAULT 'one-time',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quotesys_custom_items_tool ON quotesys_custom_items(tool);

ALTER TABLE quotesys_custom_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anon read custom items"   ON quotesys_custom_items;
DROP POLICY IF EXISTS "Anon insert custom items" ON quotesys_custom_items;
DROP POLICY IF EXISTS "Anon update custom items" ON quotesys_custom_items;
DROP POLICY IF EXISTS "Anon delete custom items" ON quotesys_custom_items;

CREATE POLICY "Anon read custom items"   ON quotesys_custom_items FOR SELECT TO anon USING (true);
CREATE POLICY "Anon insert custom items" ON quotesys_custom_items FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon update custom items" ON quotesys_custom_items FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon delete custom items" ON quotesys_custom_items FOR DELETE TO anon USING (true);
