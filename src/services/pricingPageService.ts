import { supabase } from '../lib/supabase';
import type { PricingPageConfig } from '../types/pricingPageConfig';
import { DEFAULT_PRICING_CONFIG } from '../types/pricingPageConfig';

export async function loadActivePricingConfig(): Promise<PricingPageConfig | null> {
  const { data, error } = await supabase
    .from('pricing_page_config')
    .select('config_data, version')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return null;
  return data.config_data as PricingPageConfig;
}

export async function loadActiveConfigWithVersion(): Promise<{ config: PricingPageConfig; version: number } | null> {
  const { data, error } = await supabase
    .from('pricing_page_config')
    .select('config_data, version')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return null;
  return { config: data.config_data as PricingPageConfig, version: data.version };
}

export async function savePricingConfig(
  config: PricingPageConfig,
  createdBy: string,
  notes?: string
): Promise<{ error?: string }> {
  // Get current max version
  const { data: latest } = await supabase
    .from('pricing_page_config')
    .select('version')
    .order('version', { ascending: false })
    .limit(1)
    .single();

  const nextVersion = (latest?.version ?? 0) + 1;

  // Deactivate all current active rows
  const { error: deactivateError } = await supabase
    .from('pricing_page_config')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('is_active', true);

  if (deactivateError) return { error: deactivateError.message };

  // Insert new active row
  const { error: insertError } = await supabase
    .from('pricing_page_config')
    .insert({
      config_data: config,
      version: nextVersion,
      is_active: true,
      created_by: createdBy,
      notes: notes || null,
    });

  if (insertError) return { error: insertError.message };
  return {};
}

export function getDefaultConfig(): PricingPageConfig {
  return structuredClone(DEFAULT_PRICING_CONFIG);
}
