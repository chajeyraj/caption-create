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
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userProfile, setUserProfile] = useState<{ name: string | null; email: string; display_name?: string | null } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check admin status and fetch profile when user logs in
        if (session?.user) {
          setTimeout(async () => {
            // Fetch user data from users table for admin status
            const { data: userData } = await supabase
              .from('users')
              .select('is_admin, email')
              .eq('id', session.user.id)
              .single();
              
            // Fetch display_name from profiles table
            const { data: profileData } = await supabase
              .from('profiles')
              .select('display_name, email')
              .eq('user_id', session.user.id)
              .single();
              
            setIsAdmin(userData?.is_admin || false);
            setUserProfile({
              name: profileData?.display_name || null,
              display_name: profileData?.display_name || null,
              email: userData?.email || session.user.email || ''
            });
          }, 0);
        } else {
          setIsAdmin(false);
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        // Fetch user data from users table for admin status
        const { data: userData } = await supabase
          .from('users')
          .select('email')
          .eq('id', session.user.id)
          .single();
          
        // Fetch display_name from profiles table
        const { data: profileData } = await supabase
          .from('profiles')
          .select('display_name, email')
          .eq('user_id', session.user.id)
          .single();
          
        setUserProfile({
          name: profileData?.display_name || null,
          display_name: profileData?.display_name || null,
          email: userData?.email || session.user.email || ''
        });
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      });

      if (signUpError) {
        toast({
          title: "Sign Up Error",
          description: signUpError.message,
          variant: "destructive"
        });
        return { error: signUpError };
      }

      // Create a profile entry if user was created
      if (authData?.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            user_id: authData.user.id,
            display_name: displayName || null,
            email: email,
            updated_at: new Date().toISOString(),
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
          toast({
            title: "Error",
            description: "Account created, but there was an error saving your profile.",
            variant: "destructive"
          });
          return { error: profileError };
        }
      }

      toast({
        title: "Success!",
        description: "Please check your email to confirm your account.",
      });

      return { data: authData, error: null };
    } catch (error: any) {
      console.error('Error during sign up:', error);
      toast({
        title: "Sign Up Error",
        description: error.message || 'An unexpected error occurred',
        variant: "destructive"
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Sign In Error",
        description: error.message,
        variant: "destructive"
      });
    }

    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out."
    });
    
    // Redirect to home page after sign out
    const navigate = useNavigate();
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      userProfile,
      signUp,
      signIn,
      signOut,
      isAdmin
    }}>
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