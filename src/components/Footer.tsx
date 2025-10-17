import { useState } from "react";
import { Github, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  const [visible, setVisible] = useState(true);

  // Show Footer Button (when hidden)
  if (!visible) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setVisible(true)}
          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 
                     text-white shadow-lg shadow-cyan-500/30 backdrop-blur-md 
                     hover:scale-105 hover:shadow-cyan-400/50 transition-all duration-300"
        >
          Show Footer ⬆
        </button>
      </div>
    );
  }

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden mt-auto">
      {/* Hide Button (floating top-right inside footer) */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={() => setVisible(false)}
          className="px-3 py-1.5 text-sm rounded-full bg-white/10 backdrop-blur-md text-white 
                     border border-white/20 hover:bg-white/20 hover:scale-105 
                     transition-all duration-300 shadow-md shadow-white/10"
        >
          ✖ Hide Footer
        </button>
      </div>

      {/* Background Glow Effects */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-14 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Brand Section */}
          <div className="md:col-span-2 lg:col-span-1 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img 
                  src="/img/logo.PNG" 
                  alt="CaptionCrafter Logo" 
                  className="h-10 w-auto rounded-lg shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "/logo.png";
                    target.className = "h-10 w-10";
                  }}
                />
                <span className="text-2xl font-extrabold text-white tracking-wide drop-shadow-md">
                  CaptionCrafter
                </span>
              </div>
              <p className="text-white/80 leading-relaxed">
                Unleash your words, inspire the world. Create and share the perfect captions for every moment.
              </p>

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                {[Twitter, Instagram, Github].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full 
                               bg-white/10 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links, Categories, Support */}
          <div className="md:col-span-2 lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-white/90">
              
              {/* Quick Links */}
              <div>
                <h3 className="font-semibold text-white text-lg mb-4 border-l-4 border-cyan-400 pl-3">
                  Quick Links
                </h3>
                <ul className="space-y-2">
                  {["Home", "Explore", "Categories", "Trending"].map((text, i) => (
                    <li key={i}>
                      <Link
                        to={`/${text.toLowerCase()}`}
                        className="hover:text-cyan-400 transition-colors duration-300"
                      >
                        {text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-semibold text-white text-lg mb-4 border-l-4 border-green-400 pl-3">
                  Categories
                </h3>
                <ul className="space-y-2">
                  {["Motivational", "Funny", "Attitude", "Instagram"].map((text, i) => (
                    <li key={i}>
                      <Link
                        to={`/category/${text}`}
                        className="hover:text-green-400 transition-colors duration-300"
                      >
                        {text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="font-semibold text-white text-lg mb-4 border-l-4 border-pink-400 pl-3">
                  Support
                </h3>
                <ul className="space-y-2">
                  {["Help Center", "Contact Us", "Privacy Policy", "Terms of Service"].map((text, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="hover:text-pink-400 transition-colors duration-300"
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

        {/* Bottom Bar */}
<div className="mt-12 px-4">
  <div className="rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 p-8 shadow-lg">
    <div className="flex flex-col items-center text-center space-y-4">

      {/* Developer Info */}
<div className="flex flex-col items-center space-y-0.5">
  <p className="text-white/80 text-sm tracking-wider uppercase">Developed by</p>
  <p className="text-cyan-400 font-bold text-xl drop-shadow-md">axzell Innovations</p>
</div>


      {/* Social Icons */}
      <div className="flex items-center space-x-5 mt-2">
        {[
          { icon: <Twitter className="h-5 w-5" />, link: "https://twitter.com/axzellinnovate", label: "Twitter" },
          { icon: <Instagram className="h-5 w-5" />, link: "https://www.instagram.com/axzellinnovations", label: "Instagram" },
          { icon: <Github className="h-5 w-5" />, link: "https://github.com/axzellinnovations", label: "GitHub" },
        ].map((social, i) => (
          <a
            key={i}
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300 transform hover:-translate-y-1 shadow-md"
          >
            {social.icon}
          </a>
        ))}
      </div>

      {/* Contact Info & Copyright */}
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-white/80">
          <a
            href="tel:+94768180977"
            className="flex items-center gap-1 hover:text-white transition-colors text-sm"
          >
            📞 +94 (76) 818-0977
          </a>
          <a
            href="mailto:social@axzellinnovations.com"
            className="flex items-center gap-1 hover:text-white transition-colors text-sm"
          >
            ✉️ social@axzellinnovations.com
          </a>
        </div>

        <p className="text-xs text-white/60 mt-4 md:mt-0">
          © 2025 Axzell Innovations. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</div>

      </div>
    </footer>
  );
};
