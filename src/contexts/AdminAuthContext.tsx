import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';


interface AdminAuthContextType {
  isAdmin: boolean;
  isLoading: boolean;
  adminEmail: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      // Simple session check - no localStorage, just in-memory state
      setIsLoading(false);
    } catch (error) {
      console.error('Error checking admin status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Direct database authentication - no Supabase Auth
      // Check credentials: admin@qbot.now / malaysia
      if (email === 'admin@qbot.now' && password === 'malaysia') {
        // Verify admin exists in database
        const { data, error } = await supabase
          .from('admin_users')
          .select('email')
          .eq('email', email)
          .maybeSingle();

        if (error) {
          console.error('Database error:', error);
          return false;
        }

        if (data) {
          // Update last login
          await supabase
            .from('admin_users')
            .update({ last_login: new Date().toISOString() })
            .eq('email', email);

          setIsAdmin(true);
          setAdminEmail(email);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    // Simple state reset - no auth system to sign out from
    setIsAdmin(false);
    setAdminEmail(null);
  };

  return (
    <AdminAuthContext.Provider value={{ isAdmin, isLoading, adminEmail, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
