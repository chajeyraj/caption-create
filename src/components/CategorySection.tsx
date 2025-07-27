import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Heart, Smile, Zap, Camera, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";

import { useEffect, useState } from "react";
import { fetchCategoryCounts } from "@/utils/categoryCounts";

const categories = [
  {
    icon: Heart,
    title: "Motivational",
    description: "Inspire yourself and others with powerful words",
    gradient: "from-red-400 to-pink-500",
    bg: "bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/10"
  },
  {
    icon: Smile,
    title: "Funny",
    description: "Bring laughter to your social media feeds",
    gradient: "from-yellow-400 to-orange-500",
    bg: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10"
  },
  {
    icon: Zap,
    title: "Attitude",
    description: "Show your confidence and personality",
    gradient: "from-teal-400 to-emerald-500",
    bg: "bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/10"
  },
  {
    icon: Camera,
    title: "Instagram",
    description: "Perfect captions for your Instagram posts",
    gradient: "from-cyan-400 to-teal-500",
    bg: "bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/10"
  },
  {
    icon: MessageSquare,
    title: "WhatsApp About",
    description: "Express yourself in your status",
    gradient: "from-green-400 to-teal-500",
    bg: "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/10"
  },
  {
    icon: Lightbulb,
    title: "Blog Slogans",
    description: "Catchy phrases for your brand",
    gradient: "from-purple-400 to-cyan-500",
    bg: "bg-gradient-to-br from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/10"
  },
];

export const CategorySection = () => {
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      setError(null);
      try {
        const counts = await fetchCategoryCounts();
        setCategoryCounts(counts);
      } catch (err) {
        setError("Failed to load category counts.");
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

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

        {/* Loading/Error States */}
        {loading ? (
          <div className="text-center py-12">Loading categories...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => {
              const Icon = category.icon;
              const count = categoryCounts[category.title] || 0;
              return (
                <Card 
                  key={category.title}
                  className={`group cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${category.bg} border border-gray-100 dark:border-gray-700/50 shadow-sm animate-scale-in`}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)'
                  } as React.CSSProperties}
                >
                  <CardContent className="p-8 text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${category.gradient} mb-6 group-hover:scale-110 transition-all duration-300 shadow-md`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-foreground/90 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-muted-foreground/90 dark:text-muted-foreground/80 mb-4 leading-relaxed text-sm">
                      {category.description}
                    </p>
                    <p className="text-sm font-medium mb-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/80 dark:bg-gray-800/80 text-foreground/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/30">
                        {count} captions
                      </span>
                    </p>
                    <Link to={`/category/${encodeURIComponent(category.title)}`} className="group">
                      <Button variant="outline" className="w-full hover:border-blue-600 hover:text-blue-600 transition-colors group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20">
                        Browse Captions
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};