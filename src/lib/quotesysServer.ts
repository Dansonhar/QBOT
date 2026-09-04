// Shared Supabase persistence layer for QuoteSys and QuoteStudio.
// Three pools, both pages share the SAME tables but disambiguate via `tool`.
//
//   - templates       : saved item-bundle templates (replaces localStorage)
//   - companies       : reusable company / PIC contact directory
//   - customItems     : custom catalog items added once and kept forever
//
// Single shared password gate, so no per-user scoping.

import { supabase } from './supabase';

export type Tool = 'quotesys' | 'quotestudio';

// ─── Templates ───────────────────────────────────────────────────────────────
export interface ServerTemplate<P = unknown> {
  id: string;
  name: string;
  createdAt: number;
  payload: P;
}

export async function fetchTemplates<P>(tool: Tool): Promise<ServerTemplate<P>[]> {
  const { data, error } = await supabase
    .from('quotesys_templates')
    .select('id, name, payload, created_at')
    .eq('tool', tool)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(r => ({
    id: r.id as string,
    name: r.name as string,
    createdAt: new Date(r.created_at as string).getTime(),
    payload: (r.payload ?? {}) as P,
  }));
}

export async function saveTemplate<P>(tool: Tool, name: string, payload: P): Promise<ServerTemplate<P>> {
  const { data, error } = await supabase
    .from('quotesys_templates')
    .insert({ tool, name, payload })
    .select('id, name, payload, created_at')
    .single();
  if (error) throw error;
  return {
    id: data.id as string,
    name: data.name as string,
    createdAt: new Date(data.created_at as string).getTime(),
    payload: (data.payload ?? {}) as P,
  };
}

export async function deleteTemplate(id: string): Promise<void> {
  const { error } = await supabase.from('quotesys_templates').delete().eq('id', id);
  if (error) throw error;
}

// ─── Companies ───────────────────────────────────────────────────────────────
export interface ServerCompany {
  id: string;
  companyName: string;
  picName: string | null;
  picContact: string | null;
  picEmail: string | null;
  deliveryAddress: string | null;
  notes: string | null;
}

export async function fetchCompanies(tool: Tool): Promise<ServerCompany[]> {
  const { data, error } = await supabase
    .from('quotesys_companies')
    .select('id, company_name, pic_name, pic_contact, pic_email, delivery_address, notes')
    .eq('tool', tool)
    .order('company_name', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(r => ({
    id: r.id as string,
    companyName: r.company_name as string,
    picName: (r.pic_name as string | null) ?? null,
    picContact: (r.pic_contact as string | null) ?? null,
    picEmail: (r.pic_email as string | null) ?? null,
    deliveryAddress: (r.delivery_address as string | null) ?? null,
    notes: (r.notes as string | null) ?? null,
  }));
}

export interface UpsertCompanyInput {
  companyName: string;
  picName?: string;
  picContact?: string;
  picEmail?: string;
  deliveryAddress?: string;
  notes?: string;
}

// Upsert by (tool, lower(companyName)) so saving twice for the same company
// updates rather than duplicates.
export async function upsertCompany(tool: Tool, input: UpsertCompanyInput): Promise<ServerCompany> {
  const trimmed = input.companyName.trim();
  if (!trimmed) throw new Error('Company name required');

  const { data: existing } = await supabase
    .from('quotesys_companies')
    .select('id')
    .eq('tool', tool)
    .ilike('company_name', trimmed)
    .maybeSingle();

  const row = {
    tool,
    company_name: trimmed,
    pic_name: input.picName?.trim() || null,
    pic_contact: input.picContact?.trim() || null,
    pic_email: input.picEmail?.trim() || null,
    delivery_address: input.deliveryAddress?.trim() || null,
    notes: input.notes?.trim() || null,
    updated_at: new Date().toISOString(),
  };

  if (existing?.id) {
    const { data, error } = await supabase
      .from('quotesys_companies')
      .update(row)
      .eq('id', existing.id)
      .select('id, company_name, pic_name, pic_contact, pic_email, delivery_address, notes')
      .single();
    if (error) throw error;
    return mapCompany(data);
  }

  const { data, error } = await supabase
    .from('quotesys_companies')
    .insert(row)
    .select('id, company_name, pic_name, pic_contact, pic_email, delivery_address, notes')
    .single();
  if (error) throw error;
  return mapCompany(data);
}

export async function deleteCompany(id: string): Promise<void> {
  const { error } = await supabase.from('quotesys_companies').delete().eq('id', id);
  if (error) throw error;
}

function mapCompany(r: Record<string, unknown>): ServerCompany {
  return {
    id: r.id as string,
    companyName: r.company_name as string,
    picName: (r.pic_name as string | null) ?? null,
    picContact: (r.pic_contact as string | null) ?? null,
    picEmail: (r.pic_email as string | null) ?? null,
    deliveryAddress: (r.delivery_address as string | null) ?? null,
    notes: (r.notes as string | null) ?? null,
  };
}

// ─── Custom catalog items ────────────────────────────────────────────────────
export interface ServerCustomItem {
  id: string;
  title: string;
  description: string | null;
  price: number;
  sst: number;
  itemType: string;
  category: string;
  subcategory: string | null;
}

export async function fetchCustomItems(tool: Tool): Promise<ServerCustomItem[]> {
  const { data, error } = await supabase
    .from('quotesys_custom_items')
    .select('id, title, description, price, sst, item_type, category, subcategory, created_at')
    .eq('tool', tool)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapCustomItem);
}

export interface CustomItemInput {
  title: string;
  description?: string;
  price: number;
  sst: number;
  itemType: string;
  category: string;
  subcategory?: string;
}

export async function insertCustomItem(tool: Tool, input: CustomItemInput): Promise<ServerCustomItem> {
  const { data, error } = await supabase
    .from('quotesys_custom_items')
    .insert({
      tool,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      price: input.price,
      sst: input.sst,
      item_type: input.itemType,
      category: input.category,
      subcategory: input.subcategory?.trim() || null,
    })
    .select('id, title, description, price, sst, item_type, category, subcategory')
    .single();
  if (error) throw error;
  return mapCustomItem(data);
}

export async function updateCustomItem(id: string, input: CustomItemInput): Promise<void> {
  const { error } = await supabase
    .from('quotesys_custom_items')
    .update({
      title: input.title.trim(),
      description: input.description?.trim() || null,
      price: input.price,
      sst: input.sst,
      item_type: input.itemType,
      category: input.category,
      subcategory: input.subcategory?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
  if (error) throw error;
}

function mapCustomItem(r: Record<string, unknown>): ServerCustomItem {
  return {
    id: r.id as string,
    title: r.title as string,
    description: (r.description as string | null) ?? null,
    price: Number(r.price ?? 0),
    sst: Number(r.sst ?? 0),
    itemType: r.item_type as string,
    category: (r.category as string | null) ?? 'custom',
    subcategory: (r.subcategory as string | null) ?? null,
  };
}

export async function deleteCustomItem(id: string): Promise<void> {
  const { error } = await supabase.from('quotesys_custom_items').delete().eq('id', id);
  if (error) throw error;
}
