import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchCategoryCounts } from "@/utils/categoryCounts";
import { useInView } from "@/hooks/useInView";
import { CATEGORY_META } from "@/constants/categories";
import { ArrowRight } from "lucide-react";

const HOME_CATEGORIES = CATEGORY_META.slice(0, 6);

export const CategorySection = () => {
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gridRef, gridInView] = useInView<HTMLDivElement>({ threshold: 0.05 });

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      setError(null);
      try {
        const counts = await fetchCategoryCounts();
        setCategoryCounts(counts);
      } catch {
        setError("Failed to load category counts.");
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: 'hsl(235, 22%, 8%)' }}
    >
      {/* Separator */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, hsl(271 60% 65% / 0.25), transparent)' }}
      />

      <div className="container mx-auto px-4 relative z-10">

        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2
            className="font-display font-bold mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: 'hsl(40, 20%, 92%)' }}
          >
            Explore by Category
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'hsl(260, 8%, 55%)' }}>
            Find the perfect caption for every occasion and platform
          </p>
        </div>

        {/* Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-2xl p-6 flex flex-col items-center gap-4"
                style={{
                  background: 'hsl(235, 18%, 10%)',
                  border: '1px solid hsl(240, 12%, 18%)',
                  height: '220px',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-shimmer-slide" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12" style={{ color: 'hsl(0, 72%, 55%)' }}>{error}</div>
        ) : (
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {HOME_CATEGORIES.map((category, index) => {
              const Icon = category.icon;
              const count = categoryCounts[category.name] || 0;

              return (
                <Link
                  key={category.name}
                  to={`/category/${encodeURIComponent(category.name)}`}
                  onClick={() => window.scrollTo(0, 0)}
                  className={`group block will-change-transform ${gridInView ? 'animate-scale-in' : 'opacity-0'}`}
                  style={{ animationDelay: `${Math.min(index, 5) * 0.07}s` }}
                >
                  <div
                    className="relative overflow-hidden rounded-2xl p-6 transition-all duration-300 cursor-pointer"
                    style={{
                      background: 'hsl(235, 18%, 10%)',
                      border: '1px solid hsl(240, 12%, 18%)',
                      boxShadow: '0 4px 20px hsl(0 0% 0% / 0.25)',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.transform = 'translateY(-4px) scale(1.01)';
                      el.style.boxShadow = '0 16px 48px hsl(0 0% 0% / 0.45), 0 0 0 1px hsl(240, 12%, 24%)';
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.transform = 'translateY(0) scale(1)';
                      el.style.boxShadow = '0 4px 20px hsl(0 0% 0% / 0.25)';
                    }}
                  >
                    {/* Icon badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br ${category.gradient} shadow-md transition-all duration-300 group-hover:scale-110 group-hover:animate-wobble`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>

                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{
                          background: 'hsl(40 20% 92% / 0.06)',
                          color: 'hsl(260, 8%, 52%)',
                          border: '1px solid hsl(40 20% 92% / 0.09)',
                        }}
                      >
                        {count} captions
                      </span>
                    </div>

                    {/* Name & description */}
                    <h3
                      className="font-display font-semibold text-lg mb-1.5 transition-colors duration-200"
                      style={{ color: 'hsl(40, 20%, 88%)' }}
                    >
                      {category.name}
                    </h3>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: 'hsl(260, 8%, 50%)' }}>
                      {category.description}
                    </p>

                    {/* Browse row */}
                    <div
                      className="flex items-center gap-1.5 text-sm font-medium transition-colors duration-200"
                      style={{ color: 'hsl(38, 90%, 56%)' }}
                    >
                      Browse Captions
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
