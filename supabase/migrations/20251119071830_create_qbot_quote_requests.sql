/*
  # Create QBot Quote Requests Table

  1. New Tables
    - `qbot_quote_requests`
      - `id` (uuid, primary key) - Unique identifier for each quote request
      - `industry` (text) - Industry type selected by user
      - `kiosk_type` (text) - Type of kiosk selected
      - `answers` (jsonb) - All question answers stored as JSON
      - `email` (text) - User email address
      - `phone` (text) - User phone number with country code
      - `country_code` (text) - Country code for phone number
      - `country` (text) - User country
      - `company_name` (text) - Company name
      - `additional_enquiry` (text) - Additional requests or questions
      - `created_at` (timestamptz) - Timestamp of submission
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `qbot_quote_requests` table
    - Add policy for inserting quote requests (public access for form submission)
    - Add policy for authenticated admins to read all requests
*/

CREATE TABLE IF NOT EXISTS qbot_quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  industry text NOT NULL,
  kiosk_type text,
  answers jsonb DEFAULT '{}'::jsonb,
  email text NOT NULL,
  phone text NOT NULL,
  country_code text NOT NULL,
  country text NOT NULL,
  company_name text NOT NULL,
  additional_enquiry text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE qbot_quote_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit quote requests"
  ON qbot_quote_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read all quote requests"
  ON qbot_quote_requests
  FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_qbot_quotes_created_at ON qbot_quote_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_qbot_quotes_industry ON qbot_quote_requests(industry);
CREATE INDEX IF NOT EXISTS idx_qbot_quotes_email ON qbot_quote_requests(email);