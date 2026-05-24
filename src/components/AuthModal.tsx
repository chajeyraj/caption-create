import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

type Mode = 'login' | 'signup' | 'forgot';

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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, signUp, resetPassword } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setEmail('');
      setPassword('');
      setDisplayName('');
      setShowPassword(false);
    }
  }, [isOpen, initialMode]);

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
    setEmail(''); setPassword(''); setDisplayName(''); setShowPassword(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: 'Error', description: 'Please enter your email address', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await resetPassword(email);
      if (error) throw error;
      toast({ title: 'Email sent', description: 'Check your inbox for a password reset link.' });
      setTimeout(() => switchTo('login'), 2000);
    } catch (error) {
      toast({ title: 'Error', description: error instanceof Error ? error.message : 'Failed to send reset email', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
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
      toast({ title: 'Login Failed', description: error instanceof Error ? error.message : 'Failed to sign in', variant: 'destructive' });
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
      if (data?.session) {
        toast({ title: 'Welcome!', description: 'Your account is ready.' });
        onClose();
        onAuthSuccess?.();
      } else {
        toast({
          title: 'Signup needs auth config update',
          description: 'Disable email confirmations in Supabase Auth so new users are auto-confirmed and logged in.',
          variant: 'destructive',
        });
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

  const inputStyle = {
    background: 'hsl(240, 12%, 13%)',
    border: '1px solid hsl(240, 12%, 22%)',
    color: 'hsl(40, 20%, 88%)',
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-8 sm:px-6">
      {/* Backdrop — spring fade-in */}
      <div
        className="fixed inset-0 animate-spring-backdrop"
        style={{ background: 'hsl(232, 35%, 5% / 0.85)' }}
        onClick={onClose}
      />

      {/* Modal — spring physics entrance */}
      <div
        className="relative z-[10000] w-full max-w-md rounded-2xl overflow-hidden animate-spring-in"
        style={{
          background: 'hsl(235, 20%, 10%)',
          border: '1px solid hsl(240, 12%, 20%)',
          boxShadow: '0 24px 80px hsl(0 0% 0% / 0.6), 0 0 0 1px hsl(38 90% 54% / 0.06)',
        }}
      >
        {/* Amber top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, hsl(38, 90%, 54%), hsl(271, 60%, 65%), transparent)' }}
        />

        {/* Ambient glow inside modal */}
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, hsl(38 90% 54% / 0.07) 0%, transparent 70%)' }}
        />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 h-8 w-8 flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-105"
          style={{ background: 'hsl(40 20% 92% / 0.06)', color: 'hsl(40, 20%, 60%)' }}
        >
          <X className="h-4 w-4" />
        </button>

        {/* Sliding content */}
        <div key={contentKey} className={`p-8 relative z-10 ${slideClass}`}>
          {mode === 'forgot' ? (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl mb-4"
                  style={{ background: 'hsl(38 90% 54% / 0.12)', border: '1px solid hsl(38 90% 54% / 0.2)' }}>
                  <Sparkles className="h-5 w-5" style={{ color: 'hsl(38, 90%, 60%)' }} />
                </div>
                <h2 className="font-display font-bold text-3xl mb-1 text-gradient-amber-violet">
                  Reset Password
                </h2>
                <p className="text-sm" style={{ color: 'hsl(260, 8%, 52%)' }}>
                  We'll send a reset link to your email
                </p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'hsl(40, 20%, 65%)' }}>
                    Email
                  </label>
                  <Input
                    type="email" placeholder="name@example.com"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading} autoComplete="email" autoFocus
                    className="w-full placeholder:text-[hsl(260,8%,38%)] focus-visible:ring-1 focus-visible:ring-[hsl(38,90%,54%)]"
                    style={inputStyle}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, hsl(38, 90%, 54%), hsl(25, 90%, 58%))',
                    color: 'hsl(232, 20%, 7%)',
                    boxShadow: '0 4px 20px hsl(38 90% 54% / 0.3)',
                  }}
                >
                  {isLoading ? 'Sending…' : 'Send Reset Link'}
                </button>
              </form>

              <p className="text-center text-sm mt-6" style={{ color: 'hsl(260, 8%, 50%)' }}>
                <button type="button" className="font-medium hover:underline transition-colors" style={{ color: 'hsl(38, 90%, 60%)' }} onClick={() => switchTo('login')}>
                  Back to sign in
                </button>
              </p>
            </>
          ) : mode === 'login' ? (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl mb-4"
                  style={{ background: 'hsl(38 90% 54% / 0.12)', border: '1px solid hsl(38 90% 54% / 0.2)' }}>
                  <Sparkles className="h-5 w-5" style={{ color: 'hsl(38, 90%, 60%)' }} />
                </div>
                <h2 className="font-display font-bold text-3xl mb-1 text-gradient-amber-violet">
                  Welcome Back
                </h2>
                <p className="text-sm" style={{ color: 'hsl(260, 8%, 52%)' }}>
                  Enter your credentials to continue
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'hsl(40, 20%, 65%)' }}>
                    Email
                  </label>
                  <Input
                    type="email" placeholder="name@example.com"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading} autoComplete="email"
                    className="w-full placeholder:text-[hsl(260,8%,38%)] focus-visible:ring-1 focus-visible:ring-[hsl(38,90%,54%)]"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'hsl(40, 20%, 65%)' }}>
                      Password
                    </label>
                    <button type="button" className="text-xs hover:underline transition-colors" style={{ color: 'hsl(38, 90%, 60%)' }} onClick={() => switchTo('forgot')}>
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading} autoComplete="current-password"
                      className="w-full pr-10 placeholder:text-[hsl(260,8%,38%)] focus-visible:ring-1 focus-visible:ring-[hsl(38,90%,54%)]"
                      style={inputStyle}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-3 flex items-center transition-colors hover:text-foreground"
                      style={{ color: 'hsl(260, 8%, 45%)' }}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, hsl(38, 90%, 54%), hsl(25, 90%, 58%))',
                    color: 'hsl(232, 20%, 7%)',
                    boxShadow: '0 4px 20px hsl(38 90% 54% / 0.3)',
                  }}
                >
                  {isLoading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>

              <p className="text-center text-sm mt-6" style={{ color: 'hsl(260, 8%, 50%)' }}>
                Don't have an account?{' '}
                <button type="button" className="font-medium hover:underline transition-colors" style={{ color: 'hsl(38, 90%, 60%)' }} onClick={() => switchTo('signup')}>
                  Create one
                </button>
              </p>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl mb-4"
                  style={{ background: 'hsl(271 60% 65% / 0.12)', border: '1px solid hsl(271 60% 65% / 0.2)' }}>
                  <Sparkles className="h-5 w-5" style={{ color: 'hsl(271, 60%, 70%)' }} />
                </div>
                <h2 className="font-display font-bold text-3xl mb-1 text-gradient-amber-violet">
                  Create Account
                </h2>
                <p className="text-sm" style={{ color: 'hsl(260, 8%, 52%)' }}>
                  Join thousands of creators today
                </p>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'hsl(40, 20%, 65%)' }}>
                    Display Name
                  </label>
                  <Input
                    type="text" placeholder="John Doe"
                    value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                    disabled={isLoading} autoComplete="name"
                    className="w-full placeholder:text-[hsl(260,8%,38%)] focus-visible:ring-1 focus-visible:ring-[hsl(271,60%,65%)]"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'hsl(40, 20%, 65%)' }}>
                    Email
                  </label>
                  <Input
                    type="email" placeholder="name@example.com"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading} autoComplete="email"
                    className="w-full placeholder:text-[hsl(260,8%,38%)] focus-visible:ring-1 focus-visible:ring-[hsl(271,60%,65%)]"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'hsl(40, 20%, 65%)' }}>
                    Password
                  </label>
                  <Input
                    type="password" placeholder="••••••••"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading} autoComplete="new-password"
                    className="w-full placeholder:text-[hsl(260,8%,38%)] focus-visible:ring-1 focus-visible:ring-[hsl(271,60%,65%)]"
                    style={inputStyle}
                  />
                  <p className="text-xs mt-1" style={{ color: 'hsl(260, 8%, 40%)' }}>Must be at least 8 characters</p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none mt-2"
                  style={{
                    background: 'linear-gradient(135deg, hsl(271, 60%, 58%), hsl(38, 90%, 54%))',
                    color: 'hsl(40, 20%, 95%)',
                    boxShadow: '0 4px 20px hsl(271 60% 58% / 0.25)',
                  }}
                >
                  {isLoading ? 'Creating account…' : 'Create Account'}
                </button>
              </form>

              <p className="text-center text-sm mt-6" style={{ color: 'hsl(260, 8%, 50%)' }}>
                Already have an account?{' '}
                <button type="button" className="font-medium hover:underline transition-colors" style={{ color: 'hsl(38, 90%, 60%)' }} onClick={() => switchTo('login')}>
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
