-- Add wa_order to tool type constraints and link hosted_pages to merchants

-- Expand hosted_pages tool_type
ALTER TABLE hosted_pages DROP CONSTRAINT IF EXISTS hosted_pages_tool_type_check;
ALTER TABLE hosted_pages ADD CONSTRAINT hosted_pages_tool_type_check
  CHECK (tool_type IN ('pdf_menu', 'review_qr', 'booking_qr', 'qr_redirect', 'menu_qr', 'wa_booking', 'wa_order'));

-- Expand free_tool_leads tool_used
ALTER TABLE free_tool_leads DROP CONSTRAINT IF EXISTS free_tool_leads_tool_used_check;
ALTER TABLE free_tool_leads ADD CONSTRAINT free_tool_leads_tool_used_check
  CHECK (tool_used IN ('pdf_menu', 'review_qr', 'booking_qr', 'qr_generator', 'qr_redirect', 'menu_qr', 'wa_booking', 'wa_order'));

-- Add merchant_id to hosted_pages (nullable — existing tools have no merchant)
ALTER TABLE hosted_pages ADD COLUMN IF NOT EXISTS merchant_id uuid REFERENCES merchants(id) ON DELETE SET NULL;
