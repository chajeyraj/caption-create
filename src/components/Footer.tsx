import { Github, Twitter, Instagram, Heart, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
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

          {/* Quick Links */}
          <div>
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
          <div>
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
          <div>
            <h3 className="font-bold text-white text-lg mb-4 drop-shadow-sm">Support</h3>
            <div className="space-y-2">
              <a href="#" className="block text-white/90 hover:text-white transition-all duration-300 font-medium group">
                <span className="relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-px before:bg-white before:transition-all before:duration-300 group-hover:before:w-full">
                  Help Center
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
              <a href="#" className="block text-white/90 hover:text-white transition-all duration-300 font-medium group">
                <span className="relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-px before:bg-white before:transition-all before:duration-300 group-hover:before:w-full">
                  Contact Us
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-8 text-center">
          <p className="text-white/90">
            Made with <Heart className="inline h-4 w-4 text-red-500 mx-1 animate-pulse" /> by the CaptionCrafter Team
          </p>
          <p className="text-sm text-white/80 mt-2">
            © 2024 CaptionCrafter. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};