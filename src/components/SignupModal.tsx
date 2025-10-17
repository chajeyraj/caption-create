import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export const SignupModal = ({ isOpen, onClose, onSwitchToLogin }: SignupModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

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

    if (!email || !password || !displayName) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signUp(email, password, displayName);
      if (error) throw error;

      toast({
        title: 'Success!',
        description:
          'Account created successfully! Please check your email to confirm your account.',
      });

      onSwitchToLogin();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create account';
      toast({
        title: 'Signup Failed',
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
            Create an Account
          </h2>
          <p className="text-sm text-white/70">
            Enter your details to get started
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Display Name */}
          <div>
            <label
              htmlFor="displayName"
              className="block text-sm font-medium text-white/80 mb-1"
            >
              Display Name
            </label>
            <Input
              id="displayName"
              type="text"
              placeholder="John Doe"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={isLoading}
              className="w-full bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-cyan-400"
              autoComplete="name"
            />
          </div>

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
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white/80 mb-1"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-cyan-400"
              autoComplete="new-password"
            />
            <p className="text-xs text-white/60 mt-1">
              Password must be at least 6 characters long
            </p>
          </div>

          {/* Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold py-2.5 
                       rounded-lg shadow-md hover:shadow-cyan-500/30 transition-all duration-300"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        {/* Switch to login */}
        <p className="text-center text-sm text-white/70 mt-6">
          Already have an account?{' '}
          <button
            type="button"
            className="font-medium text-cyan-400 hover:underline"
            onClick={onSwitchToLogin}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>,
    document.body
  );
};

export default SignupModal;
