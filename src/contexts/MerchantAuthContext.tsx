import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { Merchant } from '../types/merchant';
import type { User } from '@supabase/supabase-js';

interface MerchantAuthContextType {
  user: User | null;
  merchant: Merchant | null;
  isLoading: boolean;
  signUp: (email: string, password: string, profile: { business_name: string; phone: string; whatsapp_number: string; logo_url?: string }) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateMerchant: (updates: Partial<Pick<Merchant, 'business_name' | 'phone' | 'whatsapp_number' | 'logo_url'>>) => Promise<{ error: string | null }>;
}

const MerchantAuthContext = createContext<MerchantAuthContextType | undefined>(undefined);

export function MerchantAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchMerchant(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchMerchant(session.user.id);
      } else {
        setMerchant(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchMerchant = async (userId: string) => {
    const { data, error } = await supabase
      .from('merchants')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (!error && data) {
      setMerchant(data as Merchant);
    }
    setIsLoading(false);
  };

  const signUp = async (
    email: string,
    password: string,
    profile: { business_name: string; phone: string; whatsapp_number: string; logo_url?: string }
  ): Promise<{ error: string | null }> => {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) return { error: error.message };
    if (!data.user) return { error: 'Sign up failed. Please try again.' };

    // Create merchant profile
    const { error: profileError } = await supabase.from('merchants').insert({
      id: data.user.id,
      email,
      business_name: profile.business_name,
      phone: profile.phone,
      whatsapp_number: profile.whatsapp_number,
      logo_url: profile.logo_url || null,
    });

    if (profileError) return { error: profileError.message };

    return { error: null };
  };

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setMerchant(null);
  };

  const updateMerchant = async (
    updates: Partial<Pick<Merchant, 'business_name' | 'phone' | 'whatsapp_number' | 'logo_url'>>
  ): Promise<{ error: string | null }> => {
    if (!user) return { error: 'Not authenticated' };

    const { error } = await supabase
      .from('merchants')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (error) return { error: error.message };

    // Refresh merchant data
    await fetchMerchant(user.id);
    return { error: null };
  };

  return (
    <MerchantAuthContext.Provider value={{ user, merchant, isLoading, signUp, signIn, signOut, updateMerchant }}>
      {children}
    </MerchantAuthContext.Provider>
  );
}

export function useMerchantAuth() {
  const context = useContext(MerchantAuthContext);
  if (context === undefined) {
    throw new Error('useMerchantAuth must be used within a MerchantAuthProvider');
  }
  return context;
}
