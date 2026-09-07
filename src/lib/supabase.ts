import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** False when the deploy is missing its Supabase env vars. */
export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

if (!hasSupabaseConfig) {
  console.warn(
    '[QBot] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set. ' +
    'Supabase-backed features are disabled; the rest of the site still renders.',
  );
}

/**
 * createClient() throws "supabaseUrl is required." on an empty URL. Because
 * every call site builds its client at module scope, that throw happened during
 * import and took down the entire app — a blank white page on every route, not
 * just the ones that talk to Supabase.
 *
 * Falling back to a syntactically valid placeholder keeps the module graph
 * intact. Individual requests fail, which is recoverable; a blank site is not.
 */
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
);
