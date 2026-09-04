import { supabase } from '../lib/supabase';
import type { WaOrderCategory, WaOrderItem } from '../types/waorder';

// ── Categories ──────────────────────────────────────────

export async function getCategories(merchantId: string): Promise<WaOrderCategory[]> {
  const { data, error } = await supabase
    .from('waorder_categories')
    .select('*')
    .eq('merchant_id', merchantId)
    .order('sort_order');
  if (error) throw error;
  return data as WaOrderCategory[];
}

export async function createCategory(merchantId: string, name: string, sortOrder: number): Promise<WaOrderCategory> {
  const { data, error } = await supabase
    .from('waorder_categories')
    .insert({ merchant_id: merchantId, name, sort_order: sortOrder })
    .select()
    .single();
  if (error) throw error;
  return data as WaOrderCategory;
}

export async function updateCategory(id: string, name: string): Promise<void> {
  const { error } = await supabase
    .from('waorder_categories')
    .update({ name })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase
    .from('waorder_categories')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function reorderCategories(updates: { id: string; sort_order: number }[]): Promise<void> {
  await Promise.all(
    updates.map(u =>
      supabase.from('waorder_categories').update({ sort_order: u.sort_order }).eq('id', u.id).then(({ error }) => { if (error) throw error; })
    )
  );
}

// ── Items ──────────────────────────────────────────

export async function getItems(merchantId: string): Promise<WaOrderItem[]> {
  const { data, error } = await supabase
    .from('waorder_items')
    .select('*')
    .eq('merchant_id', merchantId)
    .order('sort_order');
  if (error) throw error;
  return data as WaOrderItem[];
}

export async function createItem(
  merchantId: string,
  categoryId: string,
  item: { name: string; price: number; description?: string; image_url?: string; sort_order: number }
): Promise<WaOrderItem> {
  const { data, error } = await supabase
    .from('waorder_items')
    .insert({
      merchant_id: merchantId,
      category_id: categoryId,
      name: item.name,
      price: item.price,
      description: item.description || null,
      image_url: item.image_url || null,
      sort_order: item.sort_order,
    })
    .select()
    .single();
  if (error) throw error;
  return data as WaOrderItem;
}

export async function updateItem(
  id: string,
  updates: Partial<Pick<WaOrderItem, 'name' | 'price' | 'description' | 'image_url' | 'is_available' | 'category_id'>>
): Promise<void> {
  const { error } = await supabase
    .from('waorder_items')
    .update(updates)
    .eq('id', id);
  if (error) throw error;
}

export async function deleteItem(id: string): Promise<void> {
  const { error } = await supabase
    .from('waorder_items')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function reorderItems(updates: { id: string; sort_order: number }[]): Promise<void> {
  await Promise.all(
    updates.map(u =>
      supabase.from('waorder_items').update({ sort_order: u.sort_order }).eq('id', u.id).then(({ error }) => { if (error) throw error; })
    )
  );
}

// ── Public: fetch menu by merchant_id (for customer page) ──────────

export async function getPublicMenu(merchantId: string): Promise<{
  categories: WaOrderCategory[];
  items: WaOrderItem[];
}> {
  const [catResult, itemResult] = await Promise.all([
    supabase
      .from('waorder_categories')
      .select('*')
      .eq('merchant_id', merchantId)
      .order('sort_order'),
    supabase
      .from('waorder_items')
      .select('*')
      .eq('merchant_id', merchantId)
      .eq('is_available', true)
      .order('sort_order'),
  ]);

  if (catResult.error) throw catResult.error;
  if (itemResult.error) throw itemResult.error;

  return {
    categories: catResult.data as WaOrderCategory[],
    items: itemResult.data as WaOrderItem[],
  };
}
