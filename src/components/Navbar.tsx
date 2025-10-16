import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, X, BookOpen, Search, User, PenTool, LogOut, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { AuthModal } from "./AuthModal";
import { SignupModal } from "./SignupModal";
// Import hooks directly to avoid circular dependencies
import { useMediaQuery } from "@/hooks/use-media-query";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { user, signOut, loading, isAdmin, userProfile } = useAuth();
  const location = useLocation();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Set mounted state after initial render to avoid SSR issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close mobile menu when switching to desktop
  useEffect(() => {
    if (isDesktop) {
      setIsMenuOpen(false);
    }
  }, [isDesktop]);

  // Close modals when user is authenticated
  useEffect(() => {
    if (user) {
      setShowAuthModal(false);
      setShowSignupModal(false);
    }
  }, [user]);

  // Memoize the modal handlers to prevent unnecessary re-renders
  const handleCloseAuthModal = useCallback(() => {
    setShowAuthModal(false);
  }, []);
  
  const handleCloseSignupModal = useCallback(() => {
    setShowSignupModal(false);
  }, []);
  
  const handleOpenAuthModal = useCallback(() => {
    setShowAuthModal(true);
  }, []);

  // Handle successful authentication
  const handleAuthSuccess = useCallback(() => {
    setShowAuthModal(false);
    setShowSignupModal(false);
    if (!isDesktop) {
      setIsMenuOpen(false);
    }
  }, [isDesktop]);

  const switchToSignup = useCallback(() => {
    setShowAuthModal(false);
    // Small delay to allow modal transition
    const timer = setTimeout(() => {
      setShowSignupModal(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const switchToLogin = useCallback(() => {
    setShowSignupModal(false);
    // Small delay to allow modal transition
    const timer = setTimeout(() => {
      setShowAuthModal(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50">
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
            <Link 
              to="/" 
              className={`transition-colors ${isActive('/') ? 'text-blue-600 font-medium' : 'text-foreground hover:text-blue-600'}`}
            >
              Home
            </Link>
            <Link 
              to="/explore" 
              className={`transition-colors ${isActive('/explore') ? 'text-blue-600 font-medium' : 'text-foreground hover:text-blue-600'}`}
            >
              Explore
            </Link>
            <Link 
              to="/categories" 
              className={`transition-colors ${isActive('/categories') ? 'text-blue-600 font-medium' : 'text-foreground hover:text-blue-600'}`}
            >
              Categories
            </Link>
            <Link 
              to="/trending" 
              className={`transition-colors ${isActive('/trending') ? 'text-blue-600 font-medium' : 'text-foreground hover:text-blue-600'}`}
            >
              Trending
            </Link>
          </div>

          {/* Desktop Actions - Right aligned */}
          <div className="hidden md:flex items-center space-x-4 absolute right-0">
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-4">

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center gap-2 pr-2">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            <span className="font-medium">
                              {userProfile?.display_name || userProfile?.name || user.email?.split('@')[0] || "User"}
                            </span>
                          </div>
                          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48" align="end" sideOffset={8}>
                        <DropdownMenuItem asChild className="cursor-pointer px-4 py-2 text-sm">
                          <Link to="/profile" className="w-full">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                          </Link>
                        </DropdownMenuItem>
                        {isAdmin && (
                          <DropdownMenuItem asChild className="cursor-pointer px-4 py-2 text-sm">
                            <Link to="/admin" className="w-full">
                              <PenTool className="mr-2 h-4 w-4" />
                              <span>Admin</span>
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={signOut}
                          className="cursor-pointer px-4 py-2 text-sm text-destructive focus:text-destructive"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Sign out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleOpenAuthModal}
                    className="flex items-center"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Login
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search captions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

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
                      <>
                        <span className="text-sm text-foreground px-2 flex items-center">
                          Welcome, {userProfile?.display_name || userProfile?.name || user.email?.split('@')[0]}
                          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </span>
                        <DropdownMenu>
                          <DropdownMenuContent className="w-48" align="end" sideOffset={8}>
                            <DropdownMenuItem asChild className="cursor-pointer px-4 py-2 text-sm">
                              <Link to="/profile" className="w-full">
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                              </Link>
                            </DropdownMenuItem>
                            {isAdmin && (
                              <DropdownMenuItem asChild className="cursor-pointer px-4 py-2 text-sm">
                                <Link to="/dashboard" className="w-full">
                                  <PenTool className="mr-2 h-4 w-4" />
                                  <span>Dashboard</span>
                                </Link>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={signOut}
                              className="cursor-pointer px-4 py-2 text-sm text-destructive focus:text-destructive"
                            >
                              <LogOut className="mr-2 h-4 w-4" />
                              <span>Sign out</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full" 
                        onClick={handleOpenAuthModal}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Login
                      </Button>
                    )}
                  </>
                )}
                <Button variant="gradient" size="sm" className="w-full">
                  <PenTool className="h-4 w-4 mr-2" />
                  Create Caption
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Auth Modals - Only render on client side */}
      {isMounted && (
        <>
          <AuthModal 
            isOpen={showAuthModal}
            onClose={handleCloseAuthModal}
            onSwitchToSignup={switchToSignup}
          />
          
          <SignupModal
            isOpen={showSignupModal}
            onClose={handleCloseSignupModal}
            onSwitchToLogin={switchToLogin}
          />
        </>
      )}
    </nav>
  );
};