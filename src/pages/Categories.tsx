import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { VLink } from "@/components/VLink";
import { fetchCategoryCounts } from "@/utils/categoryCounts";
import { CATEGORY_META } from "@/constants/categories";
import { ArrowRight } from "lucide-react";

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
        setCategoryCounts(await fetchCategoryCounts());
      } catch {
        setError("Failed to load category counts.");
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--background))' }}>
      <Navbar />

      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">

          {/* Header */}
          <div className="text-center mb-10 sm:mb-14">
            <h1
              className="font-display font-bold mb-3"
              style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', color: 'hsl(var(--foreground))' }}
            >
              Browse Categories
            </h1>
            <p className="text-sm sm:text-lg max-w-2xl mx-auto" style={{ color: 'hsl(var(--muted-foreground))' }}>
              Find the perfect caption for every moment and mood
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-2xl"
                  style={{ height: '160px', background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-shimmer-slide" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12" style={{ color: 'hsl(var(--destructive))' }}>{error}</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
              {CATEGORY_META.map((category, index) => {
                const Icon = category.icon;
                const count = categoryCounts[category.name] || 0;

                return (
                  <VLink
                    key={category.name}
                    to={`/category/${encodeURIComponent(category.name)}`}
                    onClick={() => window.scrollTo(0, 0)}
                    className="group block"
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <div
                      className="relative overflow-hidden rounded-2xl p-3 sm:p-6 transition-all duration-300 cursor-pointer h-full"
                      style={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        boxShadow: '0 4px 20px hsl(var(--foreground) / 0.06)',
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLDivElement;
                        el.style.transform = 'translateY(-4px) scale(1.01)';
                        el.style.boxShadow = '0 16px 48px hsl(var(--foreground) / 0.12), 0 0 0 1px hsl(var(--border))';
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLDivElement;
                        el.style.transform = 'translateY(0) scale(1)';
                        el.style.boxShadow = '0 4px 20px hsl(var(--foreground) / 0.06)';
                      }}
                    >
                      {/* Icon + count */}
                      <div className="flex items-start justify-between mb-2 sm:mb-4">
                        <div
                          className={`inline-flex items-center justify-center h-9 w-9 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br ${category.gradient} shadow-md transition-all duration-300 group-hover:scale-110 group-hover:animate-wobble`}
                        >
                          <Icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <span
                          className="text-[10px] sm:text-xs font-medium px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full"
                          style={{
                            background: 'hsl(var(--muted))',
                            color: 'hsl(var(--muted-foreground))',
                            border: '1px solid hsl(var(--border))',
                          }}
                        >
                          {count}
                          <span className="hidden sm:inline"> captions</span>
                        </span>
                      </div>

                      <h3
                        className="font-display font-semibold text-sm sm:text-lg mb-1 sm:mb-1.5 transition-colors duration-200"
                        style={{ color: 'hsl(var(--foreground))' }}
                      >
                        {category.name}
                      </h3>
                      <p className="hidden sm:block text-sm leading-relaxed mb-4" style={{ color: 'hsl(var(--muted-foreground))' }}>
                        {category.description}
                      </p>

                      <div
                        className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium transition-colors duration-200 mt-2 sm:mt-0"
                        style={{ color: 'hsl(var(--primary))' }}
                      >
                        <span className="hidden sm:inline">Browse Captions</span>
                        <span className="sm:hidden">Browse</span>
                        <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </VLink>
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
