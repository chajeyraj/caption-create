import { useEffect, useState } from "react";
import { CaptionCard } from "./CaptionCard";
import { ArrowRight, Flame } from "lucide-react";
import { VLink } from "@/components/VLink";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { fetchUserLikedCaptionIds, areLikesSupported, markLikesFeatureUnavailable, fetchCaptionLikeCounts } from "@/utils/likes";
import type { PostgrestError } from "@supabase/supabase-js";

interface FeaturedCaption {
  id: string;
  caption: string;
  author: string;
  category: string;
  likes: number;
  isLiked: boolean;
  authorAvatar?: string | null;
}

/* Skeleton card that crossfades out once content loads */
const SkeletonCard = ({ loaded }: { loaded: boolean }) => (
  <div className="relative rounded-2xl overflow-hidden" style={{ height: '240px', background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderLeft: '3px solid hsl(var(--border))' }}>
    {/* Shimmer layer — crossfades out when loaded */}
    <div
      className={`skeleton-overlay absolute inset-0 ${loaded ? 'loaded' : ''}`}
      style={{ background: 'hsl(var(--card))' }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent animate-shimmer-slide" />
    </div>
  </div>
);

export const FeaturedSection = () => {
  const { user } = useAuth();
  const [captions, setCaptions] = useState<FeaturedCaption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchFeaturedCaptions = async () => {
      try {
        setLoading(true);
        const selectFields = "id, content, category, user_id";
        const likesAvailable = areLikesSupported();

        const { data, error } = await supabase
          .from("captions")
          .select(selectFields)
          .order(likesAvailable ? "likes" : "created_at", { ascending: false })
          .limit(6);

        let captionsData = data ?? [];

        if (error) {
          const handled = markLikesFeatureUnavailable(error);
          if (handled) {
            const { data: fallbackData, error: fallbackError } = await supabase
              .from("captions").select(selectFields).order("created_at", { ascending: false }).limit(6);
            if (fallbackError) { console.error(fallbackError); return; }
            captionsData = fallbackData ?? [];
          } else {
            console.error(error); return;
          }
        }

        const rows = captionsData as Array<{ id: string; content: string; category: string | null; user_id: string }>;
        const ids = rows.map((c) => c.id);

        let likedIds: string[] = [];
        let counts: Record<string, number> = {};
        try {
          [likedIds, counts] = await Promise.all([
            fetchUserLikedCaptionIds(user?.id, ids),
            fetchCaptionLikeCounts(ids),
          ]);
        } catch (e) {
          markLikesFeatureUnavailable(e as PostgrestError | null);
        }

        const userIds = rows.map((c) => c.user_id).filter(Boolean);
        const profilesMap = new Map<string, { display_name?: string | null; email?: string | null; avatar_url?: string | null }>();
        if (userIds.length > 0) {
          const { data: profiles } = await supabase.from("profiles")
            .select("user_id, display_name, email, avatar_url").in("user_id", userIds);
          profiles?.forEach((p) => profilesMap.set(p.user_id, p));
        }

        if (!isMounted) return;

        const featured = rows.map<FeaturedCaption>((c) => {
          const p = profilesMap.get(c.user_id);
          return {
            id: c.id, caption: c.content, category: c.category || "General",
            likes: counts[c.id] ?? 0,
            author: p?.display_name || p?.email || "Anonymous",
            authorAvatar: p?.avatar_url || null,
            isLiked: likedIds.includes(c.id),
          };
        });

        setCaptions([...featured].sort((a, b) => b.likes - a.likes || a.caption.localeCompare(b.caption)));
      } catch (e) {
        console.error('[FeaturedSection] fetch error:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFeaturedCaptions();
    return () => { isMounted = false; };
  }, [user?.id]);

  const handleLikeUpdate = (id: string, newLikeCount: number, isLiked: boolean) => {
    setCaptions((prev) => prev.map((c) => c.id === id ? { ...c, likes: newLikeCount, isLiked } : c));
  };

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden" style={{ background: 'hsl(var(--background))' }}>
      {/* Top separator */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.3), transparent)' }} />

      <div className="container mx-auto px-4 relative z-10">

        {/* Header — scroll-driven parallax */}
        <div className="text-center mb-10 sm:mb-16 parallax-section-header">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-5"
            style={{ background: 'hsl(var(--primary) / 0.1)', border: '1px solid hsl(var(--primary) / 0.25)', color: 'hsl(var(--primary))' }}
          >
            <Flame className="h-3.5 w-3.5" />
            Trending Now
          </div>
          <h2 className="font-display font-bold mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: 'hsl(var(--foreground))' }}>
            Featured Captions
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Discover the most loved captions from our community of creators
          </p>
        </div>

        {/* Grid — scroll-driven reveal on each card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-10 sm:mb-14">
          {loading ? (
            /* Crossfade skeletons */
            Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={`sk-${i}`} loaded={false} />
            ))
          ) : captions.length === 0 ? (
            <div className="col-span-full text-center py-12" style={{ color: 'hsl(var(--muted-foreground))' }}>
              No featured captions yet. Be the first to like a caption!
            </div>
          ) : (
            captions.map((caption, index) => (
              /* scroll-reveal — CSS handles the animation natively in Chrome 115+ */
              /* Falls back to visible (no animation) in other browsers */
              <div
                key={caption.id}
                className="scroll-reveal will-change-transform"
                style={{ '--stagger': index } as React.CSSProperties}
              >
                <CaptionCard
                  id={caption.id}
                  caption={caption.caption}
                  author={caption.author}
                  category={caption.category}
                  likes={caption.likes}
                  isLiked={caption.isLiked}
                  authorAvatar={caption.authorAvatar ?? undefined}
                  onLikeUpdate={handleLikeUpdate}
                />
              </div>
            ))
          )}
        </div>

        {/* CTA */}
        <div className="text-center scroll-reveal">
          <VLink to="/explore" onClick={() => window.scrollTo(0, 0)} className="w-full sm:w-auto inline-flex justify-center">
            <button
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 h-12 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
              style={{
                background: 'var(--gradient-primary)',
                color: 'hsl(var(--primary-foreground))',
                boxShadow: '0 4px 20px hsl(var(--primary) / 0.3)',
              }}
            >
              Explore All Captions
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </VLink>
        </div>
      </div>
    </section>
  );
};
