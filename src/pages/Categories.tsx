import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

import { useEffect, useState } from "react";
import { fetchCategoryCounts } from "@/utils/categoryCounts";
import { CATEGORY_META } from "@/constants/categories";

const Categories = () => {
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Browse Categories — CaptionCrafter";
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
              {CATEGORY_META.map((category, index) => {
                const Icon = category.icon;
                const count = categoryCounts[category.name] || 0;
                return (
                  <Link
                    key={category.name}
                    to={`/category/${encodeURIComponent(category.name)}`}
                    className="block"
                  >
                    <Card
                      className={`group cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg overflow-hidden animate-fade-in will-change-transform`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                      <CardContent className="p-6 text-center relative z-10">
                        <div
                          className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${category.gradient} flex items-center justify-center group-hover:scale-110 group-hover:animate-wobble transition-all duration-300 shadow-md`}
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
