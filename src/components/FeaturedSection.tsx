import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { CaptionCard } from "./CaptionCard";
import { ArrowRight, Flame } from "lucide-react";
import { Link } from "react-router-dom";
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

export const FeaturedSection = () => {
  const { user } = useAuth();
  const [captions, setCaptions] = useState<FeaturedCaption[]>([]);
  const [loading, setLoading] = useState(true);
  const [gridRef, gridInView] = useInView<HTMLDivElement>({ threshold: 0.05 });

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
              .from("captions")
              .select(selectFields)
              .order("created_at", { ascending: false })
              .limit(6);
            if (fallbackError) { console.error("Error fetching featured captions (fallback):", fallbackError); return; }
            captionsData = fallbackData ?? [];
          } else {
            console.error("Error fetching featured captions:", error);
            return;
          }
        }

        const captionsRows = captionsData as Array<{ id: string; content: string; category: string | null; user_id: string }>;
        const captionIds = captionsRows.map((c) => c.id);

        let likedCaptionIds: string[] = [];
        let likeCounts: Record<string, number> = {};
        try {
          const [liked, counts] = await Promise.all([
            fetchUserLikedCaptionIds(user?.id, captionIds),
            fetchCaptionLikeCounts(captionIds),
          ]);
          likedCaptionIds = liked ?? [];
          likeCounts = counts ?? {};
        } catch (metadataError) {
          markLikesFeatureUnavailable(metadataError as PostgrestError | null);
          likedCaptionIds = [];
          likeCounts = {};
        }

        const userIds = captionsRows.map((c) => c.user_id).filter(Boolean);
        const profilesMap = new Map<string, { display_name?: string | null; email?: string | null; avatar_url?: string | null }>();

        if (userIds.length > 0) {
          const { data: profilesData } = await supabase
            .from("profiles")
            .select("user_id, display_name, email, avatar_url")
            .in("user_id", userIds);
          profilesData?.forEach((p) => profilesMap.set(p.user_id, p));
        }

        if (!isMounted) return;

        const featured = captionsRows.map<FeaturedCaption>((c) => {
          const profile = profilesMap.get(c.user_id);
          return {
            id: c.id,
            caption: c.content,
            category: c.category || "General",
            likes: likeCounts[c.id] ?? 0,
            author: profile?.display_name || profile?.email || "Anonymous",
            authorAvatar: profile?.avatar_url || null,
            isLiked: likedCaptionIds.includes(c.id),
          };
        });

        const sorted = [...featured].sort((a, b) => b.likes - a.likes || a.caption.localeCompare(b.caption));
        setCaptions(sorted);
      } catch (error) {
        console.error('[FeaturedSection] fetch error:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFeaturedCaptions();
    return () => { isMounted = false; };
  }, [user?.id]);

  const handleLikeUpdate = (id: string, newLikeCount: number, isLiked: boolean) => {
    setCaptions((prev) =>
      prev.map((c) => c.id === id ? { ...c, likes: newLikeCount, isLiked } : c)
    );
  };

  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: 'hsl(232, 20%, 7%)' }}
    >
      {/* Subtle top separator glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, hsl(38 90% 54% / 0.3), transparent)' }}
      />

      <div className="container mx-auto px-4 relative z-10">

        {/* Section header */}
        <div className="text-center mb-16 animate-fade-in">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-5"
            style={{
              background: 'hsl(38 90% 54% / 0.1)',
              border: '1px solid hsl(38 90% 54% / 0.25)',
              color: 'hsl(38, 85%, 62%)',
            }}
          >
            <Flame className="h-3.5 w-3.5" />
            Trending Now
          </div>
          <h2
            className="font-display font-bold mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: 'hsl(40, 20%, 92%)' }}
          >
            Featured Captions
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'hsl(260, 8%, 55%)' }}>
            Discover the most loved captions from our community of creators
          </p>
        </div>

        {/* Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`sk-${i}`}
                className="relative overflow-hidden rounded-2xl"
                style={{
                  height: '220px',
                  background: 'hsl(235, 18%, 10%)',
                  border: '1px solid hsl(240, 12%, 18%)',
                  borderLeft: '3px solid hsl(240, 12%, 18%)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent animate-shimmer-slide" />
              </div>
            ))
          ) : captions.length === 0 ? (
            <div className="col-span-full text-center py-12" style={{ color: 'hsl(260, 8%, 45%)' }}>
              No featured captions yet. Be the first to like a caption!
            </div>
          ) : (
            captions.map((caption, index) => (
              <div
                key={caption.id}
                className={`will-change-transform ${gridInView ? 'animate-scale-in' : 'opacity-0'}`}
                style={{ animationDelay: `${Math.min(index, 5) * 0.07}s` }}
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
        <div className="text-center animate-fade-in">
          <Link to="/explore" onClick={() => window.scrollTo(0, 0)}>
            <button
              className="group inline-flex items-center gap-2.5 px-8 h-12 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, hsl(38, 90%, 54%), hsl(25, 90%, 58%))',
                color: 'hsl(232, 20%, 7%)',
                boxShadow: '0 4px 20px hsl(38 90% 54% / 0.3)',
              }}
            >
              Explore All Captions
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};
