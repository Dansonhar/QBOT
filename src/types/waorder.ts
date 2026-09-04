export interface WaOrderCategory {
  id: string;
  merchant_id: string;
  name: string;
  sort_order: number;
  created_at: string;
}

export interface WaOrderItem {
  id: string;
  category_id: string;
  merchant_id: string;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
  is_available: boolean;
  sort_order: number;
  created_at: string;
}

export interface CartItem {
  item: WaOrderItem;
  quantity: number;
}
