import { Github, Twitter, Instagram, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-gradient-hero relative overflow-hidden mt-auto">
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>
      <div className="container mx-auto px-4 py-12 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Brand Section */}
          <div className="md:col-span-2 lg:col-span-1 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img 
                  src="/src/components/img/logo.PNG" 
                  alt="CaptionCrafter Logo" 
                  className="h-8 w-auto"
                  onError={(e) => {
                    // Fallback in case the image fails to load
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "/logo.png";
                    target.className = "h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500";
                  }}
                />
                <span className="text-xl font-bold text-white drop-shadow-md">
                  CaptionCrafter
                </span>
              </div>
              <p className="text-white/90 drop-shadow-sm">
                Unleash your words, inspire the world. Create and share the perfect captions for every moment.
              </p>
              <div className="flex items-center space-x-4">
                <a href="#" className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-0.5">
                  <Twitter className="h-4 w-4 text-white/90" />
                </a>
                <a href="#" className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-0.5">
                  <Instagram className="h-4 w-4 text-white/90" />
                </a>
                <a href="#" className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-0.5">
                  <Github className="h-4 w-4 text-white/90" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links, Categories, Support */}
          <div className="md:col-span-2 lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-white/90">
              
              {/* Quick Links */}
              <div>
                <h3 className="font-bold text-white text-lg mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  {["Home", "Explore", "Categories", "Trending"].map((text, i) => (
                    <li key={i}>
                      <Link
                        to={`/${text.toLowerCase()}`}
                        className="transition-colors duration-300 hover:text-cyan-400"
                      >
                        {text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-bold text-white text-lg mb-4">Categories</h3>
                <ul className="space-y-2">
                  {["Motivational", "Funny", "Attitude", "Instagram"].map((text, i) => (
                    <li key={i}>
                      <Link
                        to={`/category/${text}`}
                        className="transition-colors duration-300 hover:text-green-400"
                      >
                        {text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="font-bold text-white text-lg mb-4">Support</h3>
                <ul className="space-y-2">
                  {["Help Center", "Contact Us", "Privacy Policy", "Terms of Service"].map((text, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="transition-colors duration-300 hover:text-pink-400"
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
        <div className="mt-10 px-4">
          <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/20 p-6 pt-0 md:p-8 md:pt-0">
            <div className="flex flex-col items-center text-center">
              <p className="text-white/90">Developed by</p>
              <p className="text-blue-800 font-medium text-lg mb-6">axzell innovations</p>

              <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="flex items-center gap-6">
                    <a href="tel:+94768180977" className="text-white/80 hover:text-white text-sm flex items-center">
                      📞 +94 (76) 818-0977
                    </a>
                    <a href="mailto:social@axzellinnovations.com" className="text-white/80 hover:text-white text-sm flex items-center">
                      ✉️ social@axzellinnovations.com
                    </a>
                  </div>
                  <div className="flex items-center space-x-4">
                    <a href="https://twitter.com/axzellinnovate" className="text-white/80 hover:text-white">
                      <Twitter className="h-5 w-5" />
                    </a>
                    <a href="https://www.instagram.com/axzellinnovations" className="text-white/80 hover:text-white">
                      <Instagram className="h-5 w-5" />
                    </a>
                    <a href="https://github.com/axzellinnovations" className="text-white/80 hover:text-white">
                      <Github className="h-5 w-5" />
                    </a>
                    <a href="https://www.linkedin.com/company/axzell-innovations" className="text-white/80 hover:text-white">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761..."/>
                      </svg>
                    </a>
                  </div>
                </div>

                <p className="text-sm text-white/80 mt-4 md:mt-0">
                  &copy; 2025 axzell innovations. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>


      </div>
    </footer>
  );
};
