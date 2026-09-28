import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fails loudly in dev rather than silently running against nothing
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY — check your .env.local'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Shape of a row from public.users — mirrors the schema, not the old mock User type
export interface SupabaseUserRow {
  id: string;
  phone: string;
  name: string;
  email: string | null;
  role: 'seeker' | 'poster' | 'admin';
  verification_status: 'unverified' | 'pending_verification' | 'verified' | 'rejected';
  national_id_masked: string | null;
  trust_score: number;
  trust_tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

/** Fetch the real profile row for the currently authenticated user. */
export async function fetchCurrentUserProfile(): Promise<SupabaseUserRow | null> {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (error) {
    console.error('Failed to fetch user profile:', error.message);
    return null;
  }
  return data as SupabaseUserRow;
}
