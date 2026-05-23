import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Users, PenLine } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/AuthModal';
import { useInView } from '@/hooks/useInView';
import { useCountUp } from '@/hooks/useCountUp';

const CYCLING_WORDS = ['Captions', 'Quotes', 'Stories', 'Vibes'];

export const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordVisible(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % CYCLING_WORDS.length);
        setWordVisible(true);
      }, 280);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

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
    <section
      className="relative overflow-hidden min-h-screen flex items-center"
      style={{ background: 'linear-gradient(160deg, hsl(232,35%,9%) 0%, hsl(240,25%,7%) 55%, hsl(232,20%,6%) 100%)' }}
    >
      {/* Ambient glow orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full blur-[120px] animate-float"
          style={{ background: 'radial-gradient(circle, hsl(38 90% 54% / 0.18) 0%, transparent 70%)', animationDuration: '6s' }}
        />
        <div
          className="absolute top-1/2 -left-32 w-[420px] h-[420px] rounded-full blur-[100px] animate-float"
          style={{ background: 'radial-gradient(circle, hsl(271 60% 65% / 0.12) 0%, transparent 70%)', animationDelay: '2s', animationDuration: '7s' }}
        />
        <div
          className="absolute -bottom-16 right-1/4 w-[360px] h-[360px] rounded-full blur-[90px] animate-float"
          style={{ background: 'radial-gradient(circle, hsl(38 90% 54% / 0.1) 0%, transparent 70%)', animationDelay: '4s', animationDuration: '5s' }}
        />
        {/* Dot grid */}
        <div className="absolute inset-0 bg-grid-dots opacity-60" />
      </div>

      {/* Floating background quote text */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
        <p className="absolute top-28 right-[8%] font-display italic text-3xl opacity-[0.04] text-amber-300 rotate-3 hidden xl:block leading-relaxed">
          "Be the change you wish to see"
        </p>
        <p className="absolute bottom-36 left-[6%] font-display italic text-2xl opacity-[0.04] text-violet-300 -rotate-2 hidden lg:block leading-relaxed">
          "Inspire · Create · Share"
        </p>
        <p className="absolute top-1/2 right-[3%] font-display italic text-xl opacity-[0.035] text-amber-300 rotate-6 hidden xl:block">
          "Your words matter"
        </p>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto pt-24 pb-20">

          {/* Badge */}
          <div className="animate-fade-in mb-8" style={{ animationDelay: '0.05s' }}>
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase"
              style={{
                background: 'hsl(38 90% 54% / 0.1)',
                border: '1px solid hsl(38 90% 54% / 0.25)',
                color: 'hsl(38, 85%, 68%)',
              }}
            >
              <Sparkles className="h-3 w-3" />
              Create &amp; Share Captions
            </span>
          </div>

          {/* Headline with kinetic word */}
          <div className="animate-fade-in mb-5" style={{ animationDelay: '0.15s' }}>
            <h1
              className="font-display font-bold leading-[1.08] tracking-tight"
              style={{ color: 'hsl(40, 20%, 92%)', fontSize: 'clamp(2.8rem, 8vw, 5.5rem)' }}
            >
              Craft Perfect
              <span className="block mt-1">
                <span
                  className="inline-block transition-all duration-[280ms] ease-out text-gradient-amber"
                  style={{
                    opacity: wordVisible ? 1 : 0,
                    transform: wordVisible ? 'translateY(0) scale(1)' : 'translateY(-12px) scale(0.97)',
                    minWidth: '280px',
                  }}
                >
                  {CYCLING_WORDS[wordIndex]}
                </span>
              </span>
            </h1>
          </div>

          {/* Subheading with typewriter cursor */}
          <div className="animate-fade-in mb-10" style={{ animationDelay: '0.3s' }}>
            <p
              className="text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed font-ui"
              style={{ color: 'hsl(260, 8%, 60%)' }}
            >
              Browse thousands of captions across every mood, category, and language
              <span
                className="inline-block w-0.5 h-5 ml-1 align-middle rounded-sm animate-blink"
                style={{ background: 'hsl(38, 90%, 54%)' }}
              />
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="animate-fade-in flex flex-col sm:flex-row gap-4 justify-center mb-16" style={{ animationDelay: '0.45s' }}>
            <button
              onClick={handleStartCreating}
              className="group inline-flex items-center justify-center gap-2.5 px-8 h-13 rounded-2xl text-base font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] animate-glow-pulse"
              style={{
                background: 'linear-gradient(135deg, hsl(38, 90%, 54%), hsl(25, 90%, 58%))',
                color: 'hsl(232, 20%, 7%)',
                boxShadow: '0 0 30px hsl(38 90% 54% / 0.35), 0 4px 16px hsl(0 0% 0% / 0.3)',
                minHeight: '52px',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              <PenLine className="h-5 w-5 transition-transform duration-200 group-hover:-rotate-6" />
              Start Creating
            </button>
            <button
              onClick={() => navigate('/explore')}
              className="inline-flex items-center justify-center gap-2 px-8 h-13 rounded-2xl text-base font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'hsl(40 20% 92% / 0.05)',
                border: '1px solid hsl(40 20% 92% / 0.15)',
                color: 'hsl(40, 20%, 80%)',
                minHeight: '52px',
                fontFamily: 'DM Sans, sans-serif',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'hsl(40 20% 92% / 0.1)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'hsl(40 20% 92% / 0.25)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'hsl(40 20% 92% / 0.05)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'hsl(40 20% 92% / 0.15)';
              }}
            >
              Explore Captions
            </button>
          </div>

          {/* Stats row */}
          <div ref={statsRef} className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div
              className="inline-flex flex-col sm:flex-row rounded-2xl overflow-hidden"
              style={{
                border: '1px solid hsl(40 20% 92% / 0.08)',
                background: 'hsl(40 20% 92% / 0.03)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {[
                { icon: Users, count: creatorsCount, label: 'Active Creators' },
                { icon: Sparkles, count: captionsCount, label: 'Captions Created' },
                { icon: TrendingUp, count: sharesCount, label: 'Shares Daily' },
              ].map(({ icon: Icon, count, label }, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center px-10 py-6"
                  style={{
                    borderRight: i < 2 ? '1px solid hsl(40 20% 92% / 0.07)' : 'none',
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-4 w-4" style={{ color: 'hsl(38, 90%, 60%)' }} />
                    <span
                      className="text-2xl font-bold font-display"
                      style={{ color: 'hsl(40, 20%, 92%)' }}
                    >
                      {count}+
                    </span>
                  </div>
                  <p className="text-xs tracking-wide uppercase" style={{ color: 'hsl(260, 8%, 50%)' }}>
                    {label}
                  </p>
                </div>
              ))}
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
