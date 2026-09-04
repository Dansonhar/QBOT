export interface Merchant {
  id: string;
  email: string;
  business_name: string;
  phone: string | null;
  whatsapp_number: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}
