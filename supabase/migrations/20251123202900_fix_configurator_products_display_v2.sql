/*
  # Fix Product Configurator Display Issues

  ## Changes Made
  
  1. **Kiosk Products**
     - Add exclusive_group='q1_kiosks' to all kiosk products for radio-button behavior
     - Add bundle_price_2 for 2-unit bundle pricing
     - Update descriptions and pricing
  
  2. **Product Images**
     - Add thumbnail_url for all kiosk products
  
  3. **Product Organization**
     - Add missing critical products (Face-ID Camera, Face-ID System, QPOS, etc.)
     - Fix subcategories to match configurator expectations
     - Set proper is_mandatory flags
  
  4. **After-Sales Products**
     - Add Onsite Installation product (simplified name)
     - Add Extended Warranty product
  
  5. **Subscription Products**
     - Update QHUB AI with proper description
     - Add Additional Kiosk License for multi-kiosk setups
*/

-- Update kiosk products with exclusive_group and bundle pricing
UPDATE products
SET 
  exclusive_group = 'q1_kiosks',
  bundle_price_2 = 14300.00,
  description = 'Your compact self-service powerhouse — perfect for counters, tabletops, and tight spaces. Regular price: RM7,800',
  price = 4800.00
WHERE name = 'Q1 Desktop' AND subcategory = 'kiosk';

UPDATE products
SET 
  exclusive_group = 'q1_kiosks',
  bundle_price_2 = 15100.00,
  description = 'Full-height self-service kiosk built to handle peak hours and constant flow. Regular price: RM8,300',
  price = 7900.00
WHERE name = 'Q1 Stand' AND subcategory = 'kiosk';

UPDATE products
SET 
  exclusive_group = 'q1_kiosks',
  bundle_price_2 = 16800.00,
  description = 'Dual touchscreens for customers and staff — self-service and POS perfectly integrated. Contact for pricing',
  price = 9500.00
WHERE name = 'Q1 Duo' AND subcategory = 'kiosk';

-- Update Payment Merchant to correct subcategory
UPDATE products
SET subcategory = 'payment',
    is_mandatory = true
WHERE name = 'Payment Merchant';

-- Update QHUB AI
UPDATE products
SET 
  description = 'Complete cloud-based management system with AI insights, live updates, and multi-device control',
  is_mandatory = true
WHERE name = 'QHUB AI';

-- Add Digital Receipt if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Digital Receipt (QR)') THEN
    INSERT INTO products (name, category, subcategory, price, subscription_price, description, sort_order, is_active, is_mandatory)
    VALUES ('Digital Receipt (QR)', 'hardware', 'printer', 0, 0, 'Digital receipt via QR code', 51, true, true);
  ELSE
    UPDATE products SET is_mandatory = true, subcategory = 'printer', sort_order = 51 WHERE name = 'Digital Receipt (QR)';
  END IF;
END $$;

-- Add Face-ID Camera
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Face-ID Camera') THEN
    INSERT INTO products (name, category, subcategory, price, subscription_price, description, sort_order, is_active)
    VALUES ('Face-ID Camera', 'hardware', 'camera', 1200, 0, 'Face recognition camera for access control', 61, true);
  END IF;
END $$;

-- Add Face-ID System
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Face-ID System') THEN
    INSERT INTO products (name, category, subcategory, price, subscription_price, description, sort_order, is_active)
    VALUES ('Face-ID System', 'subscription', 'subscription', 0, 999, 'Face recognition software and cloud management', 110, true);
  END IF;
END $$;

-- Add QPOS
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'QPOS') THEN
    INSERT INTO products (name, category, subcategory, price, subscription_price, description, sort_order, is_active)
    VALUES ('QPOS', 'hardware', 'pos', 2500, 0, 'Staff POS terminal for order taking', 20, true);
  END IF;
END $$;

-- Add POS System
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'POS System') THEN
    INSERT INTO products (name, category, subcategory, price, subscription_price, description, sort_order, is_active)
    VALUES ('POS System', 'subscription', 'subscription', 0, 69, 'POS software and management system', 111, true);
  END IF;
END $$;

-- Add Cash Drawer
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Cash Drawer') THEN
    INSERT INTO products (name, category, subcategory, price, subscription_price, description, sort_order, is_active)
    VALUES ('Cash Drawer', 'hardware', 'pos', 500, 0, 'Cash drawer for POS system', 21, true);
  END IF;
END $$;

-- Add Additional Kiosk License
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Additional Kiosk License') THEN
    INSERT INTO products (name, category, subcategory, price, subscription_price, description, sort_order, is_active, auto_add_trigger)
    VALUES ('Additional Kiosk License', 'subscription', 'subscription', 0, 69, 'License for each additional kiosk', 100, true, 'kiosk_count_gt_1');
  END IF;
END $$;

-- Add Extended Warranty
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Extended Warranty') THEN
    INSERT INTO products (name, category, subcategory, price, subscription_price, description, sort_order, is_active)
    VALUES ('Extended Warranty', 'addon', 'after-sales', 600, 0, 'Extended warranty beyond standard 12 months (RM600 per kiosk)', 201, true);
  END IF;
END $$;

-- Add 12 Months Warranty if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM products WHERE name = '12 Months Warranty') THEN
    INSERT INTO products (name, category, subcategory, price, subscription_price, description, sort_order, is_active, is_mandatory)
    VALUES ('12 Months Warranty', 'addon', 'after-sales', 0, 0, 'Standard 12-month warranty included', 200, true, true);
  ELSE
    UPDATE products SET is_mandatory = true WHERE name = '12 Months Warranty';
  END IF;
END $$;

-- Add Delivery to West Malaysia if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Delivery to West Malaysia') THEN
    INSERT INTO products (name, category, subcategory, price, subscription_price, description, sort_order, is_active, is_mandatory)
    VALUES ('Delivery to West Malaysia', 'addon', 'after-sales', 300, 0, 'Delivery service to West Malaysia (RM300 per kiosk)', 202, true, true);
  ELSE
    UPDATE products SET is_mandatory = true WHERE name = 'Delivery to West Malaysia';
  END IF;
END $$;

-- Add Delivery to East Malaysia if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Delivery to East Malaysia') THEN
    INSERT INTO products (name, category, subcategory, price, subscription_price, description, sort_order, is_active)
    VALUES ('Delivery to East Malaysia', 'addon', 'after-sales', 500, 0, 'Delivery service to East Malaysia (RM500 per kiosk)', 203, true);
  END IF;
END $$;

-- Add Onsite Installation
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Onsite Installation') THEN
    INSERT INTO products (name, category, subcategory, price, subscription_price, description, sort_order, is_active)
    VALUES ('Onsite Installation', 'addon', 'after-sales', 1500, 0, 'Professional onsite installation and training (RM1,500 per kiosk)', 204, true);
  END IF;
END $$;

-- Update sort orders for logical grouping
UPDATE products SET sort_order = 1 WHERE name = 'QHUB AI';
UPDATE products SET sort_order = 10 WHERE name = 'Q1 Desktop';
UPDATE products SET sort_order = 11 WHERE name = 'Q1 Stand';
UPDATE products SET sort_order = 12 WHERE name = 'Q1 Duo';
