import { Sparkles, Heart, Github, Twitter, Instagram } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-background border-t border-border/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                CaptionCrafter
              </span>
            </div>
            <p className="text-muted-foreground">
              Unleash your words, inspire the world. Create and share the perfect captions for every moment.
            </p>
            <div className="flex items-center space-x-4">
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Github className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Home</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Explore</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Categories</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Trending</a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Categories</h3>
            <div className="space-y-2">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Motivational</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Funny</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Attitude</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Instagram</a>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <div className="space-y-2">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Help Center</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Contact Us</a>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-8 text-center">
          <p className="text-muted-foreground">
            Made with <Heart className="inline h-4 w-4 text-red-500 mx-1" /> by the CaptionCrafter Team
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            © 2024 CaptionCrafter. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};