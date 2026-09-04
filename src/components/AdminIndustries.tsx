import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Eye, EyeOff } from 'lucide-react';
import { IndustryType } from '../types/configurator';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminIndustries() {
  const [industries, setIndustries] = useState<IndustryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: '',
    description: '',
    is_active: true,
    sort_order: 0,
  });

  useEffect(() => {
    loadIndustries();
  }, []);

  const loadIndustries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('admin-industries', {
        body: { action: 'list' },
      });
      if (error) throw error;
      setIndustries(data || []);
    } catch (error) {
      console.error('Error loading industries:', error);
      alert('Failed to load industries');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (industry: IndustryType) => {
    setEditingId(industry.id);
    setFormData({
      name: industry.name,
      slug: industry.slug,
      icon: industry.icon || '',
      description: industry.description || '',
      is_active: industry.is_active,
      sort_order: industry.sort_order,
    });
  };

  const handleSave = async (industryId?: string) => {
    try {
      if (industryId) {
        alert('Update functionality requires additional Edge Function endpoint');
        return;
      } else {
        const { error } = await supabase.functions.invoke('admin-industries', {
          body: { action: 'create', ...formData },
        });

        if (error) throw error;
        setShowAddForm(false);
        resetForm();
      }

      await loadIndustries();
      alert('Industry saved successfully!');
    } catch (error) {
      console.error('Error saving industry:', error);
      alert('Failed to save industry');
    }
  };

  const handleDelete = async (industryId: string) => {
    if (!confirm('Are you sure you want to delete this industry? This will also delete all related presets.')) return;

    try {
      const { error } = await supabase.functions.invoke('admin-industries', {
        body: { action: 'delete', id: industryId },
      });

      if (error) throw error;
      await loadIndustries();
      alert('Industry deleted successfully!');
    } catch (error) {
      console.error('Error deleting industry:', error);
      alert('Failed to delete industry');
    }
  };

  const toggleActive = async (industryId: string, currentStatus: boolean) => {
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
      slug: '',
      icon: '',
      description: '',
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
    return <div className="text-center py-12 font-bold uppercase">Loading industries...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black uppercase">Industry Management</h2>
        <button
          onClick={() => {
            setShowAddForm(true);
            resetForm();
          }}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white font-black text-sm uppercase border border-gray-300 hover:bg-white hover:text-black transition-colors"
        >
          <Plus size={18} />
          Add Industry
        </button>
      </div>

      {showAddForm && (
        <div className="bg-gray-50 border border-gray-300 p-6 mb-6">
          <h3 className="text-lg font-black uppercase mb-4">Add New Industry</h3>
          <IndustryForm formData={formData} setFormData={setFormData} />
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => handleSave()}
              className="px-6 py-3 bg-black text-white font-black text-sm uppercase border border-gray-300 hover:bg-white hover:text-black transition-colors"
            >
              <Save size={16} className="inline mr-2" />
              Save Industry
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
        {industries.map((industry) => (
          <div
            key={industry.id}
            className={`border p-6 transition-all ${
              industry.is_active ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50 opacity-60'
            }`}
          >
            {editingId === industry.id ? (
              <>
                <IndustryForm formData={formData} setFormData={setFormData} />
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => handleSave(industry.id)}
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
                    <h3 className="text-lg font-black uppercase">{industry.name}</h3>
                    <span className="text-xs font-bold text-gray-600 uppercase">
                      Slug: {industry.slug}
                    </span>
                    {industry.icon && (
                      <span className="text-xs font-bold text-gray-600 uppercase">
                        Icon: {industry.icon}
                      </span>
                    )}
                  </div>

                  {industry.description && (
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                      {industry.description}
                    </p>
                  )}

                  <div className="text-sm">
                    <span className="font-bold text-gray-600 uppercase text-xs">Sort Order: </span>
                    <span className="font-black">{industry.sort_order}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(industry.id, industry.is_active)}
                    className="p-2 border border-gray-300 hover:bg-gray-100 transition-colors"
                    title={industry.is_active ? 'Deactivate' : 'Activate'}
                  >
                    {industry.is_active ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <button
                    onClick={() => handleEdit(industry)}
                    className="p-2 border border-gray-300 hover:bg-gray-100 transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(industry.id)}
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

function IndustryForm({
  formData,
  setFormData,
}: {
  formData: any;
  setFormData: (data: any) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-black uppercase mb-2">Industry Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full border border-gray-300 p-3 text-sm font-bold focus:outline-none focus:border-gray-400"
          placeholder="Enter industry name"
        />
      </div>

      <div>
        <label className="block text-xs font-black uppercase mb-2">Slug</label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) =>
            setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })
          }
          className="w-full border border-gray-300 p-3 text-sm font-bold focus:outline-none focus:border-gray-400"
          placeholder="e.g., fnb, gym, hotel"
        />
      </div>

      <div>
        <label className="block text-xs font-black uppercase mb-2">Icon Name</label>
        <input
          type="text"
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          className="w-full border border-gray-300 p-3 text-sm font-bold focus:outline-none focus:border-gray-400"
          placeholder="e.g., UtensilsCrossed, Dumbbell"
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

      <div className="col-span-2">
        <label className="block text-xs font-black uppercase mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full border border-gray-300 p-3 text-sm font-bold focus:outline-none focus:border-gray-400"
          rows={3}
          placeholder="Industry description"
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
