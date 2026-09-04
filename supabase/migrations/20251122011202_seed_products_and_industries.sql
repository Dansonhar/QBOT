/*
  # Seed Products and Industries

  ## Products Data
  Seeds all hardware and subscription products from the pricing table

  ## Industry Data
  Seeds all industry types

  ## Notes
  - Products are organized by category (hardware/subscription)
  - Subcategories group related products
  - Prices from the table image
*/

-- Seed Products (Hardware)
INSERT INTO products (name, category, subcategory, price, subscription_price, description, sort_order) VALUES
-- Cloud Platform
('QHUB AI', 'subscription', 'platform', 0, 129.00, 'Your cloud control center with AI-powered insights', 1),

-- Kiosks
('Q1 Desktop', 'hardware', 'kiosk', 7800.00, 0, 'Compact counter kiosk perfect for tight spaces', 10),
('Q1 Stand', 'hardware', 'kiosk', 8300.00, 0, 'Full-height self-service kiosk built for peak hours', 11),
('Q1 Duo', 'hardware', 'kiosk', 9500.00, 0, 'Dual-screen powerhouse for ultra-fast service', 12),
('Additional Kiosk Same Outlet', 'hardware', 'kiosk', 200.00, 69.00, 'Add more kiosks to same location', 13),

-- POS Systems
('QPOS with Cash Drawer', 'hardware', 'pos', 9999.00, 69.00, 'Best for business requires to accept cash or as backup', 20),

-- Kitchen Display Systems
('13" Kitchen Display System (KDS)', 'hardware', 'kitchen', 2300.00, 0, 'Kitchen display for F&B operations', 30),
('21" Kitchen Display System (KDS)', 'hardware', 'kitchen', 2800.00, 0, 'Larger kitchen display for busy kitchens', 31),
('55" Queue Display System', 'hardware', 'display', 2800.00, 0, 'Large queue display for customer visibility', 32),

-- Tablets
('F&B Tablet', 'hardware', 'tablet', 0, 0, 'Table ordering tablets for restaurants', 40),
('Tablet Sunmi CPad 11" (4+64)', 'hardware', 'tablet', 1374.00, 0, 'Sunmi tablet 11 inch with 4GB RAM', 41),
('Table Tablet Sunmi CPad 11" (4+64)', 'hardware', 'tablet', 1118.00, 0, 'Table ordering Sunmi tablet', 42),
('Table - Customized Sunmi CPad 14" (4+64)', 'hardware', 'tablet', 1937.00, 0, 'Custom large tablet for table ordering', 43),

-- Printers
('Receipt Printer', 'hardware', 'printer', 600.00, 0, 'Thermal receipt printer', 50),
('Kitchen Printer', 'hardware', 'printer', 0, 0, 'Kitchen order printer', 51),

-- Payment & Camera
('Camera', 'hardware', 'camera', 1200.00, 999.00, 'Security and monitoring camera', 60),
('Payment Merchant', 'hardware', 'payment', 900.00, 0, 'Payment gateway integration', 61),

-- Access Control
('Turnstile', 'hardware', 'access', 12000.00, 0, 'Full height access turnstile', 70),
('Turnstile Slim', 'hardware', 'access', 18000.00, 0, 'Slim design turnstile', 71),
('Turnstile Face-ID Addon', 'hardware', 'access', 1500.00, 50.00, 'Face recognition for turnstile', 72),
('Door Access', 'hardware', 'access', 3000.00, 0, 'Electronic door access control', 73),

-- Retail
('Grocery Stand Deck', 'hardware', 'retail', 1200.00, 0, 'Stand for grocery/retail display', 80),
('Wristband Printer', 'hardware', 'wristband', 999.00, 0, 'Print wristbands for events/gyms', 81),

-- Subscription Services
('Web Store', 'subscription', 'ecommerce', 0, 999.00, 'Online ordering and web store', 100),
('Digital Loyalty', 'subscription', 'loyalty', 0, 999.00, 'Customer loyalty program', 101),
('Digital Stamp', 'subscription', 'loyalty', 0, 69.00, 'Digital stamp card system', 102),
('Membership System', 'subscription', 'membership', 0, 999.00, 'Member management system', 103),
('Grocery System', 'subscription', 'retail', 0, 499.00, 'Retail and grocery management', 104),
('Appointment/Booking System', 'subscription', 'booking', 0, 69.00, 'Appointment and booking management', 105)

ON CONFLICT DO NOTHING;

-- Seed Industries
INSERT INTO industry_types (name, slug, icon, description, sort_order) VALUES
('F&B', 'fnb', 'UtensilsCrossed', 'Food & Beverage restaurants and cafes', 1),
('Gym', 'gym', 'Dumbbell', 'Fitness centers and gyms', 2),
('Salon', 'salon', 'Scissors', 'Beauty salons and spas', 3),
('Tablet F&B', 'tablet-fnb', 'Tablet', 'Restaurant table ordering systems', 4),
('Property Management', 'property', 'Building2', 'Property and building management', 5),
('Court', 'court', 'Dumbbell', 'Sports courts and facilities', 6),
('Carwash', 'carwash', 'Car', 'Car wash facilities', 7),
('Parking', 'parking', 'ParkingCircle', 'Parking facilities', 8),
('Theme Park', 'themepark', 'Ticket', 'Theme parks and attractions', 9),
('Retail Grocery', 'retail', 'ShoppingBag', 'Retail and grocery stores', 10),
('Coworking', 'coworking', 'Briefcase', 'Coworking spaces', 11),
('Hotel', 'hotel', 'Building', 'Hotels and accommodations', 12)

ON CONFLICT (slug) DO NOTHING;