import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mxegpvlqmolaadlfagup.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14ZWdwdmxxbW9sYWFkbGZhZ3VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MDU5NzYsImV4cCI6MjA2ODA4MTk3Nn0.mOZDS4Z19LXTBgEg5hucWz5HHCOeBeyOuxJG6POuDp0";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Export types for easier access
export type Tables = Database['public']['Tables'];
export type Caption = Tables['captions']['Row'] & {
  profiles?: Tables['profiles']['Row'];
  likes_count?: number;
  is_liked?: boolean;
};
export type Like = Tables['likes']['Row'];
export type Profile = Tables['profiles']['Row'];

// Helper function to get the current user's profile
export async function getCurrentUserProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();
    
  return profile;
}