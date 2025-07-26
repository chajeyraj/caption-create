import { Github, Twitter, Instagram, Heart, BookOpen } from "lucide-react";
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
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white drop-shadow-md">
                  CaptionCrafter
                </span>
              </div>
              <p className="text-white/90 drop-shadow-sm">
                Unleash your words, inspire the world. Create and share the perfect captions for every moment.
              </p>
              <div className="flex items-center space-x-4">
                <a href="#" className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-0.5">
                  <Twitter className="h-4 w-4 text-white/90 group-hover:text-white transition-colors duration-300" />
                </a>
                <a href="#" className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-0.5">
                  <Instagram className="h-4 w-4 text-white/90 group-hover:text-white transition-colors duration-300" />
                </a>
                <a href="#" className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-0.5">
                  <Github className="h-4 w-4 text-white/90 group-hover:text-white transition-colors duration-300" />
                </a>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="font-bold text-white text-lg mb-4 drop-shadow-sm">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-white/90 hover:text-white transition-all duration-300 font-medium group">
                <span className="relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-px before:bg-white before:transition-all before:duration-300 group-hover:before:w-full">
                  Home
                </span>
              </Link>
              <Link to="/explore" className="block text-white/90 hover:text-white transition-all duration-300 font-medium group">
                <span className="relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-px before:bg-white before:transition-all before:duration-300 group-hover:before:w-full">
                  Explore
                </span>
              </Link>
              <Link to="/categories" className="block text-white/90 hover:text-white transition-all duration-300 font-medium group">
                <span className="relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-px before:bg-white before:transition-all before:duration-300 group-hover:before:w-full">
                  Categories
                </span>
              </Link>
              <Link to="/trending" className="block text-white/90 hover:text-white transition-all duration-300 font-medium group">
                <span className="relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-px before:bg-white before:transition-all before:duration-300 group-hover:before:w-full">
                  Trending
                </span>
              </Link>
            </div>
          </div>
          
          {/* Categories */}
          <div className="space-y-6">
            <h3 className="font-bold text-white text-lg mb-4 drop-shadow-sm">Categories</h3>
            <div className="space-y-2">
              <Link to="/category/Motivational" className="block text-white/90 hover:text-white transition-all duration-300 font-medium group">
                <span className="relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-px before:bg-white before:transition-all before:duration-300 group-hover:before:w-full">
                  Motivational
                </span>
              </Link>
              <Link to="/category/Funny" className="block text-white/90 hover:text-white transition-all duration-300 font-medium group">
                <span className="relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-px before:bg-white before:transition-all before:duration-300 group-hover:before:w-full">
                  Funny
                </span>
              </Link>
              <Link to="/category/Attitude" className="block text-white/90 hover:text-white transition-all duration-300 font-medium group">
                <span className="relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-px before:bg-white before:transition-all before:duration-300 group-hover:before:w-full">
                  Attitude
                </span>
              </Link>
              <Link to="/category/Instagram" className="block text-white/90 hover:text-white transition-all duration-300 font-medium group">
                <span className="relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-px before:bg-white before:transition-all before:duration-300 group-hover:before:w-full">
                  Instagram
                </span>
              </Link>
            </div>
          </div>
          
          {/* Support */}
          <div className="space-y-6">
            <h3 className="font-bold text-white text-lg mb-4 drop-shadow-sm">Support</h3>
            <div className="space-y-2">
              <a href="#" className="block text-white/90 hover:text-white transition-all duration-300 font-medium group">
                <span className="relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-px before:bg-white before:transition-all before:duration-300 group-hover:before:w-full">
                  Help Center
                </span>
              </a>
              <a href="#" className="block text-white/90 hover:text-white transition-all duration-300 font-medium group">
                <span className="relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-px before:bg-white before:transition-all before:duration-300 group-hover:before:w-full">
                  Contact Us
                </span>
              </a>
              <a href="#" className="block text-white/90 hover:text-white transition-all duration-300 font-medium group">
                <span className="relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-px before:bg-white before:transition-all before:duration-300 group-hover:before:w-full">
                  Privacy Policy
                </span>
              </a>
              <a href="#" className="block text-white/90 hover:text-white transition-all duration-300 font-medium group">
                <span className="relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-px before:bg-white before:transition-all before:duration-300 group-hover:before:w-full">
                  Terms of Service
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-16 pt-8">
          <div className="flex flex-col items-center text-center">
            <p className="text-white/90">Developed by</p>
            <p className="text-blue-800 font-medium text-lg mb-6">axzell innovations</p>
            
            <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex items-center gap-6">
                  <a href="tel:+94768180977" className="text-white/80 hover:text-white transition-colors flex items-center text-sm">
                    <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    +94 (76) 818-0977
                  </a>
                  <a href="mailto:social@axzellinnovations.com" className="text-white/80 hover:text-white transition-colors flex items-center text-sm">
                    <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    social@axzellinnovations.com
                  </a>
                </div>
                
                <div className="flex items-center space-x-4">
                  <a href="https://twitter.com/axzellinnovate" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                    <span className="sr-only">Twitter</span>
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="https://www.instagram.com/axzellinnovations" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                    <span className="sr-only">Instagram</span>
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="https://github.com/axzellinnovations" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                    <span className="sr-only">GitHub</span>
                    <Github className="h-5 w-5" />
                  </a>
                  <a href="https://www.linkedin.com/company/axzell-innovations" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
              
              <p className="text-sm text-white/80">
                &copy; 2025 axzell innovations. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};