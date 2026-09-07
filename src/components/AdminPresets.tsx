import { useState, useEffect } from 'react';
import { Save, Eye, Check } from 'lucide-react';
import { IndustryType, Product, IndustryProductPreset } from '../types/configurator';
import { supabase } from '../lib/supabase';


export default function AdminPresets() {
  const [industries, setIndustries] = useState<IndustryType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [presets, setPresets] = useState<Map<string, { selected: boolean; quantity: number }>>(
    new Map()
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedIndustry) {
      loadPresets(selectedIndustry);
    }
  }, [selectedIndustry]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [industriesResult, productsResult] = await Promise.all([
        supabase.functions.invoke('get-industries'),
        supabase.functions.invoke('get-products'),
      ]);

      if (industriesResult.error) throw industriesResult.error;
      if (productsResult.error) throw productsResult.error;

      setIndustries(industriesResult.data || []);
      setProducts(productsResult.data || []);

      if (industriesResult.data && industriesResult.data.length > 0) {
        setSelectedIndustry(industriesResult.data[0].id);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadPresets = async (industryId: string) => {
    try {
      alert('Load presets functionality requires additional Edge Function endpoint');
      const presetsMap = new Map<string, { selected: boolean; quantity: number }>();
      setPresets(presetsMap);
    } catch (error) {
      console.error('Error loading presets:', error);
      alert('Failed to load presets');
    }
  };

  const toggleProduct = (productId: string) => {
    const newPresets = new Map(presets);
    const current = newPresets.get(productId);

    if (current) {
      newPresets.set(productId, { ...current, selected: !current.selected });
    } else {
      newPresets.set(productId, { selected: true, quantity: 1 });
    }

    setPresets(newPresets);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const newPresets = new Map(presets);
    const current = newPresets.get(productId) || { selected: true, quantity: 1 };
    newPresets.set(productId, { ...current, quantity: Math.max(1, quantity) });
    setPresets(newPresets);
  };

  const handleSave = async () => {
    if (!selectedIndustry) return;

    try {
      setSaving(true);

      const presetsToInsert = Array.from(presets.entries())
        .filter(([_, config]) => config.selected)
        .map(([productId, config]) => ({
          industry_id: selectedIndustry,
          product_id: productId,
          is_selected_by_default: true,
          default_quantity: config.quantity,
        }));

      const { error } = await supabase.functions.invoke('admin-presets', {
        body: {
          industry_id: selectedIndustry,
          action: 'save',
          presets: presetsToInsert
        },
      });

      if (error) throw error;

      alert('Presets saved successfully!');
    } catch (error) {
      console.error('Error saving presets:', error);
      alert('Failed to save presets');
    } finally {
      setSaving(false);
    }
  };

  const calculateTotal = () => {
    let hardware = 0;
    let subscription = 0;

    presets.forEach((config, productId) => {
      if (config.selected) {
        const product = products.find((p) => p.id === productId);
        if (product) {
          hardware += product.price * config.quantity;
          subscription += product.subscription_price * config.quantity;
        }
      }
    });

    return { hardware, subscription };
  };

  const groupedProducts = products.reduce((acc, product) => {
    const category = product.category === 'subscription' ? 'Subscriptions' : 'Hardware & Addons';
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  if (loading) {
    return <div className="text-center py-12 font-bold uppercase">Loading...</div>;
  }

  const selectedIndustryData = industries.find((i) => i.id === selectedIndustry);
  const totals = calculateTotal();

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-black uppercase mb-6">Industry Product Presets</h2>
        <p className="text-sm font-bold text-gray-600 uppercase mb-6 leading-relaxed">
          Configure which products are pre-selected for each industry when customers use the
          configurator
        </p>

        <div className="flex items-center gap-4 mb-6">
          <label className="text-sm font-black uppercase">Select Industry:</label>
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="flex-1 border border-gray-300 p-3 font-bold focus:outline-none focus:border-gray-400"
          >
            {industries.map((industry) => (
              <option key={industry.id} value={industry.id}>
                {industry.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-black text-white font-black text-sm uppercase border border-gray-300 hover:bg-white hover:text-black transition-colors disabled:opacity-50"
          >
            <Save size={16} className="inline mr-2" />
            {saving ? 'Saving...' : 'Save Preset Configuration'}
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-6 py-3 bg-white text-black font-black text-sm uppercase border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            <Eye size={16} className="inline mr-2" />
            {showPreview ? 'Hide' : 'Show'} Preview
          </button>
        </div>
      </div>

      {showPreview && (
        <div className="bg-gray-50 border border-gray-300 p-6 mb-8">
          <h3 className="text-lg font-black uppercase mb-4">
            Preview: {selectedIndustryData?.name} Configuration
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-black uppercase text-gray-600 mb-2">Hardware Total:</p>
              <p className="text-2xl font-black">RM {totals.hardware.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase text-gray-600 mb-2">Monthly Subscription:</p>
              <p className="text-2xl font-black">RM {totals.subscription.toFixed(2)}/mo</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-300">
            <p className="text-xs font-black uppercase text-gray-600 mb-2">Selected Products:</p>
            <div className="space-y-1">
              {Array.from(presets.entries())
                .filter(([_, config]) => config.selected)
                .map(([productId, config]) => {
                  const product = products.find((p) => p.id === productId);
                  return (
                    <p key={productId} className="text-sm font-bold">
                      {product?.name} {config.quantity > 1 ? `(x${config.quantity})` : ''}
                    </p>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
          <div key={category}>
            <h3 className="text-lg font-black uppercase mb-4 pb-2 border-b-2 border-gray-300">
              {category}
            </h3>
            <div className="space-y-3">
              {categoryProducts.map((product) => {
                const config = presets.get(product.id) || { selected: false, quantity: 1 };
                return (
                  <div
                    key={product.id}
                    className={`border p-4 transition-all cursor-pointer ${
                      config.selected
                        ? 'border-gray-400 bg-gray-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => toggleProduct(product.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <div
                          className={`w-6 h-6 border-2 flex items-center justify-center transition-all ${
                            config.selected ? 'border-black bg-black' : 'border-gray-300 bg-white'
                          }`}
                        >
                          {config.selected && <Check size={16} strokeWidth={3} className="text-white" />}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-sm uppercase mb-1">{product.name}</h4>
                        {product.description && (
                          <p className="text-xs text-gray-600 mb-2 leading-tight">
                            {product.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 flex-wrap text-xs">
                          {product.price > 0 && (
                            <span className="font-black">RM {product.price.toFixed(2)}</span>
                          )}
                          {product.subscription_price > 0 && (
                            <span className="font-bold text-gray-600">
                              + RM {product.subscription_price.toFixed(2)}/mo
                            </span>
                          )}
                          {product.subcategory && (
                            <span className="font-bold text-gray-600 uppercase">
                              {product.subcategory}
                            </span>
                          )}
                        </div>

                        {config.selected && (
                          <div
                            className="flex items-center gap-2 mt-3"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="text-xs font-black uppercase">Default Quantity:</span>
                            <button
                              onClick={() => updateQuantity(product.id, config.quantity - 1)}
                              className="w-7 h-7 border border-gray-300 flex items-center justify-center hover:bg-gray-100 font-black"
                              disabled={config.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="text-sm font-black w-8 text-center">
                              {config.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(product.id, config.quantity + 1)}
                              className="w-7 h-7 border border-gray-300 flex items-center justify-center hover:bg-gray-100 font-black"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
