import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { getPublicMenu } from '../../../services/waorderService';
import { CartProvider, useCart } from '../../../contexts/CartContext';
import type { WaOrderCategory, WaOrderItem } from '../../../types/waorder';
import type { Merchant } from '../../../types/merchant';
import CategoryTabs from './CategoryTabs';
import MenuItemCard from './MenuItemCard';
import CartBar from './CartBar';
import CartDrawer from './CartDrawer';

interface Props {
  config: Record<string, unknown>;
  businessName: string;
}

function WaOrderCustomerViewInner({ config, businessName }: Props) {
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [categories, setCategories] = useState<WaOrderCategory[]>([]);
  const [items, setItems] = useState<WaOrderItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    async function load() {
      const merchantId = config.merchant_id as string;
      if (!merchantId) { setLoading(false); return; }

      try {
        const [menuData, merchantResult] = await Promise.all([
          getPublicMenu(merchantId),
          supabase.from('merchants').select('*').eq('id', merchantId).maybeSingle(),
        ]);

        setCategories(menuData.categories);
        setItems(menuData.items);
        setMerchant(merchantResult.data as Merchant | null);

        if (menuData.categories.length > 0) {
          setSelectedCategoryId(menuData.categories[0].id);
        }
      } catch (err) {
        console.error('Failed to load menu:', err);
      }
      setLoading(false);
    }
    load();
  }, [config]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  const whatsappNumber = merchant?.whatsapp_number || '';

  // Empty menu state
  if (categories.length === 0 || items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="p-6 text-center flex-1 flex flex-col items-center justify-center">
          {merchant?.logo_url && (
            <img src={merchant.logo_url} alt="" className="w-16 h-16 object-contain mb-4" />
          )}
          <h1 className="text-xl font-black uppercase tracking-tight">{businessName}</h1>
          <p className="text-sm text-gray-400 mt-2">Menu coming soon</p>
        </div>
        <PoweredBy />
      </div>
    );
  }

  const filteredItems = selectedCategoryId
    ? items.filter(i => i.category_id === selectedCategoryId)
    : items;

  // Check if selected category has items
  const selectedCatHasItems = filteredItems.length > 0;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 text-center border-b border-gray-100">
        {merchant?.logo_url && (
          <img src={merchant.logo_url} alt="" className="w-12 h-12 object-contain mx-auto mb-2" />
        )}
        <h1 className="text-lg font-black uppercase tracking-tight">{businessName}</h1>
      </div>

      {/* Category tabs */}
      <div className="px-4">
        <CategoryTabs
          categories={categories}
          selectedId={selectedCategoryId}
          onSelect={setSelectedCategoryId}
        />
      </div>

      {/* Items */}
      <div className="flex-1 px-4 pb-20">
        {selectedCatHasItems ? (
          filteredItems.map(item => (
            <MenuItemCard key={item.id} item={item} />
          ))
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">No items available in this category.</p>
        )}
      </div>

      {/* Cart bar */}
      <CartBar onOpen={() => setCartOpen(true)} />

      {/* Cart drawer */}
      {cartOpen && (
        <CartDrawer
          businessName={businessName}
          whatsappNumber={whatsappNumber}
          onClose={() => setCartOpen(false)}
        />
      )}

      {/* Powered by */}
      {totalItems === 0 && <PoweredBy />}
    </div>
  );
}

function PoweredBy() {
  return (
    <div className="py-4 text-center">
      <a
        href="https://qbot.now"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[10px] font-bold uppercase tracking-wider text-gray-300 hover:text-gray-500"
      >
        Powered by QPOS
      </a>
    </div>
  );
}

export default function WaOrderCustomerView(props: Props) {
  return (
    <CartProvider>
      <WaOrderCustomerViewInner {...props} />
    </CartProvider>
  );
}
