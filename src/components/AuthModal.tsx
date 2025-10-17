import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
  onAuthSuccess?: () => void;
}

export const AuthModal = ({
  isOpen,
  onClose,
  onSwitchToSignup,
  onAuthSuccess,
}: AuthModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen || typeof window === 'undefined') return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      onClose();
      if (onAuthSuccess) onAuthSuccess();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to sign in';
      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-8 sm:px-6 backdrop-blur-sm">
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-gradient-to-br from-black/60 to-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal box */}
      <div
        className="relative z-[10000] w-full max-w-md bg-white/10 border border-white/20 
                   rounded-2xl p-8 shadow-2xl text-white backdrop-blur-xl 
                   animate-[fadeIn_0.3s_ease-out] transform transition-all"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1.5 hover:bg-white/10 transition-colors"
        >
          <X className="h-5 w-5 text-white/80 hover:text-white" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1 mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-sm text-white/70">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white/80 mb-1"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-cyan-400"
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="password"
                className="text-sm font-medium text-white/80"
              >
                Password
              </label>
              <button
                type="button"
                className="text-xs text-cyan-400 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <div className="relative">
              <Input
                id="password"
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
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold py-2.5 
                       rounded-lg shadow-md hover:shadow-cyan-500/30 transition-all duration-300"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {/* Switch link */}
        <p className="text-center text-sm text-white/70 mt-6">
          Don’t have an account?{' '}
          <button
            type="button"
            className="font-medium text-cyan-400 hover:underline"
            onClick={onSwitchToSignup}
          >
            Create one
          </button>
        </p>
      </div>
    </div>,
    document.body
  );
};

export default AuthModal;
