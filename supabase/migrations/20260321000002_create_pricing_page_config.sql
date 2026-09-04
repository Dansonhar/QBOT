CREATE TABLE IF NOT EXISTS pricing_page_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  config_data jsonb NOT NULL,
  version integer NOT NULL DEFAULT 1,
  is_active boolean NOT NULL DEFAULT true,
  created_by text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE pricing_page_config DISABLE ROW LEVEL SECURITY;
