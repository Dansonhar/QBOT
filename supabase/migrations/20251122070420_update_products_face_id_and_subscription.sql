/*
  # Update Products for Face-ID and Subscriptions

  1. Changes
    - Delete "Additional Kiosk License" (duplicate with QHUB AI multi-units)
    - Rename "Camera" to "Face-ID Camera"
    - Update Face-ID Camera description and price to RM1,200
    - Remove subscription price from Face-ID Camera
    - Add new "Face-ID System" subscription at RM69/month
    
  2. New Products
    - Face-ID System subscription for Face-ID camera software license
*/

-- Delete Additional Kiosk License
DELETE FROM products WHERE name = 'Additional Kiosk License';

-- Update Camera to Face-ID Camera
UPDATE products 
SET 
  name = 'Face-ID Camera',
  description = 'Face-ID camera for entry',
  price = 1200.00,
  subscription_price = 0.00
WHERE name = 'Camera';

-- Add Face-ID System subscription
INSERT INTO products (name, category, subcategory, price, subscription_price, description, sort_order)
VALUES ('Face-ID System', 'subscription', 'subscription', 0, 69.00, 'Software license for Face ID camera', 14)
ON CONFLICT DO NOTHING;