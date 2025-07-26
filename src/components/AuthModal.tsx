import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import type { ToastAction } from '@/components/ui/toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
  onAuthSuccess?: () => void;
}

export const AuthModal = ({ isOpen, onClose, onSwitchToSignup, onAuthSuccess }: AuthModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  if (!isOpen || typeof window === 'undefined') {
    return null;
  }

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
      if (onAuthSuccess) {
        onAuthSuccess();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in';
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
    <div className="fixed inset-0 z-[9999] flex items-start justify-center p-4 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000]"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-lg bg-background p-8 shadow-xl z-[10001] my-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>
        
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold">Welcome back</h2>
            <p className="text-muted-foreground">Enter your credentials to access your account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full"
                autoComplete="email"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium leading-none">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-primary hover:underline"
                  onClick={() => {
                    // Handle forgot password
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full"
                autoComplete="current-password"
              />
            </div>
            
            <Button type="submit" className="w-full mt-4" size="lg" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          
          <p className="text-center text-sm text-muted-foreground mt-4">
            Don't have an account?{' '}
            <button
              type="button"
              className="font-medium text-primary hover:underline"
              onClick={onSwitchToSignup}
            >
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AuthModal;
