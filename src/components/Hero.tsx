import { useState, useCallback, useEffect } from 'react';
import { Sparkles, TrendingUp, Users, PenLine } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/AuthModal';
import { useInView } from '@/hooks/useInView';
import { useCountUp } from '@/hooks/useCountUp';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { useViewNavigate } from '@/hooks/useViewNavigate';

const CYCLING_WORDS = ['Captions', 'Quotes', 'Stories', 'Vibes'];

/* Staggered word entrance — each word clips up from a mask */
const StaggeredHeading = ({ text, delay = 0 }: { text: string; delay?: number }) => (
  <>
    {text.split(' ').map((word, i) => (
      <span key={i} className="word-reveal-mask">
        <span
          className="word-reveal-inner"
          style={{ animationDelay: `${delay + i * 70}ms` }}
        >
          {word}
        </span>
        {i < text.split(' ').length - 1 && ' '}
      </span>
    ))}
  </>
);

export const Hero = () => {
  const { user } = useAuth();
  const viewNavigate = useViewNavigate();
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
    if (user) viewNavigate('/profile');
    else setShowAuthModal(true);
  };

  const handleAuthSuccess = useCallback(() => {
    setShowAuthModal(false);
    viewNavigate('/profile');
  }, [viewNavigate]);

  const [statsRef, statsInView] = useInView<HTMLDivElement>({ threshold: 0.5 });
  const creatorsCount = useCountUp(10, 1000, statsInView);
  const captionsCount = useCountUp(1000, 1400, statsInView);
  const sharesCount = useCountUp(100, 1200, statsInView);

  return (
    <section
      className="relative overflow-hidden min-h-screen flex items-center"
      style={{ background: 'var(--gradient-hero)' }}
    >
      {/* Ambient glow orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full blur-[120px] animate-float"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.18) 0%, transparent 70%)', animationDuration: '6s' }}
        />
        <div
          className="absolute top-1/2 -left-32 w-[420px] h-[420px] rounded-full blur-[100px] animate-float"
          style={{ background: 'radial-gradient(circle, hsl(var(--accent) / 0.12) 0%, transparent 70%)', animationDelay: '2s', animationDuration: '7s' }}
        />
        <div
          className="absolute -bottom-16 right-1/4 w-[360px] h-[360px] rounded-full blur-[90px] animate-float"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)', animationDelay: '4s', animationDuration: '5s' }}
        />
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
        <div className="text-center max-w-4xl mx-auto pt-24 pb-12 sm:pt-28 sm:pb-20">

          {/* Badge */}
          <div className="animate-fade-in mb-6 sm:mb-8" style={{ animationDelay: '0.05s' }}>
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase"
              style={{
                background: 'hsl(var(--primary) / 0.1)',
                border: '1px solid hsl(var(--primary) / 0.25)',
                color: 'hsl(var(--primary))',
              }}
            >
              <Sparkles className="h-3 w-3" />
              Create &amp; Share Captions
            </span>
          </div>

          {/* Headline — staggered word entrance */}
          <div className="mb-4 sm:mb-5" style={{ animationDelay: '0.1s' }}>
            <h1
              className="font-display font-bold leading-[1.08] tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem]"
              style={{ color: 'hsl(var(--foreground))' }}
            >
              <StaggeredHeading text="Craft Perfect" delay={80} />
              <span className="block mt-1">
                {/* Kinetic cycling word */}
                <span
                  className="inline-block transition-all duration-[280ms] ease-out text-gradient-amber"
                  style={{
                    opacity: wordVisible ? 1 : 0,
                    transform: wordVisible ? 'translateY(0) scale(1)' : 'translateY(-12px) scale(0.97)',
                  }}
                >
                  {CYCLING_WORDS[wordIndex]}
                </span>
              </span>
            </h1>
          </div>

          {/* Subtitle with typewriter cursor */}
          <div className="animate-fade-in mb-8 sm:mb-10" style={{ animationDelay: '0.45s' }}>
            <p
              className="text-sm sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-ui px-2 sm:px-0"
              style={{ color: 'hsl(var(--muted-foreground))' }}
            >
              Browse thousands of captions across every mood, category, and language
              <span
                className="inline-block w-0.5 h-5 ml-1 align-middle rounded-sm animate-blink"
                style={{ background: 'hsl(var(--primary))' }}
              />
            </p>
          </div>

          {/* CTAs */}
          <div className="animate-fade-in flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 sm:mb-16" style={{ animationDelay: '0.6s' }}>
            <button
              onClick={handleStartCreating}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 rounded-2xl text-base font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
              style={{
                background: 'var(--gradient-primary)',
                color: 'hsl(var(--primary-foreground))',
                boxShadow: '0 0 30px hsl(var(--primary) / 0.35), var(--shadow-card)',
                minHeight: '52px',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              <PenLine className="h-5 w-5 transition-transform duration-200 group-hover:-rotate-6" />
              Start Creating
            </button>
            <button
              onClick={() => viewNavigate('/explore')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 rounded-2xl text-base font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'hsl(var(--muted))',
                border: '1px solid hsl(var(--border))',
                color: 'hsl(var(--foreground) / 0.8)',
                minHeight: '52px',
                fontFamily: 'DM Sans, sans-serif',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'hsl(var(--secondary))';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'hsl(var(--ring) / 0.4)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'hsl(var(--muted))';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'hsl(var(--border))';
              }}
            >
              Explore Captions
            </button>
          </div>

          {/* Stats with slot-machine numbers */}
          <div ref={statsRef} className="animate-fade-in" style={{ animationDelay: '0.75s' }}>
            <div
              className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-white/[.07] rounded-2xl overflow-hidden w-full sm:w-auto sm:inline-flex"
              style={{
                border: '1px solid hsl(var(--border) / 0.5)',
                background: 'hsl(var(--muted) / 0.3)',
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
                  className="flex flex-col items-center px-6 py-4 sm:px-10 sm:py-6"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-4 w-4" style={{ color: 'hsl(var(--primary))' }} />
                    <span className="text-2xl font-bold font-display" style={{ color: 'hsl(var(--foreground))' }}>
                      <AnimatedNumber value={count} suffix="+" />
                    </span>
                  </div>
                  <p className="text-xs tracking-wide uppercase" style={{ color: 'hsl(var(--muted-foreground))' }}>
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
