import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { CaptionCard } from "./CaptionCard";
import { Button } from "@/components/ui/button";
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
  console.log('[FeaturedSection] render — loading:', loading, 'captions:', captions.length, 'user:', user?.email ?? 'none');

  useEffect(() => {
    let isMounted = true;

    const fetchFeaturedCaptions = async () => {
      console.log('[FeaturedSection] fetchFeaturedCaptions start — user:', user?.id ?? 'none');
      try {
        setLoading(true);

        const selectFields = "id, content, category, user_id";
        const likesAvailable = areLikesSupported();

        const { data, error } = await supabase
          .from("captions")
          .select(selectFields)
          .order(likesAvailable ? "likes" : "created_at", { ascending: false })
          .limit(6);

        console.log('[FeaturedSection] captions fetch result — count:', data?.length ?? 0, 'error:', error);
        let captionsData = data ?? [];

        if (error) {
          const handled = markLikesFeatureUnavailable(error);

          if (handled) {
            const { data: fallbackData, error: fallbackError } = await supabase
              .from("captions")
              .select(selectFields)
              .order("created_at", { ascending: false })
              .limit(6);

            if (fallbackError) {
              console.error("Error fetching featured captions (fallback):", fallbackError);
              return;
            }

            captionsData = fallbackData ?? [];
          } else {
            console.error("Error fetching featured captions:", error);
            return;
          }
        }

        const captionsRows = captionsData as Array<{
          id: string;
          content: string;
          category: string | null;
          user_id: string;
        }>;

        const captionIds = captionsRows.map((caption) => caption.id);

        let likedCaptionIds: string[] = [];
        let likeCounts: Record<string, number> = {};

        try {
          const metadataResults = await Promise.all([
            fetchUserLikedCaptionIds(
              user?.id,
              captionIds,
            ),
            fetchCaptionLikeCounts(captionIds),
          ]);
          likedCaptionIds = metadataResults[0] ?? [];
          likeCounts = metadataResults[1] ?? {};
        } catch (metadataError) {
          markLikesFeatureUnavailable(metadataError as PostgrestError | null);
          console.error("[Likes] Failed to load featured metadata, defaulting counts", metadataError);
          likedCaptionIds = [];
          likeCounts = {};
        }

        const userIds = captionsRows.map((caption) => caption.user_id).filter(Boolean);
        const profilesMap = new Map<string, { display_name?: string | null; email?: string | null; avatar_url?: string | null }>();

        if (userIds.length > 0) {
          const { data: profilesData, error: profilesError } = await supabase
            .from("profiles")
            .select("user_id, display_name, email, avatar_url")
            .in("user_id", userIds);

          if (profilesError) {
            console.error("Error fetching profiles for featured captions:", profilesError);
          } else {
            profilesData?.forEach((profile) => {
              profilesMap.set(profile.user_id, {
                display_name: profile.display_name,
                email: profile.email,
                avatar_url: profile.avatar_url,
              });
            });
          }
        }

        if (!isMounted) {
          return;
        }

        const featured = captionsRows.map<FeaturedCaption>((caption) => {
          const profile = profilesMap.get(caption.user_id);

          return {
            id: caption.id,
            caption: caption.content,
            category: caption.category || "General",
            likes: likeCounts[caption.id] ?? 0,
            author: profile?.display_name || profile?.email || "Anonymous",
            authorAvatar: profile?.avatar_url || null,
            isLiked: likedCaptionIds.includes(caption.id),
          };
        });

        const sortedFeatured = [...featured].sort((a, b) => {
          if (b.likes !== a.likes) {
            return b.likes - a.likes;
          }
          return a.caption.localeCompare(b.caption);
        });

        console.log('[FeaturedSection] setCaptions with', sortedFeatured.length, 'items');
        setCaptions(sortedFeatured);
      } catch (error) {
        console.error('[FeaturedSection] fetch error:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFeaturedCaptions();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const handleLikeUpdate = (id: string, newLikeCount: number, isLiked: boolean) => {
    setCaptions((prev) =>
      prev.map((caption) =>
        caption.id === id
          ? {
              ...caption,
              likes: newLikeCount,
              isLiked,
            }
          : caption,
      ),
    );
  };

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
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`featured-skeleton-${index}`}
                className="relative overflow-hidden h-[220px] rounded-xl bg-muted/40"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer-slide" />
              </div>
            ))
          ) : captions.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground">
              No featured captions yet. Be the first to like a caption!
            </div>
          ) : (
            captions.map((caption, index) => (
              <div
                key={caption.id}
                className={`will-change-transform ${gridInView ? 'animate-scale-in' : 'opacity-0'}`}
                style={{ animationDelay: `${Math.min(index, 4) * 0.08}s` }}
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
          <Link 
            to="/explore"
            onClick={() => {
              // Scroll to top when navigating to explore
              window.scrollTo(0, 0);
            }}
          >
            <Button variant="gradient" size="lg" className="group">
              Explore All Captions
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
