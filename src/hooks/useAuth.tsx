import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

type SignUpResultData = Awaited<ReturnType<typeof supabase.auth.signUp>>['data'];
type SignInResultData = Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>['data'];

type AuthOperationResult<T> = {
  data: T | null;
  error: Error | null;
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userProfile: {
    name: string | null;
    display_name?: string | null;
    email: string;
    avatar_url?: string | null;
  } | null;
  signUp: (email: string, password: string, displayName?: string) => Promise<AuthOperationResult<SignUpResultData>>;
  signIn: (email: string, password: string) => Promise<AuthOperationResult<SignInResultData>>;
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
  const [userProfile, setUserProfile] = useState<{ name: string | null; email: string; display_name?: string | null; avatar_url?: string | null } | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleUserProfile = async (user: User) => {
    console.log('[useAuth] handleUserProfile called for user:', user.id, user.email);
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('display_name, email, user_id, avatar_url, created_at, updated_at')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('[useAuth] profile fetch result:', { profileData, profileError });

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

        const userProfileData = {
          name: displayName,
          display_name: displayName,
          email: user.email || ''
        };

        setUserProfile(userProfileData);
        setIsAdmin(false);

        return userProfileData;
      }

      const userProfileData = {
        name: profileData.display_name || null,
        display_name: profileData.display_name || null,
        email: profileData.email || user.email || '',
        avatar_url: profileData.avatar_url || null,
      };

      console.log('[useAuth] userProfile set:', userProfileData);
      setUserProfile(userProfileData);

      const { data: userData } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', user.id)
        .maybeSingle();
      console.log('[useAuth] isAdmin:', userData?.is_admin ?? false);
      setIsAdmin(userData?.is_admin ?? false);

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
    // Get the initial session without relying on detectSessionInUrl
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('[useAuth] getSession:', session?.user?.email ?? 'none');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        // Defer outside getSession callback to avoid internal lock contention
        setTimeout(() => handleUserProfile(session.user).catch(console.error), 0);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('[useAuth] onAuthStateChange:', event, 'user:', session?.user?.email ?? 'none');
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (session?.user) {
          // Defer DB call outside the auth callback to avoid deadlock
          const currentUser = session.user;
          setTimeout(() => handleUserProfile(currentUser).catch(console.error), 0);
        } else {
          console.log('[useAuth] no session — clearing userProfile and isAdmin');
          setUserProfile(null);
          setIsAdmin(false);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, displayName?: string): Promise<AuthOperationResult<SignUpResultData>> => {
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

      // The caller surfaces the success toast so we avoid duplicate toasts.
      return { data: authData, error: null };
    } catch (error: unknown) {
      console.error('Sign up error:', error);
      
      let errorMessage = 'Failed to create account';
      const errorMessageFromError =
        error instanceof Error ? error.message : typeof error === 'string' ? error : null;

      if (errorMessageFromError?.includes('already registered')) {
        errorMessage = 'This email is already registered. Please try logging in instead.';
      } else if (errorMessageFromError) {
        errorMessage = errorMessageFromError;
      }
      
      toast({
        title: 'Sign Up Error',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return { 
        error: error instanceof Error ? error : new Error(errorMessage),
        data: null 
      };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<AuthOperationResult<SignInResultData>> => {
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
    } catch (error: unknown) {
      console.error('Sign in error:', error);
      
      let errorMessage = 'Failed to sign in. Please check your credentials.';
      if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Sign In Error',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return { 
        error: error instanceof Error ? error : new Error(errorMessage),
        data: null 
      };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);

      const { error } = await supabase.auth.signOut({ scope: 'local' });
      if (error) throw error;

      try {
        Object.keys(localStorage)
          .filter((key) => key.startsWith('sb-'))
          .forEach((key) => localStorage.removeItem(key));
      } catch {
        // localStorage cleanup is best-effort
      }

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

    } catch (error: unknown) {
      console.error('Error signing out:', error);

      const errorMessage =
        error instanceof Error ? error.message : 'There was an error signing out. Please try again.';
      toast({
        title: 'Error',
        description: errorMessage,
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
