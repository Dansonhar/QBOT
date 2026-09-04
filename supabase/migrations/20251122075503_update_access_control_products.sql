/*
  # Update Access Control Products

  1. Changes
    - Update Turnstile price to RM14,500
    - Update Turnstile Slim price to RM17,800
    - Rename "Door Access" to "Face-ID Door Access"
    - Update Wristband Printer price to RM1,800
    
  2. Notes
    - Turnstile Face-ID Addon quantity logic will be handled in frontend
*/

-- Update Turnstile price
UPDATE products 
SET price = 14500.00
WHERE name = 'Turnstile';

-- Update Turnstile Slim price
UPDATE products 
SET price = 17800.00
WHERE name = 'Turnstile Slim';

-- Rename Door Access to Face-ID Door Access
UPDATE products 
SET name = 'Face-ID Door Access'
WHERE name = 'Door Access';

-- Update Wristband Printer price
UPDATE products 
SET price = 1800.00
WHERE name = 'Wristband Printer';