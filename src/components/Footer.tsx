import { useState } from "react";
import { Github, Twitter, Instagram } from "lucide-react";
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
            background: 'linear-gradient(135deg, hsl(38, 90%, 54%), hsl(25, 90%, 58%))',
            color: 'hsl(232, 20%, 7%)',
            boxShadow: '0 4px 20px hsl(38 90% 54% / 0.4)',
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
      style={{ background: 'linear-gradient(160deg, hsl(232, 25%, 8%) 0%, hsl(235, 20%, 6%) 100%)' }}
    >
      {/* Hide button */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={() => setVisible(false)}
          className="px-3 py-1.5 text-xs rounded-full transition-all duration-200 hover:scale-105"
          style={{
            background: 'hsl(40 20% 92% / 0.06)',
            border: '1px solid hsl(40 20% 92% / 0.12)',
            color: 'hsl(40, 20%, 60%)',
          }}
        >
          ✖ Hide
        </button>
      </div>

      {/* Ambient glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div
          className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, hsl(38 90% 54% / 0.08) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, hsl(271 60% 65% / 0.07) 0%, transparent 70%)' }}
        />
        <div className="absolute inset-0 bg-grid-dots opacity-40" />
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

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
              <span className="text-xl font-bold font-display" style={{ color: 'hsl(40, 20%, 92%)' }}>
                Caption<span style={{ color: 'hsl(38, 90%, 58%)' }}>Crafter</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'hsl(260, 8%, 55%)' }}>
              Unleash your words, inspire the world. Create and share the perfect captions for every moment.
            </p>

            <div className="flex items-center gap-3">
              {[Twitter, Instagram, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-9 w-9 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 hover:-translate-y-0.5"
                  style={{
                    background: 'hsl(40 20% 92% / 0.06)',
                    border: '1px solid hsl(40 20% 92% / 0.1)',
                    color: 'hsl(40, 20%, 60%)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'hsl(38 90% 54% / 0.12)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'hsl(38 90% 54% / 0.3)';
                    (e.currentTarget as HTMLElement).style.color = 'hsl(38, 90%, 60%)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'hsl(40 20% 92% / 0.06)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'hsl(40 20% 92% / 0.1)';
                    (e.currentTarget as HTMLElement).style.color = 'hsl(40, 20%, 60%)';
                  }}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links grid */}
          <div className="md:col-span-2 lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">

              {/* Quick Links */}
              <div>
                <h3
                  className="font-semibold text-sm mb-4 uppercase tracking-widest pl-3"
                  style={{
                    color: 'hsl(40, 20%, 92%)',
                    borderLeft: '2px solid hsl(38, 90%, 54%)',
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
                        className="text-sm transition-colors duration-200"
                        style={{ color: 'hsl(260, 8%, 52%)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'hsl(38, 90%, 60%)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'hsl(260, 8%, 52%)')}
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
                    color: 'hsl(40, 20%, 92%)',
                    borderLeft: '2px solid hsl(271, 60%, 65%)',
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
                        style={{ color: 'hsl(260, 8%, 52%)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'hsl(271, 60%, 72%)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'hsl(260, 8%, 52%)')}
                      >
                        {text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3
                  className="font-semibold text-sm mb-4 uppercase tracking-widest pl-3"
                  style={{
                    color: 'hsl(40, 20%, 92%)',
                    borderLeft: '2px solid hsl(38, 90%, 54%)',
                  }}
                >
                  Support
                </h3>
                <ul className="space-y-2.5">
                  {["Help Center", "Contact Us", "Privacy Policy", "Terms of Service"].map((text, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="text-sm transition-colors duration-200"
                        style={{ color: 'hsl(260, 8%, 52%)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'hsl(38, 90%, 60%)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'hsl(260, 8%, 52%)')}
                      >
                        {text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14">
          <div
            className="rounded-2xl p-8"
            style={{
              background: 'hsl(40 20% 92% / 0.03)',
              border: '1px solid hsl(40 20% 92% / 0.08)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div className="flex flex-col items-center text-center gap-5">
              {/* Developer */}
              <div>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'hsl(260, 8%, 45%)' }}>
                  Developed by
                </p>
                <p className="text-xl font-bold font-display text-gradient-amber">
                  axzell Innovations
                </p>
              </div>

              {/* Social icons */}
              <div className="flex items-center gap-4">
                {[
                  { icon: <Twitter className="h-4 w-4" />, href: "https://twitter.com/axzellinnovate" },
                  { icon: <Instagram className="h-4 w-4" />, href: "https://www.instagram.com/axzellinnovations" },
                  { icon: <Github className="h-4 w-4" />, href: "https://github.com/axzellinnovations" },
                ].map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 hover:-translate-y-0.5"
                    style={{
                      background: 'hsl(40 20% 92% / 0.08)',
                      border: '1px solid hsl(40 20% 92% / 0.12)',
                      color: 'hsl(40, 20%, 65%)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'hsl(38 90% 54% / 0.15)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'hsl(38 90% 54% / 0.35)';
                      (e.currentTarget as HTMLElement).style.color = 'hsl(38, 90%, 60%)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'hsl(40 20% 92% / 0.08)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'hsl(40 20% 92% / 0.12)';
                      (e.currentTarget as HTMLElement).style.color = 'hsl(40, 20%, 65%)';
                    }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>

              {/* Contact + copyright */}
              <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <a
                    href="tel:+94768180977"
                    className="text-xs transition-colors duration-200 hover:text-foreground"
                    style={{ color: 'hsl(260, 8%, 48%)' }}
                  >
                    📞 +94 (76) 818-0977
                  </a>
                  <a
                    href="mailto:social@axzellinnovations.com"
                    className="text-xs transition-colors duration-200 hover:text-foreground"
                    style={{ color: 'hsl(260, 8%, 48%)' }}
                  >
                    ✉️ social@axzellinnovations.com
                  </a>
                </div>
                <p className="text-xs" style={{ color: 'hsl(260, 8%, 38%)' }}>
                  © {new Date().getFullYear()} Axzell Innovations. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
