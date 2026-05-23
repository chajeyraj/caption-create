import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, X, Search, User, PenTool } from "lucide-react";
import { AuthModal } from "./AuthModal";
import { useMediaQuery } from "@/hooks/use-media-query";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, loading } = useAuth();
  const location = useLocation();
  useEffect(() => {
    console.log('[Navbar] auth changed — loading:', loading, 'user:', user?.email ?? 'none');
  }, [user, loading]);
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (isDesktop) setIsMenuOpen(false);
  }, [isDesktop]);

  useEffect(() => {
    if (user) setShowAuthModal(false);
  }, [user]);

  const handleCloseAuthModal = useCallback(() => setShowAuthModal(false), []);
  const handleOpenAuthModal = useCallback(() => setShowAuthModal(true), []);

  const handleAuthSuccess = useCallback(() => {
    setShowAuthModal(false);
    if (!isDesktop) setIsMenuOpen(false);
  }, [isDesktop]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  }, [searchQuery, navigate]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50 transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 relative">
          {/* Mobile Menu Button - Left aligned */}
          

          {/* Logo - Centered */}
          <div className="flex items-center justify-start md:justify-start w-auto md:w-auto">
            <Link to="/" className="flex items-center space-x-2 group">
              <img 
                src="/img/logo.PNG" 
                alt="CaptionCrafter Logo" 
                className="h-8 w-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "/logo.png";
                  target.className = "h-8 w-8";
                }}
              />
              <span className={`text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent ${isMenuOpen ? 'md:hidden' : ''}`}>
                Caption Crafter
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
            {[
              { to: '/', label: 'Home' },
              { to: '/explore', label: 'Explore' },
              { to: '/categories', label: 'Categories' },
              { to: '/trending', label: 'Trending' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`relative pb-0.5 transition-colors group ${
                  isActive(to) ? 'text-blue-600 font-medium' : 'text-foreground hover:text-blue-600'
                }`}
              >
                {label}
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-blue-600 transition-transform duration-300 origin-left ${
                    isActive(to) ? 'w-full scale-x-100' : 'w-full scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Desktop Actions - Right aligned */}
          <div className="hidden md:flex items-center space-x-4 absolute right-0">
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-4">

                    <Link to="/profile">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        aria-label="Profile"
                        className="rounded-full border border-blue-600 bg-background hover:bg-accent text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                      >
                        <User className="h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleOpenAuthModal}
                    aria-label="Login"
                    className="rounded-full border border-blue-600 bg-background hover:bg-accent text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search captions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </form>

              <Link to="/" className="text-foreground hover:text-blue-600 transition-colors py-2">
                Home
              </Link>
              <Link to="/explore" className="text-foreground hover:text-blue-600 transition-colors py-2">
                Explore
              </Link>
              <Link to="/categories" className="text-foreground hover:text-blue-600 transition-colors py-2">
                Categories
              </Link>
              <Link to="/trending" className="text-foreground hover:text-blue-600 transition-colors py-2">
                Trending
              </Link>
              
              <div className="flex flex-col space-y-3 pt-4 border-t border-border/50">
                {!loading && (
                  <>
                    {user ? (
                      <Link to="/profile" className="w-fit">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          aria-label="Profile"
                          className="rounded-full border border-blue-600 bg-background hover:bg-accent text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 w-10 h-10"
                        >
                          <User className="h-5 w-5" />
                        </Button>
                      </Link>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="rounded-full border border-blue-600 bg-background hover:bg-accent text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 w-10 h-10" 
                        onClick={handleOpenAuthModal}
                        aria-label="Login"
                      >
                        <User className="h-5 w-5" />
                      </Button>
                    )}
                  </>
                )}
                <Button
                  variant="gradient"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (user) navigate('/profile');
                    else handleOpenAuthModal();
                  }}
                >
                  <PenTool className="h-4 w-4 mr-2" />
                  Create Caption
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={handleCloseAuthModal}
        onAuthSuccess={handleAuthSuccess}
      />
    </nav>
  );
};