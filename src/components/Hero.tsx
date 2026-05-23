import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Users } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/AuthModal';
import { useInView } from '@/hooks/useInView';
import { useCountUp } from '@/hooks/useCountUp';

export const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  useEffect(() => {
    console.log('[Hero] user changed:', user?.email ?? 'none');
  }, [user]);

  const handleStartCreating = () => {
    if (user) navigate('/profile');
    else setShowAuthModal(true);
  };

  const handleAuthSuccess = useCallback(() => {
    setShowAuthModal(false);
    navigate('/profile');
  }, [navigate]);

  const [statsRef, statsInView] = useInView<HTMLDivElement>({ threshold: 0.5 });
  const creatorsCount = useCountUp(10, 1000, statsInView);
  const captionsCount = useCountUp(1000, 1400, statsInView);
  const sharesCount = useCountUp(100, 1200, statsInView);

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
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight font-serif">
              Unleash Your
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Words
              </span>
              Inspire the World
            </h1>
          </div>

          {/* Subheading */}
          <p className="animate-fade-in text-xl text-white/80 max-w-2xl mx-auto mb-8" style={{ animationDelay: '0.2s' }}>
            Browse thousands of captions across every mood, category, and language — then make them yours.
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-in flex flex-col sm:flex-row gap-4 justify-center mb-12" style={{ animationDelay: '0.4s' }}>
            <Button 
              variant="hero" 
              size="lg" 
              className="group w-full sm:w-auto"
              onClick={handleStartCreating}
            >
              Start Creating
              <Sparkles className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:rotate-12 group-hover:scale-110" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm w-full sm:w-auto"
              onClick={() => navigate('/explore')}
            >
              Explore Captions
            </Button>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="animate-fade-in flex flex-col sm:flex-row max-w-2xl mx-auto w-full divide-y sm:divide-y-0 sm:divide-x divide-white/20" style={{ animationDelay: '0.6s' }}>
            <div className="text-center flex-1 py-4 sm:py-0 sm:px-8">
              <div className="flex items-center justify-center mb-1">
                <Users className="h-5 w-5 text-white/80 mr-2" />
                <span className="text-2xl font-bold text-white">{creatorsCount}+</span>
              </div>
              <p className="text-white/70 text-sm">Active Creators</p>
            </div>
            <div className="text-center flex-1 py-4 sm:py-0 sm:px-8">
              <div className="flex items-center justify-center mb-1">
                <Sparkles className="h-5 w-5 text-white/80 mr-2" />
                <span className="text-2xl font-bold text-white">{captionsCount}+</span>
              </div>
              <p className="text-white/70 text-sm">Captions Created</p>
            </div>
            <div className="text-center flex-1 py-4 sm:py-0 sm:px-8">
              <div className="flex items-center justify-center mb-1">
                <TrendingUp className="h-5 w-5 text-white/80 mr-2" />
                <span className="text-2xl font-bold text-white">{sharesCount}+</span>
              </div>
              <p className="text-white/70 text-sm">Shares Daily</p>
            </div>
          </div>
        </div>
      </div>
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </section>
  );
};