import { useState } from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setVisible(true)}
          className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
          style={{
            background: 'var(--gradient-primary)',
            color: 'hsl(var(--primary-foreground))',
            boxShadow: '0 4px 20px hsl(var(--primary) / 0.4)',
          }}
        >
          Show Footer ↑
        </button>
      </div>
    );
  }

  return (
    <footer
      className="relative overflow-hidden mt-auto"
      style={{ background: 'hsl(var(--background))' }}
    >
      {/* Hide button */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={() => setVisible(false)}
          className="px-3 py-1.5 text-xs rounded-full transition-all duration-200 hover:scale-105"
          style={{
            background: 'hsl(var(--muted))',
            border: '1px solid hsl(var(--border))',
            color: 'hsl(var(--muted-foreground))',
          }}
        >
          ✖ Hide
        </button>
      </div>

      {/* Ambient glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div
          className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.08) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, hsl(var(--accent) / 0.07) 0%, transparent 70%)' }}
        />
        <div className="absolute inset-0 bg-grid-dots opacity-40" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 lg:gap-8">

          {/* Brand */}
          <div className="md:col-span-2 lg:col-span-1 space-y-5">
            <div className="flex items-center gap-3">
              <img
                src="/img/logo.PNG"
                alt="CaptionCrafter Logo"
                className="h-9 w-auto rounded-lg"
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  t.onerror = null; t.src = "/logo.png"; t.className = "h-9 w-9";
                }}
              />
              <span className="text-xl font-bold font-display" style={{ color: 'hsl(var(--foreground))' }}>
                Caption<span style={{ color: 'hsl(var(--primary))' }}>Crafter</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>
              Unleash your words, inspire the world. Create and share the perfect captions for every moment.
            </p>

          </div>

          {/* Links grid */}
          <div className="md:col-span-2 lg:col-span-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">

              {/* Quick Links */}
              <div>
                <h3
                  className="font-semibold text-sm mb-4 uppercase tracking-widest pl-3"
                  style={{
                    color: 'hsl(var(--foreground))',
                    borderLeft: '2px solid hsl(var(--primary))',
                  }}
                >
                  Quick Links
                </h3>
                <ul className="space-y-2.5">
                  {[
                    { label: "Home", to: "/" },
                    { label: "Explore", to: "/explore" },
                    { label: "Categories", to: "/categories" },
                    { label: "Trending", to: "/trending" },
                  ].map(({ label, to }) => (
                    <li key={to}>
                      <Link
                        to={to}
                        onClick={() => window.scrollTo({ top: 0 })}
                        className="text-sm transition-colors duration-200"
                        style={{ color: 'hsl(var(--muted-foreground))' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'hsl(var(--primary))')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'hsl(var(--muted-foreground))')}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Categories */}
              <div>
                <h3
                  className="font-semibold text-sm mb-4 uppercase tracking-widest pl-3"
                  style={{
                    color: 'hsl(var(--foreground))',
                    borderLeft: '2px solid hsl(var(--accent))',
                  }}
                >
                  Categories
                </h3>
                <ul className="space-y-2.5">
                  {["Motivational", "Funny", "Love & Romance", "Life Quotes"].map((text) => (
                    <li key={text}>
                      <Link
                        to={`/category/${encodeURIComponent(text)}`}
                        className="text-sm transition-colors duration-200"
                        style={{ color: 'hsl(var(--muted-foreground))' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'hsl(var(--accent))')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'hsl(var(--muted-foreground))')}
                      >
                        {text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 sm:mt-14">
          <div
            className="rounded-2xl p-5 sm:p-8"
            style={{
              background: 'hsl(var(--muted) / 0.3)',
              border: '1px solid hsl(var(--border) / 0.5)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div className="flex flex-col items-center text-center gap-5">
              {/* Developer */}
              <div>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  Developed by
                </p>
                <p className="text-xl font-bold font-display text-gradient-amber">
                  axzell innovations
                </p>
              </div>

              {/* Contact + copyright */}
              <div className="w-full flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5">
                  <a
                    href="tel:+94768180977"
                    className="text-xs transition-colors duration-200 hover:text-foreground"
                    style={{ color: 'hsl(var(--muted-foreground))' }}
                  >
                    📞 +94 (76) 818-0977
                  </a>
                  <a
                    href="mailto:social@axzellin.com"
                    className="text-xs transition-colors duration-200 hover:text-foreground"
                    style={{ color: 'hsl(var(--muted-foreground))' }}
                  >
                    ✉️ social@axzellin.com
                  </a>
                </div>
                <p className="text-xs" style={{ color: 'hsl(var(--muted-foreground) / 0.7)' }}>
                  © {new Date().getFullYear()} axzell innovations. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
