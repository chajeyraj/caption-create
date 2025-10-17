import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn(email, password);
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signUp(email, password, displayName);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/20 via-purple-700/10 to-transparent blur-3xl opacity-40" />

      {/* Main card */}
      <Card className="relative w-full max-w-md bg-white/10 border border-white/20 backdrop-blur-xl shadow-2xl text-white p-6 rounded-2xl animate-[fadeIn_0.4s_ease-out]">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent drop-shadow-md">
            Welcome
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login" className="w-full mt-2">
            <TabsList className="grid w-full grid-cols-2 bg-white/10 rounded-lg p-1 mb-4">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-sm font-medium rounded-md transition-all"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-sm font-medium rounded-md transition-all"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Sign In Form */}
            <TabsContent value="login">
              <form onSubmit={handleSignIn} className="space-y-5">
                <div>
                  <Label htmlFor="email" className="text-white/80">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus-visible:ring-cyan-400"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-white/80">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus-visible:ring-cyan-400"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold py-2.5 rounded-lg hover:shadow-cyan-500/40 transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            {/* Sign Up Form */}
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-5">
                <div>
                  <Label htmlFor="displayName" className="text-white/80">
                    Display Name
                  </Label>
                  <Input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    className="bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus-visible:ring-cyan-400"
                  />
                </div>
                <div>
                  <Label htmlFor="signupEmail" className="text-white/80">
                    Email
                  </Label>
                  <Input
                    id="signupEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus-visible:ring-cyan-400"
                  />
                </div>
                <div>
                  <Label htmlFor="signupPassword" className="text-white/80">
                    Password
                  </Label>
                  <Input
                    id="signupPassword"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus-visible:ring-cyan-400"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold py-2.5 rounded-lg hover:shadow-purple-500/40 transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="absolute bottom-4 text-center text-xs text-white/60">
        <p>Developed by <span className="text-cyan-400 font-semibold">Axzell Innovations</span></p>
      </div>
    </div>
  );
};

export default Auth;
