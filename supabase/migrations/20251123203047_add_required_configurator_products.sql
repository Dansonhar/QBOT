/*
  # Add Required Products for Configurator

  ## Products Added
  
  1. **QHUB AI** - The main cloud platform (replaces "QHub AI Analytics")
  2. **Payment Merchant** - Payment processing hardware
  3. **QPOS with Cash Drawer** - Combined POS system
  4. **Turnstile** and **Turnstile Slim** - Access control
  5. **Camera** - Renamed to match old data
  
  ## Changes
  - Update existing products to match expected names
  - Add missing hardware products
  - Fix subcategories for proper grouping
*/

-- Update "QHub AI Analytics" to "QHUB AI" with platform subcategory
UPDATE products 
SET name = 'QHUB AI',
    subcategory = 'platform',
    description = 'Complete cloud-based management system with AI insights, live updates, and multi-device control',
    is_mandatory = true,
    sort_order = 1,
    subscription_price = 129.00
WHERE name = 'QHub AI Analytics';

-- Add Payment Merchant if doesn't exist (from old Camera product)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Payment Merchant') THEN
    INSERT INTO products (name, category, subcategory, price, subscription_price, description, sort_order, is_active, is_mandatory)
    VALUES ('Payment Merchant', 'hardware', 'payment', 900, 0, 'Payment gateway integration terminal', 60, true, true);
  ELSE
    UPDATE products SET is_mandatory = true, subcategory = 'payment' WHERE name = 'Payment Merchant';
  END IF;
END $$;

-- Update existing Camera to be named correctly
UPDATE products
SET name = 'Face-ID Camera',
    description = 'Face recognition camera for access control'
WHERE name = 'Camera';

-- Add QPOS with Cash Drawer (combined product from seed data)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE name = 'QPOS with Cash Drawer') THEN
    UPDATE products
    SET description = 'Best for business that requires cash handling or as POS backup',
        price = 9999,
        subscription_price = 69
    WHERE name = 'QPOS with Cash Drawer';
  ELSE
    INSERT INTO products (name, category, subcategory, price, subscription_price, description, sort_order, is_active)
    VALUES ('QPOS with Cash Drawer', 'hardware', 'pos', 9999, 69, 'Best for business that requires cash handling or as POS backup', 24, true);
  END IF;
END $$;

-- Add Turnstile products if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Turnstile') THEN
    INSERT INTO products (name, category, subcategory, price, subscription_price, description, sort_order, is_active)
    VALUES ('Turnstile', 'hardware', 'access', 12000, 0, 'Full height access turnstile for controlled entry', 70, true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Turnstile Slim') THEN
    INSERT INTO products (name, category, subcategory, price, subscription_price, description, sort_order, is_active)
    VALUES ('Turnstile Slim', 'hardware', 'access', 18000, 0, 'Slim design turnstile for modern spaces', 71, true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Turnstile Face-ID Addon') THEN
    INSERT INTO products (name, category, subcategory, price, subscription_price, description, sort_order, is_active)
    VALUES ('Turnstile Face-ID Addon', 'hardware', 'access', 1500, 50, 'Add face recognition capability to turnstiles', 72, true);
  END IF;
END $$;

-- Add Kitchen Display Systems
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM products WHERE name = '13" Kitchen Display System (KDS)') THEN
    INSERT INTO products (name, category, subcategory, price, subscription_price, description, sort_order, is_active)
    VALUES ('13" Kitchen Display System (KDS)', 'hardware', 'kitchen', 2300, 0, 'Kitchen display for F&B operations', 30, true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM products WHERE name = '21" Kitchen Display System (KDS)') THEN
    INSERT INTO products (name, category, subcategory, price, subscription_price, description, sort_order, is_active)
    VALUES ('21" Kitchen Display System (KDS)', 'hardware', 'kitchen', 2800, 0, 'Larger kitchen display for busy kitchens', 31, true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM products WHERE name = '55" Queue Display System') THEN
    INSERT INTO products (name, category, subcategory, price, subscription_price, description, sort_order, is_active)
    VALUES ('55" Queue Display System', 'hardware', 'display', 2800, 0, 'Large queue display for customer visibility', 32, true);
  END IF;
END $$;

-- Add Tablet products
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Tablet Sunmi CPad 11" (4+64)') THEN
    INSERT INTO products (name, category, subcategory, price, subscription_price, description, sort_order, is_active)
    VALUES ('Tablet Sunmi CPad 11" (4+64)', 'hardware', 'tablet', 1374, 0, 'Sunmi tablet 11 inch with 4GB RAM', 40, true);
  END IF;
END $$;

-- Add Retail products
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Grocery Stand Deck') THEN
    INSERT INTO products (name, category, subcategory, price, subscription_price, description, sort_order, is_active)
    VALUES ('Grocery Stand Deck', 'hardware', 'retail', 1200, 0, 'Display stand for grocery/retail items', 80, true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Wristband Printer') THEN
    INSERT INTO products (name, category, subcategory, price, subscription_price, description, sort_order, is_active)
    VALUES ('Wristband Printer', 'hardware', 'wristband', 999, 0, 'Print wristbands for events/gyms/themeparks', 81, true);
  END IF;
END $$;
