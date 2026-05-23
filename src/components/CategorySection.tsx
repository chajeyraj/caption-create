import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchCategoryCounts } from "@/utils/categoryCounts";
import { useInView } from "@/hooks/useInView";
import { CATEGORY_META } from "@/constants/categories";

const HOME_CATEGORIES = CATEGORY_META.slice(0, 6);

export const CategorySection = () => {
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gridRef, gridInView] = useInView<HTMLDivElement>({ threshold: 0.05 });
  console.log('[CategorySection] render — loading:', loading, 'error:', error, 'counts:', Object.keys(categoryCounts).length);

  useEffect(() => {
    const fetchCounts = async () => {
      console.log('[CategorySection] fetchCounts start');
      setLoading(true);
      setError(null);
      try {
        const counts = await fetchCategoryCounts();
        console.log('[CategorySection] counts fetched:', counts);
        setCategoryCounts(counts);
      } catch (err) {
        console.error('[CategorySection] fetchCounts error:', err);
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="relative overflow-hidden w-16 h-16 rounded-full bg-muted">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer-slide" />
                    </div>
                  </div>
                  <div className="relative overflow-hidden h-5 bg-muted rounded w-2/3 mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer-slide" />
                  </div>
                  <div className="space-y-2">
                    <div className="relative overflow-hidden h-3 bg-muted rounded w-full">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer-slide" />
                    </div>
                    <div className="relative overflow-hidden h-3 bg-muted rounded w-4/5 mx-auto">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer-slide" />
                    </div>
                  </div>
                  <div className="relative overflow-hidden h-3 bg-muted rounded w-1/3 mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer-slide" />
                  </div>
                  <div className="relative overflow-hidden h-9 bg-muted rounded w-full">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer-slide" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-destructive py-12">{error}</div>
        ) : (
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {HOME_CATEGORIES.map((category, index) => {
              const Icon = category.icon;
              const count = categoryCounts[category.name] || 0;
              return (
                <Card
                  key={category.name}
                  className={`group cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${category.bg} border border-gray-100 dark:border-gray-700/50 shadow-sm will-change-transform ${gridInView ? 'animate-scale-in' : ''}`}
                  style={{ animationDelay: `${Math.min(index, 4) * 0.08}s` } as React.CSSProperties}
                >
                  <CardContent className="p-8 text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${category.gradient} mb-6 group-hover:scale-110 group-hover:animate-wobble transition-all duration-300 shadow-md`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-foreground/90 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground/90 dark:text-muted-foreground/80 mb-2 leading-relaxed text-sm">
                      {category.description}
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">{count} captions</p>
                    <Link
                      to={`/category/${encodeURIComponent(category.name)}`}
                      className="group"
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      <Button variant="outline" className="w-full hover:border-primary hover:text-primary transition-colors">
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
