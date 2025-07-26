import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Smile, Star, Quote, Coffee, Book, Zap, Sun } from "lucide-react";
import { Link } from "react-router-dom";

import { useEffect, useState } from "react";
import { fetchCategoryCounts } from "@/utils/categoryCounts";

const categories = [
  {
    name: "Motivational",
    icon: Zap,
    color: "from-teal-500 to-emerald-500",
    description: "Inspire and get inspired"
  },
  {
    name: "Love & Romance",
    icon: Heart,
    color: "from-pink-500 to-red-500",
    description: "Express your feelings"
  },
  {
    name: "Funny",
    icon: Smile,
    color: "from-yellow-500 to-orange-500",
    description: "Bring smiles and laughter"
  },
  {
    name: "Success",
    icon: Star,
    color: "from-blue-500 to-cyan-500",
    description: "Celebrate achievements"
  },
  {
    name: "Life Quotes",
    icon: Quote,
    color: "from-green-500 to-teal-500",
    description: "Wisdom for daily life"
  },
  {
    name: "Coffee",
    icon: Coffee,
    color: "from-amber-600 to-yellow-500",
    description: "For coffee lovers"
  },
  {
    name: "Books",
    icon: Book,
    color: "from-cyan-500 to-teal-500",
    description: "Literary inspiration"
  },
  {
    name: "Good Morning",
    icon: Sun,
    color: "from-orange-500 to-pink-500",
    description: "Start your day right"
  },
  {
    name: "தமிழ்",
    icon: Quote,
    color: "from-red-500 to-orange-500",
    description: "Tamil quotes and wisdom"
  }
];

const Categories = () => {
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
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Browse Categories
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Find the perfect caption for every moment and mood
            </p>
          </div>

          {/* Loading/Error States */}
          {loading ? (
            <div className="text-center py-12">Loading categories...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-12">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {categories.map((category, index) => {
                const Icon = category.icon;
                const count = categoryCounts[category.name] || 0;
                return (
                  <Link 
                    key={category.name}
                    to={`/category/${encodeURIComponent(category.name)}`}
                    className="block"
                  >
                    <Card 
                      className={`group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg overflow-hidden animate-fade-in`}
                      style={{animationDelay: `${index * 100}ms`}}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${category.color.replace('to-', 'to-').replace('from-', 'from-')} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                      <CardContent className="p-6 text-center relative z-10">
                        <div 
                          className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-md`}
                        >
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {category.description}
                        </p>
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/80 dark:bg-black/20 text-foreground/80">
                          {count} {count === 1 ? 'caption' : 'captions'}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Categories;