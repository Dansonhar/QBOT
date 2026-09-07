import { AdminAuthProvider } from './contexts/AdminAuthContext';
import AdminPanel from './components/AdminPanel';

/**
 * Admin CMS entry point, isolated in its own chunk.
 *
 * AdminAuthProvider pulls in @supabase/supabase-js, and AdminPanel is a large
 * back-office UI. Keeping both behind a lazy import means public visitors —
 * who can never reach /admincms — no longer download either.
 */
export default function AdminRoute() {
  return (
    <AdminAuthProvider>
      <AdminPanel onBack={() => { window.location.href = '/'; }} />
    </AdminAuthProvider>
  );
}
