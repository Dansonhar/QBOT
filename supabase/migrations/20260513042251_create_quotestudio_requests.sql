/*
  # Create QuoteStudio Requests Table

  Customer-submitted Q Studio quote requests from /quotesys/quotestudio.
  Each row is one quote, identified publicly by a random short slug (public_id).

  1. New Table — `quotestudio_requests`
     - `id` (uuid, PK) — internal identifier
     - `public_id` (text, unique) — short random slug used in the hosted URL
     - `contact_name`, `contact_phone` — required customer details
     - `contact_email`, `business_name`, `delivery_address` — optional details
     - `selections` (jsonb) — full builder state (qty map, software tier, delivery zone, waiver, notes)
     - `totals` (jsonb) — computed totals snapshot at submission time
     - `status` — sales pipeline state
     - `admin_notes` — internal notes
     - `created_at`, `updated_at` — timestamps

  2. Indexes — public_id (for view-page lookup), created_at, status

  3. Security — RLS enabled with permissive policies:
     - anon can INSERT (form submission)
     - anon can SELECT (public hosted quote view at /quotesys/quotestudio/q/:public_id)
     - authenticated can do everything (admin)
     Matches the existing qbot_quote_requests pattern.
*/

CREATE TABLE IF NOT EXISTS quotestudio_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id text NOT NULL UNIQUE DEFAULT substr(md5(random()::text || clock_timestamp()::text), 1, 10),
  contact_name text NOT NULL,
  contact_phone text NOT NULL,
  contact_email text,
  business_name text,
  delivery_address text,
  selections jsonb NOT NULL DEFAULT '{}'::jsonb,
  totals jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'won', 'lost', 'spam')),
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE quotestudio_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit studio quotes"
  ON quotestudio_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view a studio quote by public_id"
  ON quotestudio_requests
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can manage all studio quotes"
  ON quotestudio_requests
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_quotestudio_public_id ON quotestudio_requests(public_id);
CREATE INDEX IF NOT EXISTS idx_quotestudio_created_at ON quotestudio_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotestudio_status ON quotestudio_requests(status);
