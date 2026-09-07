import type { ReactNode } from 'react';
import { MerchantAuthProvider } from './contexts/MerchantAuthContext';
import MerchantAuthGuard from './components/merchant/MerchantAuthGuard';

/**
 * Auth shell for the /tools/wa-order routes, isolated in its own chunk.
 *
 * MerchantAuthContext imports the Supabase client at module scope, so importing
 * it from App.tsx put @supabase/supabase-js in the main bundle for every
 * visitor. Behind this lazy boundary only merchants pay for it.
 */
export default function MerchantShell({ children, guard = false }: { children: ReactNode; guard?: boolean }) {
  return (
    <MerchantAuthProvider>
      {guard ? <MerchantAuthGuard>{children}</MerchantAuthGuard> : children}
    </MerchantAuthProvider>
  );
}
