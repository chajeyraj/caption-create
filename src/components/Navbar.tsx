import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, X, Sparkles, Search, User, PenTool, LogOut } from "lucide-react";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, signOut, loading, isAdmin } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              CaptionCrafter
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`transition-colors ${isActive('/') ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
            >
              Home
            </Link>
            <Link 
              to="/explore" 
              className={`transition-colors ${isActive('/explore') ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
            >
              Explore
            </Link>
            <Link 
              to="/categories" 
              className={`transition-colors ${isActive('/categories') ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
            >
              Categories
            </Link>
            <Link 
              to="/trending" 
              className={`transition-colors ${isActive('/trending') ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
            >
              Trending
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search captions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-foreground">
                      Welcome, {user.email}
                    </span>
                     {isAdmin && (
                       <Button variant="outline" size="sm" asChild>
                         <Link to="/admin">Admin</Link>
                       </Button>
                     )}
                     <Button variant="outline" size="sm" asChild>
                       <Link to="/profile">
                         <User className="h-4 w-4 mr-2" />
                         Profile
                       </Link>
                     </Button>
                     <Button variant="outline" size="sm" onClick={signOut}>
                       <LogOut className="h-4 w-4 mr-2" />
                       Logout
                     </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/auth">
                      <User className="h-4 w-4 mr-2" />
                      Login
                    </Link>
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

              <Link to="/" className="text-foreground hover:text-primary transition-colors py-2">
                Home
              </Link>
              <Link to="/explore" className="text-foreground hover:text-primary transition-colors py-2">
                Explore
              </Link>
              <Link to="/categories" className="text-foreground hover:text-primary transition-colors py-2">
                Categories
              </Link>
              <Link to="/trending" className="text-foreground hover:text-primary transition-colors py-2">
                Trending
              </Link>
              
              <div className="flex flex-col space-y-3 pt-4 border-t border-border/50">
                {!loading && (
                  <>
                    {user ? (
                      <>
                        <span className="text-sm text-foreground px-2">
                          Welcome, {user.email}
                        </span>
                        {isAdmin && (
                          <Button variant="outline" size="sm" className="w-full" asChild>
                            <Link to="/admin">Admin</Link>
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <Link to="/profile">
                            <User className="h-4 w-4 mr-2" />
                            Profile
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="w-full" onClick={signOut}>
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </>
                    ) : (
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link to="/auth">
                          <User className="h-4 w-4 mr-2" />
                          Login
                        </Link>
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
    </nav>
  );
};