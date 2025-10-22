import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userProfile: { 
    name: string | null; 
    display_name?: string | null;
    email: string 
  } | null;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: any; data: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any; data: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userProfile, setUserProfile] = useState<{ name: string | null; email: string; display_name?: string | null } | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Function to handle user profile data
  interface ProfileData {
    display_name: string | null;
    email: string | null;
    user_id: string;
    created_at?: string;
    updated_at?: string;
  }

  const handleUserProfile = async (user: User) => {
    try {
      // Check if profile exists - only select existing columns
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('display_name, email, user_id, created_at, updated_at')
        .eq('user_id', user.id)
        .maybeSingle();

      // If no profile exists or there's an error, create one
      if (!profileData || profileError?.code === 'PGRST116') {
        const displayName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'User';
        const newProfile = {
          user_id: user.id,
          email: user.email || '',
          display_name: displayName,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const { error: createError } = await supabase
          .from('profiles')
          .upsert(newProfile)
          .select()
          .single();

        if (createError) throw createError;

        // Set user profile with the new data
        const userProfileData = {
          name: displayName,
          display_name: displayName,
          email: user.email || ''
        };
        
        setUserProfile(userProfileData);
        setIsAdmin(false); // Default to non-admin
        
        return userProfileData;
      }

      // If we have profile data, update the state
      const userProfileData = {
        name: profileData.display_name || null,
        display_name: profileData.display_name || null,
        email: profileData.email || user.email || ''
      };
      
      setUserProfile(userProfileData);
      setIsAdmin(false); // Default to non-admin until we implement proper admin check

      return userProfileData;
    } catch (error) {
      console.error('Error handling user profile:', error);
      
      // Set default values on error
      const defaultEmail = user?.email || '';
      const defaultProfile = {
        name: null,
        display_name: null,
        email: defaultEmail
      };
      
      setUserProfile(defaultProfile);
      setIsAdmin(false);
      
      return defaultProfile;
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await handleUserProfile(user);
    }
  };

  // Set up auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            await handleUserProfile(session.user);
          } catch (error) {
            console.error('Error in auth state change:', error);
          }
        } else {
          setUserProfile(null);
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    // Initial session check
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await handleUserProfile(session.user);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      setLoading(true);
      
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            display_name: displayName || email.split('@')[0],
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (!authData?.user) {
        throw new Error('No user data returned from signup');
      }

      // Profile will be handled by the auth state change listener
      toast({
        title: 'Success!',
        description: 'Please check your email to confirm your account.',
      });

      return { data: authData, error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      let errorMessage = 'Failed to create account';
      if (error.message.includes('already registered')) {
        errorMessage = 'This email is already registered. Please try logging in instead.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Sign Up Error',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return { 
        error: typeof error === 'object' ? error : new Error(errorMessage),
        data: null 
      };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      if (data?.user) {
        await handleUserProfile(data.user);
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      let errorMessage = 'Failed to sign in. Please check your credentials.';
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Sign In Error',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return { 
        error: typeof error === 'object' ? error : new Error(errorMessage),
        data: null 
      };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      console.log('[Auth] signOut requested');

      // Sign out of current session
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      if (error) throw error;

      // Extra guard: remove any cached Supabase session keys
      try {
        Object.keys(localStorage)
          .filter((key) => key.startsWith('sb-'))
          .forEach((key) => localStorage.removeItem(key));
        console.log('[Auth] Cleared cached Supabase session keys');
      } catch (storageError) {
        console.warn('[Auth] Unable to clear cached supabase keys', storageError);
      }
      console.log('[Auth] Supabase signOut completed');

      // Clear all local auth state
      setUser(null);
      setSession(null);
      setUserProfile(null);
      setIsAdmin(false);

      // Show success message
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });

      // Navigate to home after successful sign out
      navigate('/', { replace: true });

    } catch (error: any) {
      console.error('Error signing out:', error);
      console.log('[Auth] signOut error details:', error);
      toast({
        title: 'Error',
        description: error?.message || 'There was an error signing out. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        session,
        loading,
        userProfile,
        signUp,
        signIn,
        signOut,
        isAdmin,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
