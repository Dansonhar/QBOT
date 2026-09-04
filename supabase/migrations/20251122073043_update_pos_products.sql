/*
  # Update POS Products

  1. Changes
    - Rename "QPOS with Cash Drawer" to "QPOS"
    - Update QPOS price to RM3,000 and remove subscription price
    - Add new "Cash Drawer" product at RM1,200
    - Add "POS System" subscription at RM69/month
    
  2. New Products
    - Cash Drawer hardware product
    - POS System subscription
*/

-- Update QPOS with Cash Drawer to just QPOS
UPDATE products 
SET 
  name = 'QPOS',
  price = 3000.00,
  subscription_price = 0.00
WHERE name = 'QPOS with Cash Drawer';

-- Add Cash Drawer product
INSERT INTO products (name, category, subcategory, price, subscription_price, description, sort_order)
VALUES ('Cash Drawer', 'hardware', 'pos', 1200.00, 0.00, 'Cash drawer for POS system', 51)
ON CONFLICT DO NOTHING;

-- Add POS System subscription
INSERT INTO products (name, category, subcategory, price, subscription_price, description, sort_order)
VALUES ('POS System', 'subscription', 'subscription', 0, 69.00, 'Software license for POS system', 15)
ON CONFLICT DO NOTHING;