/*
  # Add After-Sales Products and Update Industry Presets

  1. New Products - After-Sales Category
    - 12 Months Warranty (RM0.00) - default selected
    - Delivery to West Malaysia (RM300.00) - default selected
    - Delivery to East Malaysia (RM500.00)
    - Onsite Installation & Training - West Malaysia only (RM1,500.00)

  2. Changes
    - Add new after-sales subcategory products
    - Update all industry presets to select only Q1 Desktop (not Stand/Duo)
    - Ensure QHUB AI, Digital Receipt, and Payment Merchant are preselected
    - Update Q1 Desktop price to RM8,700.00
*/

-- Add after-sales products
INSERT INTO products (name, category, subcategory, price, subscription_price, sort_order, is_active)
VALUES
  ('12 Months Warranty', 'addon', 'after-sales', 0.00, 0.00, 1, true),
  ('Delivery to West Malaysia', 'addon', 'after-sales', 300.00, 0.00, 2, true),
  ('Delivery to East Malaysia', 'addon', 'after-sales', 500.00, 0.00, 3, true),
  ('Onsite Installation & Training (West Malaysia only)', 'addon', 'after-sales', 1500.00, 0.00, 4, true)
ON CONFLICT DO NOTHING;

-- Update Q1 Desktop price to RM8,700
UPDATE products
SET price = 8700.00
WHERE name = 'Q1 Desktop' AND subcategory = 'kiosk';

-- First, let's get the product IDs we need
DO $$
DECLARE
  v_q1_desktop_id uuid;
  v_q1_stand_id uuid;
  v_q1_duo_id uuid;
  v_qhub_ai_id uuid;
  v_digital_receipt_id uuid;
  v_payment_merchant_id uuid;
  v_warranty_id uuid;
  v_delivery_west_id uuid;
  v_delivery_east_id uuid;
  v_installation_id uuid;
  v_industry record;
BEGIN
  -- Get product IDs
  SELECT id INTO v_q1_desktop_id FROM products WHERE name = 'Q1 Desktop' AND subcategory = 'kiosk';
  SELECT id INTO v_q1_stand_id FROM products WHERE name = 'Q1 Stand' AND subcategory = 'kiosk';
  SELECT id INTO v_q1_duo_id FROM products WHERE name = 'Q1 Duo' AND subcategory = 'kiosk';
  SELECT id INTO v_qhub_ai_id FROM products WHERE name = 'QHUB AI' AND subcategory = 'platform';
  SELECT id INTO v_digital_receipt_id FROM products WHERE name = 'Digital Receipt (QR)' AND subcategory = 'printer';
  SELECT id INTO v_payment_merchant_id FROM products WHERE name = 'Payment Merchant' AND subcategory = 'pos';
  SELECT id INTO v_warranty_id FROM products WHERE name = '12 Months Warranty' AND subcategory = 'after-sales';
  SELECT id INTO v_delivery_west_id FROM products WHERE name = 'Delivery to West Malaysia' AND subcategory = 'after-sales';
  SELECT id INTO v_delivery_east_id FROM products WHERE name = 'Delivery to East Malaysia' AND subcategory = 'after-sales';
  SELECT id INTO v_installation_id FROM products WHERE name = 'Onsite Installation & Training (West Malaysia only)' AND subcategory = 'after-sales';

  -- For each industry, update the presets
  FOR v_industry IN SELECT id FROM industry_types WHERE is_active = true LOOP
    
    -- Remove Q1 Stand and Q1 Duo from preselection
    UPDATE industry_product_presets
    SET is_selected_by_default = false
    WHERE industry_id = v_industry.id
      AND product_id IN (v_q1_stand_id, v_q1_duo_id);

    -- Ensure Q1 Desktop is preselected
    INSERT INTO industry_product_presets (industry_id, product_id, is_selected_by_default, default_quantity)
    VALUES (v_industry.id, v_q1_desktop_id, true, 1)
    ON CONFLICT (industry_id, product_id) 
    DO UPDATE SET is_selected_by_default = true, default_quantity = 1;

    -- Ensure QHUB AI is preselected
    INSERT INTO industry_product_presets (industry_id, product_id, is_selected_by_default, default_quantity)
    VALUES (v_industry.id, v_qhub_ai_id, true, 1)
    ON CONFLICT (industry_id, product_id)
    DO UPDATE SET is_selected_by_default = true, default_quantity = 1;

    -- Ensure Digital Receipt is preselected
    INSERT INTO industry_product_presets (industry_id, product_id, is_selected_by_default, default_quantity)
    VALUES (v_industry.id, v_digital_receipt_id, true, 1)
    ON CONFLICT (industry_id, product_id)
    DO UPDATE SET is_selected_by_default = true, default_quantity = 1;

    -- Ensure Payment Merchant is preselected
    INSERT INTO industry_product_presets (industry_id, product_id, is_selected_by_default, default_quantity)
    VALUES (v_industry.id, v_payment_merchant_id, true, 1)
    ON CONFLICT (industry_id, product_id)
    DO UPDATE SET is_selected_by_default = true, default_quantity = 1;

    -- Add after-sales products with warranty and delivery west preselected
    INSERT INTO industry_product_presets (industry_id, product_id, is_selected_by_default, default_quantity)
    VALUES 
      (v_industry.id, v_warranty_id, true, 1),
      (v_industry.id, v_delivery_west_id, true, 1),
      (v_industry.id, v_delivery_east_id, false, 1),
      (v_industry.id, v_installation_id, false, 1)
    ON CONFLICT (industry_id, product_id) DO NOTHING;

  END LOOP;
END $$;
