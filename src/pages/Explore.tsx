import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CaptionCard } from "@/components/CaptionCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { fetchCaptionLikeCounts, fetchUserLikedCaptionIds } from "@/utils/likes";
import { useAuth } from "@/hooks/useAuth";
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

// Number of items per page
const ITEMS_PER_PAGE = 9;

interface Caption {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  category?: string;
  user_id: string;
  created_at: string;
  likes?: number;
  isLiked?: boolean;
  authorAvatar?: string | null;
  profiles?: {
    display_name: string;
    email: string;
    avatar_url?: string | null;
  };
}

type Category = string;

const Explore = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") ?? "");
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<string[]>(["All"]);
  console.log('[Explore] render — loading:', loading, 'error:', error, 'captions:', captions.length, 'user:', user?.email ?? 'none');

  useEffect(() => {
    document.title = "Explore Captions — CaptionCrafter";
  }, []);

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const MAX_RETRIES = 3;
    let retryTimeout: NodeJS.Timeout;

    const fetchData = async () => {
      if (!isMounted) return;

      console.log('[Explore] fetchData start — user:', user?.id ?? 'none', 'retryCount:', retryCount);
      setLoading(true);
      setError(null);

      try {
        const { data: captionsData, error: captionsError } = await supabase
          .from("captions")
          .select('id, title, content, image_url, category, user_id, created_at', { count: 'exact' })
          .order("created_at", { ascending: false });

        console.log('[Explore] captions fetch result — count:', captionsData?.length ?? 0, 'error:', captionsError);
        if (captionsError) throw captionsError;

        if (!isMounted || !captionsData) return;

        const userIds = Array.from(
          new Set(captionsData.map(caption => caption.user_id).filter(Boolean))
        ) as string[];

        const { data: profiles = [], error: profilesError } = await supabase
          .from('profiles')
          .select('user_id, display_name, email, avatar_url')
          .in('user_id', userIds);

        if (profilesError) throw profilesError;

        if (!isMounted) return;

        const profilesMap = profiles.reduce((acc, profile) => {
          acc[profile.user_id] = profile;
          return acc;
        }, {} as Record<string, any>);

        const captionIds = captionsData.map(caption => caption.id);

        let likedCaptionIds: string[] = [];
        let likeCounts: Record<string, number> = {};

        try {
          [likedCaptionIds, likeCounts] = await Promise.all([
            user?.id ? fetchUserLikedCaptionIds(user.id, captionIds) : Promise.resolve([]),
            captionIds.length > 0 ? fetchCaptionLikeCounts(captionIds) : Promise.resolve({})
          ]);
        } catch (likeError) {
          console.error("[Explore] Error fetching likes:", likeError);
        }

        if (!isMounted) return;

        const processedCaptions = captionsData.map(caption => {
          const profile = profilesMap[caption.user_id] || {};
          const displayName = profile.display_name ||
            (profile.email ? profile.email.split('@')[0] : 'Anonymous');
          const authorAvatar = profile.avatar_url || null;

          return {
            ...caption,
            author: displayName,
            authorAvatar,
            likes: likeCounts[caption.id] || 0,
            isLiked: likedCaptionIds.includes(caption.id),
            profiles: {
              display_name: displayName,
              email: profile.email || '',
              avatar_url: authorAvatar
            }
          };
        });

        console.log('[Explore] setCaptions with', processedCaptions.length, 'items');
        setCaptions(processedCaptions);

        const uniqueCategories = Array.from(
          new Set(processedCaptions.map(caption => caption.category).filter(Boolean))
        ).sort();

        setCategories(["All", ...uniqueCategories]);
      } catch (err) {
        if (retryCount < MAX_RETRIES && isMounted) {
          retryCount++;
          setRetryAttempt(retryCount);
          retryTimeout = setTimeout(fetchData, 1000 * retryCount);
          return;
        }
        if (isMounted) {
          console.error('[Explore] all retries failed:', err);
          setError('Failed to load captions. Please refresh the page.');
          setRetryAttempt(0);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      clearTimeout(retryTimeout);
    };
  }, [user?.id]);

  const filteredCaptions = useMemo(() => {
    return captions.filter(caption => {
      const matchesSearch = caption.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (caption.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
                          (caption.profiles?.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
      const matchesCategory = selectedCategory === "All" || caption.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [captions, searchQuery, selectedCategory]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCaptions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCaptions = filteredCaptions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // Handle page change
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Explore Captions
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover amazing captions from our community
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="relative max-w-md mx-auto transition-all duration-300 focus-within:scale-[1.03] focus-within:shadow-md rounded-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors duration-200 peer-focus:text-primary" />
              <Input
                placeholder="Search captions or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary/50"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Captions Grid */}
          {error ? (
            <div className="text-center py-12">
              <p className="text-destructive text-lg">{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {retryAttempt > 0
                  ? `Connection slow — retrying (attempt ${retryAttempt}/3)...`
                  : 'Loading captions...'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginatedCaptions.map((caption) => (
                  <CaptionCard
                    key={caption.id}
                    id={caption.id}
                    caption={caption.content}
                    author={caption.profiles?.display_name || caption.profiles?.email || 'Unknown'}
                    category={caption.category || 'Uncategorized'}
                    likes={caption.likes || 0}
                    isLiked={caption.isLiked ?? false}
                    authorAvatar={caption.authorAvatar ?? undefined}
                    onLikeUpdate={handleLikeUpdate}
                  />
                ))}
              </div>

              {filteredCaptions.length === 0 && !loading ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <Search className="h-12 w-12 text-muted-foreground/40 mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No captions found</h3>
                  <p className="text-muted-foreground max-w-sm">
                    {searchQuery
                      ? `No results for "${searchQuery}". Try different keywords or clear the search.`
                      : "No captions in this category yet. Try selecting a different one."}
                  </p>
                  {searchQuery && (
                    <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                      Clear search
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Showing <span className="font-medium">{Math.min(startIndex + 1, filteredCaptions.length)}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(startIndex + ITEMS_PER_PAGE, filteredCaptions.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredCaptions.length}</span> results
                  </p>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(1)}
                      disabled={currentPage === 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center gap-1 mx-2">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Show pages around current page
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => goToPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                      
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <span className="px-2 text-sm text-muted-foreground">...</span>
                      )}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(totalPages)}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Explore;
