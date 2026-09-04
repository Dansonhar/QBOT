export interface Product {
  id: string;
  name: string;
  category: 'hardware' | 'subscription' | 'addon';
  subcategory: string | null;
  price: number;
  subscription_price: number;
  original_price?: number | null;
  thumbnail_url: string | null;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  exclusive_group?: string | null;
  is_mandatory?: boolean;
}

export interface IndustryType {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface IndustryProductPreset {
  id: string;
  industry_id: string;
  product_id: string;
  is_selected_by_default: boolean;
  default_quantity: number;
}

export interface SelectedProduct {
  product: Product;
  quantity: number;
  isSelected: boolean;
}

export interface ConfiguratorState {
  selectedProducts: Map<string, SelectedProduct>;
  totalHardwareCost: number;
  totalSubscriptionCost: number;
}
