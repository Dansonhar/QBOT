-- Expand tool_type to include new lightweight tools
ALTER TABLE hosted_pages DROP CONSTRAINT IF EXISTS hosted_pages_tool_type_check;
ALTER TABLE hosted_pages ADD CONSTRAINT hosted_pages_tool_type_check
  CHECK (tool_type IN ('pdf_menu', 'review_qr', 'booking_qr', 'qr_redirect', 'menu_qr', 'wa_booking'));

-- Expand lead capture tool_used
ALTER TABLE free_tool_leads DROP CONSTRAINT IF EXISTS free_tool_leads_tool_used_check;
ALTER TABLE free_tool_leads ADD CONSTRAINT free_tool_leads_tool_used_check
  CHECK (tool_used IN ('pdf_menu', 'review_qr', 'booking_qr', 'qr_generator', 'qr_redirect', 'menu_qr', 'wa_booking'));
