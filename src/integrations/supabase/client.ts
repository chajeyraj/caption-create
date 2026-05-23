import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error(
    'Missing Supabase environment variables. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to your .env file.',
  );
}


export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'sb-auth-token',
    },
    global: {
      headers: {
        'X-Client-Info': 'caption-create-web/1.0.0',
      },
    },
    db: {
      schema: 'public',
    },
  }
);


// Export types for easier access
export type Tables = Database['public']['Tables'];
export type Caption = Tables['captions']['Row'] & {
  profiles?: Tables['profiles']['Row'];
  likes_count?: number;
  is_liked?: boolean;
};
export type Like = Tables['likes']['Row'];
export type Profile = Tables['profiles']['Row'];

// Helper function to get the current user's profile with error handling
export async function getCurrentUserProfile() {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return null;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('[Supabase] Error fetching profile:', profileError);
      return null;
    }

    return profile;
  } catch (error) {
    console.error('[Supabase] Unexpected error in getCurrentUserProfile:', error);
    return null;
  }
}
