/*
  # Create QSentry Demo Requests Table

  Captures "Book a Free Demo" leads from the /qsentry landing page.
  Klang Valley anti-tailgater AI camera product. Each row = one gym's demo request.

  1. New Table — `qsentry_demo_requests`
     - `id` (uuid, PK)
     - `gym_name` (text, required)
     - `contact_name` (text, required)
     - `contact_phone` (text, required) — WhatsApp number
     - `area` (text) — gym location / area
     - `demo_type` (text) — 'onsite' (Klang Valley) or 'virtual'
     - `current_system` (text) — what system the gym uses now ('none' / 'saas')
     - `access_gate` (text) — 'turnstile' / 'door' / 'manual'
     - `interests` (jsonb) — array of products they're interested in
     - `est_monthly_loss` (numeric) — calculator snapshot at submission (RM/month)
     - `calc` (jsonb) — full calculator state (tailgaters/day, entry value, days open)
     - `status` (text) — sales pipeline state
     - `admin_notes` (text)
     - `created_at`, `updated_at`

  2. Security — mirrors quotestudio_requests:
     - anon can INSERT (form submission)
     - authenticated can do everything (admin)
     (RLS is disabled globally on this project — policies kept for parity if re-enabled.)
*/

CREATE TABLE IF NOT EXISTS qsentry_demo_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_name text NOT NULL,
  contact_name text NOT NULL,
  contact_phone text NOT NULL,
  area text,
  demo_type text CHECK (demo_type IN ('onsite', 'virtual')),
  current_system text,
  access_gate text,
  interests jsonb NOT NULL DEFAULT '[]'::jsonb,
  est_monthly_loss numeric,
  calc jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'demo_booked', 'won', 'lost', 'spam')),
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE qsentry_demo_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a qsentry demo request"
  ON qsentry_demo_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage qsentry demo requests"
  ON qsentry_demo_requests
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_qsentry_demo_created_at ON qsentry_demo_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_qsentry_demo_status ON qsentry_demo_requests(status);
