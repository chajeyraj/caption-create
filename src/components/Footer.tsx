import { Sparkles, Heart, Github, Twitter, Instagram } from "lucide-react";

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
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white drop-shadow-md">
                CaptionCrafter
              </span>
            </div>
            <p className="text-white/90 drop-shadow-sm">
              Unleash your words, inspire the world. Create and share the perfect captions for every moment.
            </p>
            <div className="flex items-center space-x-4">
              <Twitter className="h-5 w-5 text-white/90 hover:text-white cursor-pointer transition-colors hover:scale-110" />
              <Instagram className="h-5 w-5 text-white/90 hover:text-white cursor-pointer transition-colors hover:scale-110" />
              <Github className="h-5 w-5 text-white/90 hover:text-white cursor-pointer transition-colors hover:scale-110" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white text-lg mb-4 drop-shadow-sm">Quick Links</h3>
            <div className="space-y-2">
              <a href="#" className="block text-white/90 hover:text-white transition-colors font-medium hover:pl-1">Home</a>
              <a href="#" className="block text-white/90 hover:text-white transition-colors font-medium hover:pl-1">Explore</a>
              <a href="#" className="block text-white/90 hover:text-white transition-colors font-medium hover:pl-1">Categories</a>
              <a href="#" className="block text-white/90 hover:text-white transition-colors font-medium hover:pl-1">Trending</a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-white text-lg mb-4 drop-shadow-sm">Categories</h3>
            <div className="space-y-2">
              <a href="#" className="block text-white/90 hover:text-white transition-colors font-medium hover:pl-1">Motivational</a>
              <a href="#" className="block text-white/90 hover:text-white transition-colors font-medium hover:pl-1">Funny</a>
              <a href="#" className="block text-white/90 hover:text-white transition-colors font-medium hover:pl-1">Attitude</a>
              <a href="#" className="block text-white/90 hover:text-white transition-colors font-medium hover:pl-1">Instagram</a>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-white text-lg mb-4 drop-shadow-sm">Support</h3>
            <div className="space-y-2">
              <a href="#" className="block text-white/90 hover:text-white transition-colors font-medium hover:pl-1">Help Center</a>
              <a href="#" className="block text-white/90 hover:text-white transition-colors font-medium hover:pl-1">Privacy Policy</a>
              <a href="#" className="block text-white/90 hover:text-white transition-colors font-medium hover:pl-1">Terms of Service</a>
              <a href="#" className="block text-white/90 hover:text-white transition-colors font-medium hover:pl-1">Contact Us</a>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-8 text-center">
          <p className="text-white/90">
            Made with <Heart className="inline h-4 w-4 text-red-500 mx-1" /> by the CaptionCrafter Team
          </p>
          <p className="text-sm text-white/80 mt-2">
            © 2024 CaptionCrafter. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};