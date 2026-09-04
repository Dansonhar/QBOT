import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, LogOut, Loader2, AlertTriangle } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { nanoid } from 'nanoid';
import { useMerchantAuth } from '../../../contexts/MerchantAuthContext';
import { supabase } from '../../../lib/supabase';
import * as svc from '../../../services/waorderService';
import type { WaOrderCategory, WaOrderItem } from '../../../types/waorder';
import CategoryListItem from '../../../components/waorder/CategoryList';
import CategoryForm from '../../../components/waorder/CategoryForm';
import ItemCard from '../../../components/waorder/ItemCard';
import ItemForm from '../../../components/waorder/ItemForm';
import QRSection from '../../../components/waorder/QRSection';
import SEOHead from '../../../components/SEOHead';

const MAX_CATEGORIES = 10;
const MAX_ITEMS = 50;

export default function WaOrderDashboardPage() {
  const { merchant, signOut } = useMerchantAuth();
  const [categories, setCategories] = useState<WaOrderCategory[]>([]);
  const [items, setItems] = useState<WaOrderItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<WaOrderCategory | null>(null);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<WaOrderItem | null>(null);
  const [shortId, setShortId] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // Initial load only — runs once
  const loadData = useCallback(async () => {
    if (!merchant) return;
    try {
      const [cats, itms, { data: hosted }] = await Promise.all([
        svc.getCategories(merchant.id),
        svc.getItems(merchant.id),
        supabase
          .from('hosted_pages')
          .select('short_id')
          .eq('merchant_id', merchant.id)
          .eq('tool_type', 'wa_order')
          .maybeSingle(),
      ]);
      setCategories(cats);
      setItems(itms);
      if (cats.length > 0) setSelectedCategoryId(cats[0].id);
      if (hosted) setShortId(hosted.short_id);
    } catch (err) {
      console.error('Failed to load menu:', err);
    }
    setLoading(false);
  }, [merchant]);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Category handlers ──────────────────────────────────

  const handleAddCategory = async (name: string) => {
    if (!merchant) return;
    const created = await svc.createCategory(merchant.id, name, categories.length);
    setCategories(prev => [...prev, created]);
    if (!selectedCategoryId) setSelectedCategoryId(created.id);
    setShowCategoryForm(false);
  };

  const handleEditCategory = async (name: string) => {
    if (!editingCategory) return;
    await svc.updateCategory(editingCategory.id, name);
    setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, name } : c));
    setEditingCategory(null);
  };

  const handleDeleteCategory = async (id: string) => {
    const catItems = items.filter(i => i.category_id === id);
    const msg = catItems.length > 0
      ? `This will delete the category and its ${catItems.length} item(s). Are you sure?`
      : 'Delete this category?';
    if (!confirm(msg)) return;
    await svc.deleteCategory(id);
    setCategories(prev => prev.filter(c => c.id !== id));
    setItems(prev => prev.filter(i => i.category_id !== id));
    if (selectedCategoryId === id) {
      setSelectedCategoryId(prev => {
        const remaining = categories.filter(c => c.id !== id);
        return remaining.length > 0 ? remaining[0].id : null;
      });
    }
  };

  const handleCategoryDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = categories.findIndex(c => c.id === active.id);
    const newIndex = categories.findIndex(c => c.id === over.id);
    const reordered = arrayMove(categories, oldIndex, newIndex);
    setCategories(reordered);
    await svc.reorderCategories(reordered.map((c, i) => ({ id: c.id, sort_order: i })));
  };

  // ── Item handlers ──────────────────────────────────

  const categoryItems = items.filter(i => i.category_id === selectedCategoryId).sort((a, b) => a.sort_order - b.sort_order);

  const handleAddItem = async (item: { name: string; price: number; description: string; image_url: string | null }) => {
    if (!merchant || !selectedCategoryId) return;
    const created = await svc.createItem(merchant.id, selectedCategoryId, {
      name: item.name,
      price: item.price,
      description: item.description || undefined,
      image_url: item.image_url || undefined,
      sort_order: categoryItems.length,
    });
    setItems(prev => [...prev, created]);
    setShowItemForm(false);
  };

  const handleEditItem = async (item: { name: string; price: number; description: string; image_url: string | null }) => {
    if (!editingItem) return;
    await svc.updateItem(editingItem.id, {
      name: item.name,
      price: item.price,
      description: item.description || undefined,
      image_url: item.image_url,
    });
    setItems(prev => prev.map(i => i.id === editingItem.id ? { ...i, name: item.name, price: item.price, description: item.description || null, image_url: item.image_url } : i));
    setEditingItem(null);
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    await svc.deleteItem(id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleToggleAvailability = async (item: WaOrderItem) => {
    const newVal = !item.is_available;
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_available: newVal } : i));
    await svc.updateItem(item.id, { is_available: newVal });
  };

  const handleItemDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = categoryItems.findIndex(i => i.id === active.id);
    const newIndex = categoryItems.findIndex(i => i.id === over.id);
    const reordered = arrayMove(categoryItems, oldIndex, newIndex);
    setItems(prev => {
      const other = prev.filter(i => i.category_id !== selectedCategoryId);
      return [...other, ...reordered.map((item, idx) => ({ ...item, sort_order: idx }))];
    });
    await svc.reorderItems(reordered.map((i, idx) => ({ id: i.id, sort_order: idx })));
  };

  // ── Publish ──────────────────────────────────

  const handlePublish = async () => {
    if (!merchant) return;
    setPublishing(true);
    try {
      if (shortId) {
        // Already published — just update config timestamp
        await supabase
          .from('hosted_pages')
          .update({ config: { merchant_id: merchant.id, updated_at: new Date().toISOString() } })
          .eq('short_id', shortId);
      } else {
        const newShortId = nanoid(8);
        await supabase.from('hosted_pages').insert({
          short_id: newShortId,
          tool_type: 'wa_order',
          business_name: merchant.business_name,
          merchant_id: merchant.id,
          config: { merchant_id: merchant.id },
        });
        setShortId(newShortId);
      }
    } catch (err) {
      console.error('Publish failed:', err);
    }
    setPublishing(false);
  };

  // ── Render ──────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  const totalItems = items.length;
  const canAddCategory = categories.length < MAX_CATEGORIES;
  const canAddItem = totalItems < MAX_ITEMS;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <SEOHead title="Dashboard — WhatsApp Order" description="Manage your WhatsApp ordering menu." noindex />
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link to="/tools/wa-order" className="text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-black">
            &larr; Back
          </Link>
          <h1 className="text-2xl font-black uppercase tracking-tight mt-1">Menu Builder</h1>
          <p className="text-sm text-gray-500">{merchant?.business_name}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePublish}
            disabled={publishing || categories.length === 0}
            className="px-4 py-2 bg-green-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-green-500 disabled:opacity-30"
          >
            {publishing ? 'Publishing...' : shortId ? 'Update' : 'Publish Menu'}
          </button>
          <button onClick={signOut} className="p-2 hover:bg-gray-100" title="Sign out">
            <LogOut className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Categories sidebar */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">Categories</h2>
            <span className="text-[10px] text-gray-400">{categories.length}/{MAX_CATEGORIES}</span>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCategoryDragEnd}>
            <SortableContext items={categories.map(c => c.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-1">
                {categories.map(cat => (
                  <CategoryListItem
                    key={cat.id}
                    category={cat}
                    isSelected={cat.id === selectedCategoryId}
                    itemCount={items.filter(i => i.category_id === cat.id).length}
                    onSelect={() => setSelectedCategoryId(cat.id)}
                    onEdit={() => setEditingCategory(cat)}
                    onDelete={() => handleDeleteCategory(cat.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {canAddCategory ? (
            <button
              onClick={() => setShowCategoryForm(true)}
              className="flex items-center gap-1.5 w-full px-3 py-2 border border-dashed border-gray-300 text-xs font-bold uppercase tracking-wider text-gray-400 hover:border-black hover:text-black"
            >
              <Plus className="w-3.5 h-3.5" /> Add Category
            </button>
          ) : (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 text-xs text-amber-700">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>Max {MAX_CATEGORIES} categories. <a href="/products/webstore" className="underline font-bold">Upgrade to QPos</a> for unlimited.</span>
            </div>
          )}

          {/* QR Section */}
          <div className="pt-4 border-t border-gray-200">
            <QRSection shortId={shortId} />
          </div>
        </div>

        {/* Items panel */}
        <div className="lg:col-span-9">
          {selectedCategoryId ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold">
                  {categories.find(c => c.id === selectedCategoryId)?.name}
                </h2>
                <span className="text-[10px] text-gray-400">{totalItems}/{MAX_ITEMS} total items</span>
              </div>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleItemDragEnd}>
                <SortableContext items={categoryItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {categoryItems.map(item => (
                      <ItemCard
                        key={item.id}
                        item={item}
                        onEdit={() => setEditingItem(item)}
                        onDelete={() => handleDeleteItem(item.id)}
                        onToggleAvailability={() => handleToggleAvailability(item)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {categoryItems.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-8">No items yet. Add your first item below.</p>
              )}

              {canAddItem ? (
                <button
                  onClick={() => { setEditingItem(null); setShowItemForm(true); }}
                  className="flex items-center gap-1.5 w-full px-3 py-2 border border-dashed border-gray-300 text-xs font-bold uppercase tracking-wider text-gray-400 hover:border-black hover:text-black"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Item
                </button>
              ) : (
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 text-xs text-amber-700">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>Max {MAX_ITEMS} items total. <a href="/products/webstore" className="underline font-bold">Upgrade to QPos</a> for unlimited.</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm text-gray-400">
                {categories.length === 0 ? 'Create your first category to start building your menu.' : 'Select a category to manage its items.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCategoryForm && (
        <CategoryForm onSave={handleAddCategory} onClose={() => setShowCategoryForm(false)} />
      )}
      {editingCategory && (
        <CategoryForm initialName={editingCategory.name} onSave={handleEditCategory} onClose={() => setEditingCategory(null)} />
      )}
      {showItemForm && (
        <ItemForm onSave={handleAddItem} onClose={() => setShowItemForm(false)} />
      )}
      {editingItem && (
        <ItemForm initial={editingItem} onSave={handleEditItem} onClose={() => setEditingItem(null)} />
      )}
    </div>
  );
}
