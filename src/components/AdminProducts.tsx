import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Eye, EyeOff } from 'lucide-react';
import { Product } from '../types/configurator';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'hardware' as 'hardware' | 'subscription' | 'addon',
    subcategory: '',
    price: 0,
    subscription_price: 0,
    description: '',
    thumbnail_url: '',
    is_active: true,
    sort_order: 0,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('admin-products');
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
      alert('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      category: product.category,
      subcategory: product.subcategory || '',
      price: product.price,
      subscription_price: product.subscription_price,
      description: product.description || '',
      thumbnail_url: product.thumbnail_url || '',
      is_active: product.is_active,
      sort_order: product.sort_order,
    });
  };

  const handleSave = async (productId?: string) => {
    try {
      if (productId) {
        alert('Update functionality requires additional Edge Function endpoint');
        return;
      } else {
        const { error } = await supabase.functions.invoke('admin-products', {
          body: formData,
        });

        if (error) throw error;
        setShowAddForm(false);
        resetForm();
      }

      await loadProducts();
      alert('Product saved successfully!');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase.functions.invoke('admin-products', {
        method: 'DELETE',
        body: { id: productId },
      });

      if (error) throw error;

      if (error) throw error;
      await loadProducts();
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const toggleActive = async (productId: string, currentStatus: boolean) => {
    try {
      alert('Toggle functionality requires additional Edge Function endpoint');
    } catch (error) {
      console.error('Error toggling active status:', error);
      alert('Failed to update status');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'hardware',
      subcategory: '',
      price: 0,
      subscription_price: 0,
      description: '',
      thumbnail_url: '',
      is_active: true,
      sort_order: 0,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowAddForm(false);
    resetForm();
  };

  if (loading) {
    return <div className="text-center py-12 font-bold uppercase">Loading products...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black uppercase">Product Management</h2>
        <button
          onClick={() => {
            setShowAddForm(true);
            resetForm();
          }}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white font-black text-sm uppercase border border-gray-300 hover:bg-white hover:text-black transition-colors"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {showAddForm && (
        <div className="bg-gray-50 border border-gray-300 p-6 mb-6">
          <h3 className="text-lg font-black uppercase mb-4">Add New Product</h3>
          <ProductForm formData={formData} setFormData={setFormData} />
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => handleSave()}
              className="px-6 py-3 bg-black text-white font-black text-sm uppercase border border-gray-300 hover:bg-white hover:text-black transition-colors"
            >
              <Save size={16} className="inline mr-2" />
              Save Product
            </button>
            <button
              onClick={cancelEdit}
              className="px-6 py-3 bg-white text-black font-black text-sm uppercase border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              <X size={16} className="inline mr-2" />
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className={`border p-6 transition-all ${
              product.is_active ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50 opacity-60'
            }`}
          >
            {editingId === product.id ? (
              <>
                <ProductForm formData={formData} setFormData={setFormData} />
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => handleSave(product.id)}
                    className="px-6 py-3 bg-black text-white font-black text-sm uppercase border border-gray-300 hover:bg-white hover:text-black transition-colors"
                  >
                    <Save size={16} className="inline mr-2" />
                    Save Changes
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-6 py-3 bg-white text-black font-black text-sm uppercase border border-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    <X size={16} className="inline mr-2" />
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-lg font-black uppercase">{product.name}</h3>
                    <span
                      className={`text-xs font-black px-3 py-1 uppercase ${
                        product.category === 'hardware'
                          ? 'bg-blue-100 text-blue-800'
                          : product.category === 'subscription'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {product.category}
                    </span>
                    {product.subcategory && (
                      <span className="text-xs font-bold text-gray-600 uppercase">
                        {product.subcategory}
                      </span>
                    )}
                  </div>

                  {product.description && (
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                      {product.description}
                    </p>
                  )}

                  <div className="flex items-center gap-6 text-sm">
                    {product.price > 0 && (
                      <div>
                        <span className="font-bold text-gray-600 uppercase text-xs">Price: </span>
                        <span className="font-black">RM {product.price.toFixed(2)}</span>
                      </div>
                    )}
                    {product.subscription_price > 0 && (
                      <div>
                        <span className="font-bold text-gray-600 uppercase text-xs">
                          Subscription:{' '}
                        </span>
                        <span className="font-black">RM {product.subscription_price.toFixed(2)}/mo</span>
                      </div>
                    )}
                    <div>
                      <span className="font-bold text-gray-600 uppercase text-xs">Sort: </span>
                      <span className="font-black">{product.sort_order}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(product.id, product.is_active)}
                    className="p-2 border border-gray-300 hover:bg-gray-100 transition-colors"
                    title={product.is_active ? 'Deactivate' : 'Activate'}
                  >
                    {product.is_active ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 border border-gray-300 hover:bg-gray-100 transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 border border-gray-300 hover:bg-red-100 hover:border-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductForm({
  formData,
  setFormData,
}: {
  formData: any;
  setFormData: (data: any) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-black uppercase mb-2">Product Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full border border-gray-300 p-3 text-sm font-bold focus:outline-none focus:border-gray-400"
          placeholder="Enter product name"
        />
      </div>

      <div>
        <label className="block text-xs font-black uppercase mb-2">Category</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full border border-gray-300 p-3 text-sm font-bold focus:outline-none focus:border-gray-400"
        >
          <option value="hardware">Hardware</option>
          <option value="subscription">Subscription</option>
          <option value="addon">Add-on</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-black uppercase mb-2">Subcategory</label>
        <input
          type="text"
          value={formData.subcategory}
          onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
          className="w-full border border-gray-300 p-3 text-sm font-bold focus:outline-none focus:border-gray-400"
          placeholder="e.g., kiosk, pos, printer"
        />
      </div>

      <div>
        <label className="block text-xs font-black uppercase mb-2">Sort Order</label>
        <input
          type="number"
          value={formData.sort_order}
          onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
          className="w-full border border-gray-300 p-3 text-sm font-bold focus:outline-none focus:border-gray-400"
        />
      </div>

      <div>
        <label className="block text-xs font-black uppercase mb-2">Price (RM)</label>
        <input
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
          className="w-full border border-gray-300 p-3 text-sm font-bold focus:outline-none focus:border-gray-400"
        />
      </div>

      <div>
        <label className="block text-xs font-black uppercase mb-2">Subscription Price (RM/mo)</label>
        <input
          type="number"
          step="0.01"
          value={formData.subscription_price}
          onChange={(e) =>
            setFormData({ ...formData, subscription_price: parseFloat(e.target.value) || 0 })
          }
          className="w-full border border-gray-300 p-3 text-sm font-bold focus:outline-none focus:border-gray-400"
        />
      </div>

      <div className="col-span-2">
        <label className="block text-xs font-black uppercase mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full border border-gray-300 p-3 text-sm font-bold focus:outline-none focus:border-gray-400"
          rows={3}
          placeholder="Product description"
        />
      </div>

      <div className="col-span-2">
        <label className="block text-xs font-black uppercase mb-2">Thumbnail URL</label>
        <input
          type="text"
          value={formData.thumbnail_url}
          onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
          className="w-full border border-gray-300 p-3 text-sm font-bold focus:outline-none focus:border-gray-400"
          placeholder="https://..."
        />
      </div>

      <div className="col-span-2">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="w-5 h-5"
          />
          <span className="text-xs font-black uppercase">Active</span>
        </label>
      </div>
    </div>
  );
}
