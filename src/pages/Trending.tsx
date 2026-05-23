import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { TrendingUp, Flame, Clock, Copy, Heart, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { useInView } from "@/hooks/useInView";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { fetchUserLikedCaptionIds, areLikesSupported, markLikesFeatureUnavailable, fetchCaptionLikeCounts } from "@/utils/likes";
import type { PostgrestError } from "@supabase/supabase-js";

type TrendType = "hot" | "rising" | "new";

interface TrendingCaption {
  id: string;
  title: string | null;
  caption: string;
  author: string;
  category: string;
  likes: number;
  isLiked: boolean;
  trend: TrendType;
  created_at: string;
  user_id: string;
}

interface CaptionRow {
  id: string;
  title: string | null;
  content: string;
  category: string | null;
  created_at: string;
  user_id: string;
  likes?: number | null;
}

const determineTrend = (likes: number, createdAt: string): TrendType => {
  const createdDate = new Date(createdAt);
  const hoursOld = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60);

  if (likes >= 75) return "hot";
  if (likes >= 25) return "rising";
  if (hoursOld <= 24) return "new";
  return "rising";
};

const Trending = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [captions, setCaptions] = useState<TrendingCaption[]>([]);
  const [loading, setLoading] = useState(true);
  console.log('[Trending] render — loading:', loading, 'captions:', captions.length, 'user:', user?.email ?? 'none');
  const [stats, setStats] = useState({
    hot: 0,
    rising: 0,
    new: 0
  });
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
  const [listRef, listInView] = useInView<HTMLDivElement>({ threshold: 0.05 });

  useEffect(() => {
    document.title = "Trending — CaptionCrafter";
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchCaptions = async () => {
      console.log('[Trending] fetchCaptions start — user:', user?.id ?? 'none');
      try {
        setLoading(true);

        const likesAvailable = areLikesSupported();
        console.log('[Trending] likesAvailable:', likesAvailable);
        const selectFields = likesAvailable
          ? "id, title, content, category, created_at, user_id, likes"
          : "id, title, content, category, created_at, user_id";

        const baseQuery = supabase.from("captions").select(selectFields);
        const orderedQuery = likesAvailable
          ? baseQuery.order("likes", { ascending: false }).order("created_at", { ascending: false })
          : baseQuery.order("created_at", { ascending: false });

        const { data: captionsDataRaw, error } = await orderedQuery.limit(20);
        console.log('[Trending] captions fetch result — count:', captionsDataRaw?.length ?? 0, 'error:', error);

        let captionList: CaptionRow[] = captionsDataRaw ?? [];

        if (error) {
          const handled = markLikesFeatureUnavailable(error);

          if (handled) {
            const { data: fallbackData, error: fallbackError } = await supabase
              .from("captions")
              .select("id, title, content, category, created_at, user_id")
              .order("created_at", { ascending: false })
              .limit(20);

            if (fallbackError) {
              console.error("Error fetching captions (fallback):", fallbackError);
              return;
            }

            captionList = fallbackData ?? [];
          } else {
            console.error("Error fetching captions:", error);
            return;
          }
        }
        const userIds = captionList.map((caption) => caption.user_id).filter(Boolean);
        let profilesData: { user_id: string; display_name: string | null; email: string | null }[] = [];

        if (userIds.length > 0) {
          const { data: profiles, error: profilesError } = await supabase
            .from("profiles")
            .select("user_id, display_name, email")
            .in("user_id", userIds);

          if (profilesError) {
            console.error("Error fetching profiles:", profilesError);
          } else if (profiles) {
            profilesData = profiles;
          }
        }

        const captionIds = captionList.map((caption) => caption.id);

        let likedCaptionIds: string[] = [];
        let likeCounts: Record<string, number> = {};

        try {
          const metadataResults = await Promise.all([
            fetchUserLikedCaptionIds(user?.id, captionIds),
            fetchCaptionLikeCounts(captionIds),
          ]);

          likedCaptionIds = metadataResults[0] ?? [];
          likeCounts = metadataResults[1] ?? {};
        } catch (metadataError) {
          markLikesFeatureUnavailable(metadataError as PostgrestError | null);
          console.error("[Likes] Failed to load trending metadata, continuing without likes context", metadataError);
          likedCaptionIds = [];
          likeCounts = {};
        }

        if (!isMounted) {
          return;
        }

        const captionRows = captionList as CaptionRow[];

        const transformedCaptions = captionRows.map<TrendingCaption>((caption) => {
          const profile = profilesData.find((p) => p.user_id === caption.user_id);
          const likeCount = likeCounts[caption.id] ?? caption.likes ?? 0;
          return {
            id: caption.id,
            caption: caption.content,
            author: profile?.display_name || profile?.email || "Anonymous",
            category: caption.category || "General",
            likes: likeCount,
            isLiked: likedCaptionIds.includes(caption.id),
            trend: determineTrend(likeCount, caption.created_at),
            title: caption.title || null,
            created_at: caption.created_at,
            user_id: caption.user_id,
          };
        });

        const sortedCaptions = [...transformedCaptions].sort((a, b) => {
          if (b.likes !== a.likes) {
            return b.likes - a.likes;
          }
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

        console.log('[Trending] setCaptions with', sortedCaptions.length, 'items — stats:', { hot: sortedCaptions.filter(c => c.trend === 'hot').length, rising: sortedCaptions.filter(c => c.trend === 'rising').length, new: sortedCaptions.filter(c => c.trend === 'new').length });
        setCaptions(sortedCaptions);
      } catch (error) {
        console.error('[Trending] fetch error:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCaptions();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  useEffect(() => {
    const hotCount = captions.filter((c) => c.trend === "hot").length;
    const risingCount = captions.filter((c) => c.trend === "rising").length;
    const newCount = captions.filter((c) => c.trend === "new").length;

    setStats({
      hot: hotCount,
      rising: risingCount,
      new: newCount,
    });
  }, [captions]);

  const handleLikeToggle = async (captionId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like captions.",
        variant: "destructive",
      });
      return;
    }

    const caption = captions.find((item) => item.id === captionId);
    if (!caption) return;

    if (!areLikesSupported()) {
      toast({
        title: "Likes unavailable",
        description: "We’re setting things up. Please try again later.",
      });
      return;
    }

    const previousLikes = caption.likes;
    const previousLiked = caption.isLiked;
    const nextLikedState = !previousLiked;
    const nextLikeCount = nextLikedState ? previousLikes + 1 : Math.max(previousLikes - 1, 0);

    setCaptions((prev) =>
      prev.map((item) =>
        item.id === captionId
          ? {
              ...item,
              likes: nextLikeCount,
              isLiked: nextLikedState,
              trend: determineTrend(nextLikeCount, item.created_at),
            }
          : item,
      ),
    );

    setUpdatingIds((prev) => {
      const updated = new Set(prev);
      updated.add(captionId);
      return updated;
    });

    try {
      if (nextLikedState) {
        const { error } = await supabase
          .from("likes")
          .upsert({
            user_id: user.id,
            caption_id: captionId,
            created_at: new Date().toISOString(),
          });

        if (error) {
          throw error;
        }
      } else {
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("user_id", user.id)
          .eq("caption_id", captionId);

        if (error) {
          throw error;
        }
      }

    } catch (error) {
      markLikesFeatureUnavailable(error as PostgrestError | null);
      console.error("Error updating like:", error);
      toast({
        title: "Could not update like",
        description: "Please try again.",
        variant: "destructive",
      });

      setCaptions((prev) =>
        prev.map((item) =>
          item.id === captionId
            ? {
                ...item,
                likes: previousLikes,
                isLiked: previousLiked,
                trend: determineTrend(previousLikes, item.created_at),
            }
          : item,
        ),
      );
    } finally {
      setUpdatingIds((prev) => {
        const updated = new Set(prev);
        updated.delete(captionId);
        return updated;
      });
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "hot":
        return <Flame className="h-3 w-3" />;
      case "rising":
        return <TrendingUp className="h-3 w-3" />;
      case "new":
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "hot":
        return {
          bg: 'bg-gradient-to-r from-red-500/10 to-orange-500/10',
          text: 'text-red-600',
          border: 'border-red-500/20',
          icon: <Flame className="h-4 w-4 text-red-500" />,
          gradient: 'from-red-500 to-orange-500'
        };
      case "rising":
        return {
          bg: 'bg-gradient-to-r from-green-500/10 to-emerald-500/10',
          text: 'text-green-600',
          border: 'border-green-500/20',
          icon: <TrendingUp className="h-4 w-4 text-green-500" />,
          gradient: 'from-green-500 to-emerald-500'
        };
      case "new":
        return {
          bg: 'bg-gradient-to-r from-purple-500/10 to-cyan-500/10',
          text: 'text-blue-600',
          border: 'border-blue-500/20',
          icon: <Clock className="h-4 w-4 text-blue-500" />,
          gradient: 'from-purple-500 to-cyan-500'
        };
      default:
        return {
          bg: 'bg-muted/50',
          text: 'text-foreground/70',
          border: 'border-border/50',
          icon: <TrendingUp className="h-4 w-4" />,
          gradient: 'from-gray-500 to-gray-600'
        };
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-pink-500/10 border border-amber-500/20 mb-6">
              <Flame className="h-5 w-5 text-amber-500 mr-2" />
              <span className="text-sm font-medium text-amber-600">TRENDING NOW</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-4">
              What's Popping Today
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover the most popular and fastest-growing captions in our community
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-card to-card/80 border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-colors duration-300">
                  <Flame className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-1">{stats.hot}</h3>
                <p className="text-muted-foreground">Hot Captions</p>
                <div className="mt-4 h-1 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-500 to-orange-500" style={{ width: `${Math.min(100, (stats.hot / 20) * 100)}%` }}></div>
                </div>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-card to-card/80 border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors duration-300">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-1">{stats.rising}</h3>
                <p className="text-muted-foreground">Rising Fast</p>
                <div className="mt-4 h-1 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500" style={{ width: `${Math.min(100, (stats.rising / 20) * 100)}%` }}></div>
                </div>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-card to-card/80 border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors duration-300">
                  <Clock className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-1">{stats.new}</h3>
                <p className="text-muted-foreground">New Today</p>
                <div className="mt-4 h-1 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500" style={{ width: `${Math.min(100, (stats.new / 20) * 100)}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Trending Captions */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center">
                <span className="w-1 h-8 bg-gradient-to-b from-primary to-primary/70 rounded-full mr-3"></span>
                Trending Captions
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  Showing {captions.length} of {captions.length}
                </span>
              </div>
            </div>

            {loading ? (
              <div className="space-y-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="relative overflow-hidden rounded-xl h-40 bg-muted/50">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer-slide" />
                  </div>
                ))}
              </div>
            ) : captions.length === 0 ? (
              <div className="text-center py-16 bg-muted/30 rounded-2xl border border-dashed border-border">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No trending captions yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-4">
                  Check back later to see what's trending in the community
                </p>
                <Button variant="outline" onClick={() => navigate('/explore')}>
                  Explore Captions
                </Button>
              </div>
            ) : (
              <div ref={listRef} className="space-y-6">
                {captions.map((caption, index) => {
                  const trendStyles = getTrendColor(caption.trend);
                  return (
                    <div
                      key={caption.id}
                      className={`group relative overflow-hidden rounded-xl p-6 transition-all duration-300 ${trendStyles.bg} border ${trendStyles.border} hover:shadow-lg ${listInView ? 'animate-fade-in' : ''}`}
                      style={{ animationDelay: `${Math.min(index, 6) * 0.06}s` }}
                    >
                      {/* Trend indicator bar */}
                      <div 
                        className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${trendStyles.gradient}`}
                      ></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center text-foreground/70 font-bold text-lg mr-4">
                              {index + 1}
                            </div>
                          </div>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${trendStyles.text} bg-background/40`}>
                            {trendStyles.icon}
                            <span className="capitalize">{caption.trend}</span>
                          </span>
                        </div>
                        
                        <div className="pl-2">
                          <p className="text-foreground/90 text-lg leading-relaxed mb-4 line-clamp-3">
                            "{caption.caption}"
                          </p>
                          
                          <div className="flex items-center justify-between pt-3 border-t border-border/30">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center">
                                <span className="text-xs font-medium text-foreground/70">
                                  {caption.author.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {caption.author}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className={`h-8 px-3 rounded-full transition-colors ${caption.isLiked ? 'text-red-500 hover:bg-red-500/10' : 'text-muted-foreground hover:bg-muted'} disabled:opacity-50 disabled:cursor-not-allowed`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLikeToggle(caption.id);
                                }}
                                disabled={updatingIds.has(caption.id)}
                                title={user ? undefined : 'Please sign in to like'}
                              >
                                <Heart className={`h-4 w-4 ${caption.isLiked ? 'fill-current' : ''}`} />
                                <span className="ml-1.5">{caption.likes > 1000 ? `${(caption.likes / 1000).toFixed(1)}k` : caption.likes}</span>
                              </Button>
                              
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-muted-foreground hover:bg-muted"
                                title="Copy caption"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(caption.caption);
                                  toast({
                                    title: "Copied!",
                                    description: "Caption copied to clipboard"
                                  });
                                }}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-muted-foreground hover:bg-muted" 
                                title="Download"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Create a blob with the caption text
                                  const blob = new Blob([caption.caption], { type: 'text/plain' });
                                  // Create a temporary anchor element
                                  const url = URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  // Set the download filename
                                  a.download = `caption-${caption.id}.txt`;
                                  // Trigger the download
                                  document.body.appendChild(a);
                                  a.click();
                                  // Clean up
                                  setTimeout(() => {
                                    document.body.removeChild(a);
                                    window.URL.revokeObjectURL(url);
                                  }, 0);
                                  // Show success message
                                  toast({
                                    title: "Download started",
                                    description: "Caption downloaded as text file"
                                  });
                                }}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Trending;

