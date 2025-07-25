import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Heart, Smile, Zap, Camera, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    icon: Heart,
    title: "Motivational",
    description: "Inspire yourself and others with powerful words",
    count: "1.2K captions",
    gradient: "from-red-400 to-pink-500",
  },
  {
    icon: Smile,
    title: "Funny",
    description: "Bring laughter to your social media feeds",
    count: "980 captions",
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    icon: Zap,
    title: "Attitude",
    description: "Show your confidence and personality",
    count: "850 captions",
    gradient: "from-purple-400 to-indigo-500",
  },
  {
    icon: Camera,
    title: "Instagram",
    description: "Perfect captions for your Instagram posts",
    count: "2.1K captions",
    gradient: "from-pink-400 to-purple-500",
  },
  {
    icon: MessageSquare,
    title: "WhatsApp About",
    description: "Express yourself in your status",
    count: "670 captions",
    gradient: "from-green-400 to-teal-500",
  },
  {
    icon: Lightbulb,
    title: "Blog Slogans",
    description: "Catchy phrases for your brand",
    count: "340 captions",
    gradient: "from-blue-400 to-cyan-500",
  },
];

export const CategorySection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Explore by Category
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find the perfect caption for every occasion and platform
          </p>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card 
                key={category.title}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-card bg-card/50 backdrop-blur-sm border-border/50 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${category.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {category.description}
                  </p>
                  
                  <p className="text-sm text-primary font-medium mb-6">
                    {category.count}
                  </p>
                  
                  <Link to={`/category/${encodeURIComponent(category.title)}`}>
                    <Button variant="outline" className="w-full group-hover:border-primary group-hover:text-primary transition-colors">
                      Browse Captions
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};