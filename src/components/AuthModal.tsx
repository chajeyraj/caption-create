import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

type Mode = 'login' | 'signup';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** @deprecated pass initialMode instead */
  onSwitchToSignup?: () => void;
  onAuthSuccess?: () => void;
  initialMode?: Mode;
}

export const AuthModal = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'login',
}: AuthModalProps) => {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [slideDir, setSlideDir] = useState<'left' | 'right'>('right');
  const [contentKey, setContentKey] = useState(0);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, signUp } = useAuth();

  // Reset to initialMode whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setEmail('');
      setPassword('');
      setDisplayName('');
      setShowPassword(false);
    }
  }, [isOpen, initialMode]);

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = 'unset'; };
    }
  }, [isOpen]);

  const switchTo = (next: Mode) => {
    setSlideDir(next === 'signup' ? 'left' : 'right');
    setMode(next);
    setContentKey((k) => k + 1);
    setEmail('');
    setPassword('');
    setDisplayName('');
    setShowPassword(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: 'Error', description: 'Please fill in all fields', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      onClose();
      onAuthSuccess?.();
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: error instanceof Error ? error.message : 'Failed to sign in',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: 'Missing Information', description: 'Please provide both email and password', variant: 'destructive' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ title: 'Invalid Email', description: 'Please enter a valid email address', variant: 'destructive' });
      return;
    }
    if (password.length < 8) {
      toast({ title: 'Weak Password', description: 'Password must be at least 8 characters long', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await signUp(email, password, displayName);
      if (error) throw error;

      // When Supabase auto-confirms the email, a session is returned and the user
      // is already signed in. Otherwise they need to confirm via email.
      if (data?.session) {
        toast({ title: 'Welcome!', description: 'Your account is ready.' });
        onClose();
        onAuthSuccess?.();
      } else {
        toast({ title: 'Check your email', description: 'We sent a confirmation link to verify your account.' });
        setTimeout(() => switchTo('login'), 2000);
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'An unexpected error occurred';
      if (!msg.includes('already registered') && !msg.includes('already in use')) {
        toast({ title: 'Signup Failed', description: msg, variant: 'destructive' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || typeof window === 'undefined') return null;

  const slideClass = slideDir === 'left' ? 'animate-slide-from-right' : 'animate-slide-from-left';

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-8 sm:px-6">
      {/* Backdrop — never unmounts during mode switch */}
      <div
        className="fixed inset-0 bg-gradient-to-br from-black/60 to-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal shell — never unmounts during mode switch */}
      <div className="relative z-[10000] w-full max-w-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl text-white backdrop-blur-xl overflow-hidden animate-fade-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-md p-1.5 hover:bg-white/10 transition-colors"
        >
          <X className="h-5 w-5 text-white/80 hover:text-white" />
        </button>

        {/* Sliding content — keyed on mode so it re-mounts and plays the slide animation */}
        <div key={contentKey} className={`p-8 ${slideClass}`}>
          {mode === 'login' ? (
            <>
              <div className="text-center space-y-1 mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Welcome Back
                </h2>
                <p className="text-sm text-white/70">Enter your credentials to access your account</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-white/80 mb-1">Email</label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-cyan-400"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="login-password" className="text-sm font-medium text-white/80">Password</label>
                    <button type="button" className="text-xs text-cyan-400 hover:underline">Forgot password?</button>
                  </div>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="w-full bg-white/5 border border-white/20 text-white placeholder:text-white/40 pr-10 focus-visible:ring-2 focus-visible:ring-cyan-400"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-3 flex items-center text-white/60 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold py-2.5 rounded-lg shadow-md hover:shadow-cyan-500/30 transition-all duration-300"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in…' : 'Sign In'}
                </Button>
              </form>

              <p className="text-center text-sm text-white/70 mt-6">
                Don't have an account?{' '}
                <button type="button" className="font-medium text-cyan-400 hover:underline" onClick={() => switchTo('signup')}>
                  Create one
                </button>
              </p>
            </>
          ) : (
            <>
              <div className="text-center space-y-1 mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Create an Account
                </h2>
                <p className="text-sm text-white/70">Enter your details to get started</p>
              </div>

              <form onSubmit={handleSignup} className="space-y-5">
                <div>
                  <label htmlFor="signup-name" className="block text-sm font-medium text-white/80 mb-1">Display Name</label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-cyan-400"
                    autoComplete="name"
                  />
                </div>

                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-white/80 mb-1">Email</label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-cyan-400"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-white/80 mb-1">Password</label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-cyan-400"
                    autoComplete="new-password"
                  />
                  <p className="text-xs text-white/60 mt-1">Must be at least 8 characters</p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold py-2.5 rounded-lg shadow-md hover:shadow-cyan-500/30 transition-all duration-300"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating account…' : 'Create Account'}
                </Button>
              </form>

              <p className="text-center text-sm text-white/70 mt-6">
                Already have an account?{' '}
                <button type="button" className="font-medium text-cyan-400 hover:underline" onClick={() => switchTo('login')}>
                  Sign in
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AuthModal;
