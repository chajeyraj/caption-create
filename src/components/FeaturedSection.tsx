import { CaptionCard } from "./CaptionCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Flame } from "lucide-react";

const featuredCaptions = [
  {
    caption: "Dreams don't work unless you do. Make every moment count and turn your aspirations into achievements.",
    author: "Sarah Miller",
    category: "Motivational",
    likes: 245,
    isLiked: false,
  },
  {
    caption: "Life is short. Smile while you still have teeth and make every day a little brighter.",
    author: "Mike Johnson",
    category: "Funny",
    likes: 189,
    isLiked: true,
  },
  {
    caption: "Confidence level: Selfie with no filter. Embracing authenticity in a filtered world.",
    author: "Emma Davis",
    category: "Attitude",
    likes: 312,
    isLiked: false,
  },
  {
    caption: "Collecting moments, not things. Every sunset is a reminder that endings can be beautiful too.",
    author: "Alex Chen",
    category: "Instagram",
    likes: 156,
    isLiked: false,
  },
  {
    caption: "Be yourself; everyone else is already taken. Your uniqueness is your superpower.",
    author: "Luna Rodriguez",
    category: "WhatsApp About",
    likes: 203,
    isLiked: true,
  },
  {
    caption: "Coffee first, adulting second. Some days you need a little more fuel for the journey.",
    author: "David Park",
    category: "Funny",
    likes: 167,
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
          <Button variant="gradient" size="lg" className="group">
            Explore All Captions
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};