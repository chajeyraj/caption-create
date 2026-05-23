import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks";
import { Input } from "@/components/ui/input";
import { Menu, X, Search, User, PenLine } from "lucide-react";
import { AuthModal } from "./AuthModal";
import { useMediaQuery } from "@/hooks/use-media-query";
import { VLink } from "@/components/VLink";
import { useViewNavigate } from "@/hooks/useViewNavigate";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useViewNavigate();
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

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/explore', label: 'Explore' },
    { to: '/categories', label: 'Categories' },
    { to: '/trending', label: 'Trending' },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
      style={{
        background: isScrolled
          ? 'hsl(232, 20%, 7% / 0.95)'
          : 'hsl(232, 20%, 7% / 0.7)',
        backdropFilter: 'blur(16px)',
        borderBottom: isScrolled
          ? '1px solid hsl(240, 12%, 20%)'
          : '1px solid hsl(240, 12%, 14%)',
        boxShadow: isScrolled ? '0 4px 30px hsl(0 0% 0% / 0.3)' : 'none',
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 relative">

          {/* Logo */}
          <VLink to="/" className="flex items-center gap-2.5 group shrink-0">
            <img
              src="/img/logo.PNG"
              alt="CaptionCrafter Logo"
              className="h-8 w-auto"
              onError={(e) => {
                const t = e.target as HTMLImageElement;
                t.onerror = null;
                t.src = "/logo.png";
                t.className = "h-8 w-8";
              }}
            />
            <span
              className="text-lg font-bold font-display tracking-tight transition-opacity duration-200 group-hover:opacity-80"
              style={{ color: 'hsl(40, 20%, 92%)' }}
            >
              Caption<span style={{ color: 'hsl(38, 90%, 58%)' }}>Crafter</span>
            </span>
          </VLink>

          {/* Desktop nav — centered */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map(({ to, label }) => (
              <VLink
                key={to}
                to={to}
                className="relative pb-0.5 text-sm font-medium transition-colors duration-200 group"
                style={{ color: isActive(to) ? 'hsl(38, 90%, 60%)' : 'hsl(40, 20%, 68%)' }}
                onMouseEnter={(e) => {
                  if (!isActive(to)) (e.currentTarget as HTMLElement).style.color = 'hsl(40, 20%, 92%)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = isActive(to) ? 'hsl(38, 90%, 60%)' : 'hsl(40, 20%, 68%)';
                }}
              >
                {label}
                <span
                  className="absolute bottom-0 left-0 h-px rounded-full transition-transform duration-300 origin-left"
                  style={{
                    width: '100%',
                    transform: isActive(to) ? 'scaleX(1)' : 'scaleX(0)',
                    background: 'linear-gradient(90deg, hsl(38, 90%, 54%), hsl(25, 90%, 58%))',
                  }}
                />
              </VLink>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            {!loading && (
              <>
                {user ? (
                  <VLink to="/profile">
                    <button
                      aria-label="Profile"
                      className="h-9 w-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
                      style={{
                        border: '1px solid hsl(38 90% 54% / 0.4)',
                        background: 'hsl(38 90% 54% / 0.08)',
                        color: 'hsl(38, 90%, 62%)',
                      }}
                    >
                      <User className="h-4 w-4" />
                    </button>
                  </VLink>
                ) : (
                  <button
                    onClick={handleOpenAuthModal}
                    aria-label="Sign in"
                    className="h-9 w-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
                    style={{
                      border: '1px solid hsl(40 20% 92% / 0.15)',
                      background: 'hsl(40 20% 92% / 0.05)',
                      color: 'hsl(40, 20%, 72%)',
                    }}
                  >
                    <User className="h-4 w-4" />
                  </button>
                )}
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden h-9 w-9 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: 'hsl(40, 20%, 75%)', background: 'transparent' }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div
            className="md:hidden py-4 animate-fade-in"
            style={{ borderTop: '1px solid hsl(240, 12%, 18%)' }}
          >
            <div className="flex flex-col gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'hsl(260, 8%, 50%)' }} />
                <Input
                  placeholder="Search captions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  style={{ background: 'hsl(240, 10%, 13%)', border: '1px solid hsl(240, 12%, 22%)', color: 'hsl(40, 20%, 85%)' }}
                />
              </form>

              {/* Links */}
              {navLinks.map(({ to, label }) => (
                <VLink
                  key={to}
                  to={to}
                  className="py-2 text-sm font-medium transition-colors"
                  style={{ color: isActive(to) ? 'hsl(38, 90%, 60%)' : 'hsl(40, 20%, 68%)' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </VLink>
              ))}

              <div className="flex flex-col gap-3 pt-3" style={{ borderTop: '1px solid hsl(240, 12%, 18%)' }}>
                {!loading && (
                  user ? (
                    <VLink to="/profile" onClick={() => setIsMenuOpen(false)}>
                      <button
                        className="h-9 w-9 rounded-full flex items-center justify-center transition-all"
                        style={{ border: '1px solid hsl(38 90% 54% / 0.4)', background: 'hsl(38 90% 54% / 0.08)', color: 'hsl(38, 90%, 62%)' }}
                      >
                        <User className="h-4 w-4" />
                      </button>
                    </VLink>
                  ) : (
                    <button
                      onClick={handleOpenAuthModal}
                      className="h-9 w-9 rounded-full flex items-center justify-center transition-all"
                      style={{ border: '1px solid hsl(40 20% 92% / 0.15)', background: 'hsl(40 20% 92% / 0.05)', color: 'hsl(40, 20%, 72%)' }}
                    >
                      <User className="h-4 w-4" />
                    </button>
                  )
                )}

                <button
                  className="w-full flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: 'linear-gradient(135deg, hsl(38, 90%, 54%), hsl(25, 90%, 58%))',
                    color: 'hsl(232, 20%, 7%)',
                  }}
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (user) navigate('/profile');
                    else handleOpenAuthModal();
                  }}
                >
                  <PenLine className="h-4 w-4" />
                  Create Caption
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <AuthModal isOpen={showAuthModal} onClose={handleCloseAuthModal} onAuthSuccess={handleAuthSuccess} />
    </nav>
  );
};
