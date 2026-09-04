/*
  # Create Business Information Management Schema

  1. New Tables
    - `business_info`
      - `id` (uuid, primary key)
      - `business_name` (text) - Official business name
      - `phone` (text) - Primary contact phone number
      - `whatsapp_number` (text) - WhatsApp contact number
      - `email` (text) - Business email address
      - `address_line1` (text) - Street address
      - `address_line2` (text) - Additional address info
      - `city` (text) - City name
      - `state` (text) - State/region
      - `postal_code` (text) - Postal code
      - `country` (text) - Country code
      - `latitude` (numeric) - Geographic latitude
      - `longitude` (numeric) - Geographic longitude
      - `website_url` (text) - Official website URL
      - `facebook_url` (text) - Facebook page URL
      - `instagram_url` (text) - Instagram profile URL
      - `tiktok_url` (text) - TikTok profile URL
      - `linkedin_url` (text) - LinkedIn profile URL
      - `business_description` (text) - Brief business description
      - `service_area` (text) - Service coverage area
      - `is_active` (boolean) - Whether this info is currently active
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

    - `operating_hours`
      - `id` (uuid, primary key)
      - `business_info_id` (uuid, foreign key)
      - `day_of_week` (integer) - 0-6 (Sunday to Saturday)
      - `opens_at` (time) - Opening time
      - `closes_at` (time) - Closing time
      - `is_closed` (boolean) - Whether closed on this day
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `special_hours`
      - `id` (uuid, primary key)
      - `business_info_id` (uuid, foreign key)
      - `date` (date) - Specific date for special hours
      - `opens_at` (time) - Opening time (null if closed)
      - `closes_at` (time) - Closing time (null if closed)
      - `is_closed` (boolean) - Whether closed on this date
      - `reason` (text) - Reason for special hours (e.g., "Public Holiday")
      - `created_at` (timestamptz)

  2. Security
    - Tables created without RLS for now (as per existing pattern in project)
    - Future: Can add RLS policies for public read and admin write access
*/

CREATE TABLE IF NOT EXISTS business_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL DEFAULT 'QBot',
  phone text NOT NULL DEFAULT '+60126909189',
  whatsapp_number text NOT NULL DEFAULT '+60126909189',
  email text NOT NULL DEFAULT 'info@qbot.jp',
  address_line1 text NOT NULL DEFAULT 'B3-6-13 SOLARIS DUTAMAS',
  address_line2 text DEFAULT 'JALAN DUTAMAS 1',
  city text NOT NULL DEFAULT 'Kuala Lumpur',
  state text NOT NULL DEFAULT 'Wilayah Persekutuan Kuala Lumpur',
  postal_code text NOT NULL DEFAULT '50480',
  country text NOT NULL DEFAULT 'MY',
  latitude numeric(10, 7) DEFAULT 3.1677,
  longitude numeric(10, 7) DEFAULT 101.6640,
  website_url text DEFAULT 'https://www.qbot.jp',
  facebook_url text DEFAULT 'https://www.facebook.com/qbotmalaysia',
  instagram_url text DEFAULT 'https://www.instagram.com/qbotmalaysia',
  tiktok_url text DEFAULT 'https://www.tiktok.com/@qbotfuture',
  linkedin_url text,
  business_description text DEFAULT 'AI-powered self-service kiosks and business automation solutions for F&B, wellness, gym, and retail industries in Malaysia',
  service_area text DEFAULT 'Nationwide Malaysia',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS operating_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_info_id uuid NOT NULL REFERENCES business_info(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  opens_at time NOT NULL DEFAULT '10:00',
  closes_at time NOT NULL DEFAULT '19:00',
  is_closed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(business_info_id, day_of_week)
);

CREATE TABLE IF NOT EXISTS special_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_info_id uuid NOT NULL REFERENCES business_info(id) ON DELETE CASCADE,
  date date NOT NULL,
  opens_at time,
  closes_at time,
  is_closed boolean DEFAULT false,
  reason text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(business_info_id, date)
);

INSERT INTO business_info (business_name) VALUES ('QBot')
ON CONFLICT DO NOTHING;

DO $$
DECLARE
  business_id uuid;
BEGIN
  SELECT id INTO business_id FROM business_info WHERE is_active = true LIMIT 1;

  IF business_id IS NOT NULL THEN
    FOR i IN 1..5 LOOP
      INSERT INTO operating_hours (business_info_id, day_of_week, opens_at, closes_at, is_closed)
      VALUES (business_id, i, '10:00', '19:00', false)
      ON CONFLICT (business_info_id, day_of_week) DO NOTHING;
    END LOOP;

    INSERT INTO operating_hours (business_info_id, day_of_week, opens_at, closes_at, is_closed)
    VALUES (business_id, 0, '10:00', '19:00', true)
    ON CONFLICT (business_info_id, day_of_week) DO NOTHING;

    INSERT INTO operating_hours (business_info_id, day_of_week, opens_at, closes_at, is_closed)
    VALUES (business_id, 6, '10:00', '19:00', true)
    ON CONFLICT (business_info_id, day_of_week) DO NOTHING;
  END IF;
END $$;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_business_info_updated_at ON business_info;
CREATE TRIGGER update_business_info_updated_at
  BEFORE UPDATE ON business_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_operating_hours_updated_at ON operating_hours;
CREATE TRIGGER update_operating_hours_updated_at
  BEFORE UPDATE ON operating_hours
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();