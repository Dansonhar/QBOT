/*
  # Add Original Price Field

  ## Changes
  1. Add original_price column to products table
     - For displaying strikethrough prices (e.g., RM1,500 → RM0)
  
  2. Update Digital Receipt with original price
     - Set original_price to 1500.00
*/

-- Add original_price column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'original_price'
  ) THEN
    ALTER TABLE products ADD COLUMN original_price numeric(10,2) DEFAULT NULL;
  END IF;
END $$;

-- Update Digital Receipt with original price
UPDATE products 
SET original_price = 1500.00
WHERE name = 'Digital Receipt (QR)';
