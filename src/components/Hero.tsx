import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Users } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/AuthModal';

export const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleStartCreating = () => {
    if (user) {
      navigate('/profile');
    } else {
      setShowAuthModal(true);
    }
  };

  const handleExplore = () => {
    navigate('/explore');
  };

  const handleCloseAuthModal = useCallback(() => {
    setShowAuthModal(false);
  }, []);

  const switchToSignup = useCallback(() => {
    setShowAuthModal(false);
    // Small delay to allow modal transition
    const timer = setTimeout(() => {
      setShowSignupModal(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleAuthSuccess = useCallback(() => {
    setShowAuthModal(false);
    setShowSignupModal(false);
    // Navigate to profile after successful login
    navigate('/profile');
  }, [navigate]);

  return (
    <section className="relative overflow-hidden bg-gradient-hero min-h-screen flex items-center mt-[5px]">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 -left-4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main heading */}
          <div className="animate-fade-in mt-[50px]">
            <h3 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight font-serif">
              Unleash Your 
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Words
              </span>
              Inspire the World
            </h3>
          </div>

          {/* Subheading */}
      

          {/* CTA Buttons */}
          <div className="animate-fade-in flex flex-col sm:flex-row gap-4 justify-center mb-12" style={{ animationDelay: '0.4s' }}>
            <Button 
              variant="hero" 
              size="lg" 
              className="group w-full sm:w-auto"
              onClick={handleStartCreating}
            >
              Start Creating
              <Sparkles className="ml-2 h-5 w-5 group-hover:animate-spin" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm w-full sm:w-auto"
              onClick={handleExplore}
            >
              Explore Captions
            </Button>
          </div>

          {/* Stats */}
          <div className="animate-fade-in grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto w-full" style={{ animationDelay: '0.6s' }}>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-white/80 mr-2" />
                <span className="text-2xl font-bold text-white">10+</span>
              </div>
              <p className="text-white/70 text-sm">Active Creators</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Sparkles className="h-6 w-6 text-white/80 mr-2" />
                <span className="text-2xl font-bold text-white">1000+</span>
              </div>
              <p className="text-white/70 text-sm">Captions Created</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-white/80 mr-2" />
                <span className="text-2xl font-bold text-white">100+</span>
              </div>
              <p className="text-white/70 text-sm">Shares Daily</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={handleCloseAuthModal}
        onSwitchToSignup={switchToSignup}
        onAuthSuccess={handleAuthSuccess}
      />
      
      {/* Signup Modal - You can add this if needed */}
      {/* <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSwitchToLogin={() => {
          setShowSignupModal(false);
          setShowAuthModal(true);
        }}
        onAuthSuccess={handleAuthSuccess}
      /> */}
    </section>
  );
};