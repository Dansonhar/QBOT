/*
  # Add Quote Status and Notes Management

  ## Overview
  Enhance the qbot_quote_requests table with status tracking, order numbers, and notes system for better quote management.

  ## Changes

  1. New Columns Added:
    - `status` (text) - Quote status tracking with defined states
    - `order_number` (text) - Sequential order number for easy reference
    - `notes` (jsonb) - Array of note objects with timestamps for communication tracking

  2. Indexes:
    - Index on status column for fast filtering
    - Index on order_number for quick lookups

  3. Function:
    - Auto-generate sequential order numbers in format QR-YYYY-NNN

  ## Status Values
  - new (default) - New submission
  - demo - Demo scheduled
  - quoted - Quotation sent
  - waiting - Waiting for customer response
  - start_work - Project started
  - declined - Declined by customer
  - mia - Customer not responding
*/

-- Add new columns to qbot_quote_requests table
DO $$
BEGIN
  -- Add status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qbot_quote_requests' AND column_name = 'status'
  ) THEN
    ALTER TABLE qbot_quote_requests ADD COLUMN status text DEFAULT 'new';
  END IF;

  -- Add order_number column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qbot_quote_requests' AND column_name = 'order_number'
  ) THEN
    ALTER TABLE qbot_quote_requests ADD COLUMN order_number text;
  END IF;

  -- Add notes column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qbot_quote_requests' AND column_name = 'notes'
  ) THEN
    ALTER TABLE qbot_quote_requests ADD COLUMN notes jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Add check constraint for valid status values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'qbot_quote_requests_status_check'
  ) THEN
    ALTER TABLE qbot_quote_requests
    ADD CONSTRAINT qbot_quote_requests_status_check
    CHECK (status IN ('new', 'demo', 'quoted', 'waiting', 'start_work', 'declined', 'mia'));
  END IF;
END $$;

-- Create sequence for order numbers if it doesn't exist
CREATE SEQUENCE IF NOT EXISTS quote_order_number_seq START 1;

-- Create function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  year_prefix TEXT;
  seq_number TEXT;
BEGIN
  year_prefix := TO_CHAR(CURRENT_DATE, 'YYYY');
  seq_number := LPAD(nextval('quote_order_number_seq')::TEXT, 4, '0');
  RETURN 'QR-' || year_prefix || '-' || seq_number;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate order numbers for new quotes
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS trigger_set_order_number ON qbot_quote_requests;
CREATE TRIGGER trigger_set_order_number
  BEFORE INSERT ON qbot_quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_qbot_quotes_status ON qbot_quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_qbot_quotes_order_number ON qbot_quote_requests(order_number);

-- Update existing rows to have order numbers
DO $$
DECLARE
  quote_record RECORD;
BEGIN
  FOR quote_record IN 
    SELECT id FROM qbot_quote_requests WHERE order_number IS NULL ORDER BY created_at
  LOOP
    UPDATE qbot_quote_requests
    SET order_number = generate_order_number()
    WHERE id = quote_record.id;
  END LOOP;
END $$;

-- Add policy for authenticated users to update quotes
CREATE POLICY "Authenticated users can update quote requests"
  ON qbot_quote_requests
  FOR UPDATE
  TO authenticated
  USING (true);
