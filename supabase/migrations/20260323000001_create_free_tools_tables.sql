-- Free Tools: Lead capture table
CREATE TABLE IF NOT EXISTS free_tool_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  tool_used text NOT NULL CHECK (tool_used IN ('pdf_menu', 'review_qr', 'booking_qr', 'qr_generator')),
  metadata jsonb DEFAULT '{}'::jsonb,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE free_tool_leads DISABLE ROW LEVEL SECURITY;

-- Free Tools: Hosted pages (menu, review, booking)
CREATE TABLE IF NOT EXISTS hosted_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  short_id text UNIQUE NOT NULL,
  tool_type text NOT NULL CHECK (tool_type IN ('pdf_menu', 'review_qr', 'booking_qr')),
  business_name text NOT NULL,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by_email text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_hosted_pages_short_id ON hosted_pages (short_id);

ALTER TABLE hosted_pages DISABLE ROW LEVEL SECURITY;

-- Free Tools: Bookings submitted by customers
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_page_id text NOT NULL REFERENCES hosted_pages(short_id),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  pax integer NOT NULL,
  booking_date date NOT NULL,
  booking_time time NOT NULL,
  special_requests text,
  deposit_confirmed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_bookings_page_id ON bookings (booking_page_id);

ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;

-- Storage bucket for free tools uploads (menu images, TnG QR codes)
INSERT INTO storage.buckets (id, name, public)
VALUES ('free-tools', 'free-tools', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public uploads to free-tools bucket
CREATE POLICY "Allow public uploads to free-tools"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'free-tools');

-- Allow public reads from free-tools bucket
CREATE POLICY "Allow public reads from free-tools"
ON storage.objects FOR SELECT
USING (bucket_id = 'free-tools');
