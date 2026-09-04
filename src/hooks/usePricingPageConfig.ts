import { useState, useEffect } from 'react';
import { loadActivePricingConfig } from '../services/pricingPageService';
import type { PricingPageConfig } from '../types/pricingPageConfig';
import { DEFAULT_PRICING_CONFIG } from '../types/pricingPageConfig';

export function usePricingPageConfig() {
  const [config, setConfig] = useState<PricingPageConfig>(DEFAULT_PRICING_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const dbConfig = await loadActivePricingConfig();
        if (mounted && dbConfig) {
          setConfig(dbConfig);
        }
      } catch (err) {
        console.error('[PricingPage] Failed to load config, using defaults:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return { config, loading };
}
