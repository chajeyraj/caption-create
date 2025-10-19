import { CaptionCard } from "./CaptionCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Flame } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const featuredCaptions = [
  {
    id: "caption-1",
    caption: "Dreams don't work unless you do. Make every moment count and turn your aspirations into achievements.",
    author: "Sarah",
    category: "Motivational",
    likes: 11,
    isLiked: false,
  },
  {
    id: "caption-2",
    caption: "Life is short. Smile while you still have teeth and make every day a little brighter.",
    author: " shanjeevan",
    category: "Funny",
    likes: 15,
    isLiked: true,
  },
  {
    id: "caption-3",
    caption: "Confidence level: Selfie with no filter. Embracing authenticity in a filtered world.",
    author: "harindu",
    category: "Attitude",
    likes: 31,
    isLiked: false,
  },
  {
    id: "caption-4",
    caption: "Collecting moments, not things. Every sunset is a reminder that endings can be beautiful too.",
    author: "fadhil",
    category: "Instagram",
    likes: 26,
    isLiked: false,
  },
  {
    id: "caption-5",
    caption: "Be yourself; everyone else is already taken. Your uniqueness is your superpower.",
    author: "josuva",
    category: "WhatsApp About",
    likes: 20,
    isLiked: true,
  },
  {
    id: "caption-6",
    caption: "Coffee first, adulting second. Some days you need a little more fuel for the journey.",
    author: "divya",
    category: "Funny",
    likes: 17,
    isLiked: false,
  },
];

export const FeaturedSection = () => {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-primary text-white text-sm font-medium mb-4">
            <Flame className="h-4 w-4 mr-2" />
            Trending Now
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Featured Captions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the most loved captions from our community of creators
          </p>
        </div>

        {/* Caption grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredCaptions.map((caption, index) => (
            <div 
              key={index}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CaptionCard {...caption} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center animate-fade-in">
          <Link 
            to="/explore"
            onClick={() => {
              // Scroll to top when navigating to explore
              window.scrollTo(0, 0);
            }}
          >
            <Button variant="gradient" size="lg" className="group">
              Explore All Captions
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};