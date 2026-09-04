/*
  # Seed Industry Product Presets

  ## Maps products to industries based on the pricing table
  X marks in table indicate default selections for each industry
*/

-- Helper function to map industry and product by name
DO $$
DECLARE
  v_industry_id uuid;
  v_product_id uuid;
BEGIN
  -- F&B Industry
  SELECT id INTO v_industry_id FROM industry_types WHERE slug = 'fnb';
  
  INSERT INTO industry_product_presets (industry_id, product_id, is_selected_by_default, default_quantity)
  SELECT v_industry_id, id, true, 1 FROM products WHERE name IN (
    'QHUB AI', 'Q1 Desktop', 'Q1 Stand', 'Q1 Duo',
    '13" Kitchen Display System (KDS)', '21" Kitchen Display System (KDS)',
    '55" Queue Display System', 'Receipt Printer', 'Payment Merchant',
    'Web Store', 'Digital Loyalty', 'Digital Stamp', 'Membership System'
  );

  -- Gym Industry
  SELECT id INTO v_industry_id FROM industry_types WHERE slug = 'gym';
  
  INSERT INTO industry_product_presets (industry_id, product_id, is_selected_by_default, default_quantity)
  SELECT v_industry_id, id, true, 1 FROM products WHERE name IN (
    'QHUB AI', 'Q1 Desktop', 'Q1 Stand', 'Q1 Duo',
    'Receipt Printer', 'Payment Merchant',
    'Turnstile', 'Turnstile Slim', 'Turnstile Face-ID Addon', 'Door Access',
    'Wristband Printer',
    'Web Store', 'Digital Loyalty', 'Digital Stamp', 'Membership System'
  );

  -- Salon Industry  
  SELECT id INTO v_industry_id FROM industry_types WHERE slug = 'salon';
  
  INSERT INTO industry_product_presets (industry_id, product_id, is_selected_by_default, default_quantity)
  SELECT v_industry_id, id, true, 1 FROM products WHERE name IN (
    'QHUB AI', 'Q1 Desktop', 'Q1 Stand', 'Q1 Duo',
    'Receipt Printer', 'Payment Merchant',
    'Appointment/Booking System', 'Web Store', 'Digital Loyalty', 'Digital Stamp', 'Membership System'
  );

  -- Tablet F&B Industry
  SELECT id INTO v_industry_id FROM industry_types WHERE slug = 'tablet-fnb';
  
  INSERT INTO industry_product_presets (industry_id, product_id, is_selected_by_default, default_quantity)
  SELECT v_industry_id, id, true, 1 FROM products WHERE name IN (
    'QHUB AI', 'F&B Tablet', 'Tablet Sunmi CPad 11" (4+64)',
    'Table Tablet Sunmi CPad 11" (4+64)', 'Table - Customized Sunmi CPad 14" (4+64)',
    '13" Kitchen Display System (KDS)', '21" Kitchen Display System (KDS)',
    'Web Store', 'Digital Loyalty', 'Digital Stamp'
  );

  -- Property Management Industry
  SELECT id INTO v_industry_id FROM industry_types WHERE slug = 'property';
  
  INSERT INTO industry_product_presets (industry_id, product_id, is_selected_by_default, default_quantity)
  SELECT v_industry_id, id, true, 1 FROM products WHERE name IN (
    'QHUB AI', 'Q1 Desktop', 'Q1 Stand', 'Q1 Duo',
    'Receipt Printer', 'Payment Merchant',
    'Appointment/Booking System', 'Web Store', 'Digital Loyalty', 'Digital Stamp', 'Membership System'
  );

  -- Court/Sports Facility Industry
  SELECT id INTO v_industry_id FROM industry_types WHERE slug = 'court';
  
  INSERT INTO industry_product_presets (industry_id, product_id, is_selected_by_default, default_quantity)
  SELECT v_industry_id, id, true, 1 FROM products WHERE name IN (
    'QHUB AI', 'Q1 Desktop', 'Q1 Stand', 'Q1 Duo',
    'Receipt Printer', 'Payment Merchant',
    'Appointment/Booking System', 'Web Store', 'Digital Loyalty', 'Digital Stamp', 'Membership System'
  );

  -- Carwash Industry
  SELECT id INTO v_industry_id FROM industry_types WHERE slug = 'carwash';
  
  INSERT INTO industry_product_presets (industry_id, product_id, is_selected_by_default, default_quantity)
  SELECT v_industry_id, id, true, 1 FROM products WHERE name IN (
    'QHUB AI', 'Q1 Desktop', 'Q1 Stand', 'Q1 Duo',
    'Receipt Printer', 'Payment Merchant',
    'Web Store', 'Digital Loyalty', 'Digital Stamp', 'Membership System'
  );

  -- Parking Industry
  SELECT id INTO v_industry_id FROM industry_types WHERE slug = 'parking';
  
  INSERT INTO industry_product_presets (industry_id, product_id, is_selected_by_default, default_quantity)
  SELECT v_industry_id, id, true, 1 FROM products WHERE name IN (
    'QHUB AI', 'Q1 Desktop', 'Q1 Stand', 'Q1 Duo',
    'Receipt Printer', 'Payment Merchant',
    'Web Store', 'Digital Loyalty', 'Digital Stamp', 'Membership System'
  );

  -- Theme Park Industry
  SELECT id INTO v_industry_id FROM industry_types WHERE slug = 'themepark';
  
  INSERT INTO industry_product_presets (industry_id, product_id, is_selected_by_default, default_quantity)
  SELECT v_industry_id, id, true, 1 FROM products WHERE name IN (
    'QHUB AI', 'Q1 Desktop', 'Q1 Stand', 'Q1 Duo',
    'Turnstile', 'Turnstile Slim', 'Turnstile Face-ID Addon',
    'Wristband Printer',
    'Web Store', 'Digital Loyalty', 'Digital Stamp'
  );

  -- Retail/Grocery Industry
  SELECT id INTO v_industry_id FROM industry_types WHERE slug = 'retail';
  
  INSERT INTO industry_product_presets (industry_id, product_id, is_selected_by_default, default_quantity)
  SELECT v_industry_id, id, true, 1 FROM products WHERE name IN (
    'QHUB AI', 'Q1 Desktop', 'Q1 Stand', 'Q1 Duo',
    'Grocery Stand Deck',
    'Grocery System', 'Web Store', 'Digital Loyalty', 'Digital Stamp'
  );

  -- Coworking Industry
  SELECT id INTO v_industry_id FROM industry_types WHERE slug = 'coworking';
  
  INSERT INTO industry_product_presets (industry_id, product_id, is_selected_by_default, default_quantity)
  SELECT v_industry_id, id, true, 1 FROM products WHERE name IN (
    'QHUB AI', 'Q1 Desktop', 'Q1 Stand', 'Q1 Duo',
    'Receipt Printer', 'Payment Merchant',
    'Appointment/Booking System', 'Membership System', 'Web Store', 'Digital Loyalty', 'Digital Stamp'
  );

  -- Hotel Industry
  SELECT id INTO v_industry_id FROM industry_types WHERE slug = 'hotel';
  
  INSERT INTO industry_product_presets (industry_id, product_id, is_selected_by_default, default_quantity)
  SELECT v_industry_id, id, true, 1 FROM products WHERE name IN (
    'QHUB AI', 'Q1 Desktop', 'Q1 Stand', 'Q1 Duo',
    'Receipt Printer', 'Payment Merchant',
    'Membership System', 'Web Store', 'Digital Loyalty', 'Digital Stamp'
  );

END $$;