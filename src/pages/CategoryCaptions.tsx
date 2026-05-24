import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CaptionCard } from "@/components/CaptionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Hash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { fetchUserLikedCaptionIds, markLikesFeatureUnavailable, fetchCaptionLikeCounts } from "@/utils/likes";
import type { PostgrestError } from "@supabase/supabase-js";
import { CATEGORY_GRADIENTS } from "@/constants/categories";

interface Caption {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  category?: string;
  user_id: string;
  created_at: string;
  profiles?: {
    display_name?: string;
    email: string;
  };
  likes?: number;
  isLiked?: boolean;
  authorAvatar?: string | null;
}

const CategoryCaptions = () => {
  const { category = '' } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sharedCaptionId = searchParams.get("caption");
  const { user } = useAuth();
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  console.log('[CategoryCaptions] render — category:', category, 'loading:', loading, 'captions:', captions.length, 'user:', user?.email ?? 'none');
  
  // react-router already decodes the param; use it directly as the display + DB lookup key
  const gradientClass = CATEGORY_GRADIENTS[category] || 'from-purple-500 to-cyan-500';

  useEffect(() => {
    if (category) document.title = `${category} — CaptionCrafter`;
  }, [category]);

  useEffect(() => {
    if (!category) return;

    let isMounted = true;

    const fetchCaptions = async () => {
      console.log('[CategoryCaptions] fetchCaptions start — category:', category, 'user:', user?.id ?? 'none');
      setLoading(true);
      try {
        const selectFields = "id, title, content, image_url, category, user_id, created_at";

        const { data: captionsDataRaw, error } = await supabase
          .from("captions")
          .select(selectFields)
          .eq("category", category)
          .order("created_at", { ascending: false });

        console.log('[CategoryCaptions] fetch result — count:', captionsDataRaw?.length ?? 0, 'error:', error);
        if (error) throw error;

        const captionsData = captionsDataRaw ?? [];

        const captionsRows = captionsData as Caption[];

        const captionIds = captionsRows.map((caption) => caption.id);
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
          console.error("[Likes] Failed to load category metadata, using defaults", {
            category,
            error: metadataError,
          });
          likedCaptionIds = [];
          likeCounts = {};
        }
        const userIds = captionsRows.map((caption) => caption.user_id).filter(Boolean) ?? [];
        const profilesMap = new Map<
          string,
          { display_name?: string | null; email?: string | null; avatar_url?: string | null }
        >();

        if (userIds.length > 0) {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("user_id, display_name, email, avatar_url")
            .in("user_id", userIds);

          if (profileError) {
            console.error("Error fetching profiles for category captions:", profileError);
          } else {
            profileData?.forEach((profile) => {
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

        const captionsWithProfiles =
          captionsRows.map((caption) => ({
            ...caption,
            profiles: profilesMap.get(caption.user_id) || null,
            isLiked: likedCaptionIds.includes(caption.id),
            likes: likeCounts[caption.id] ?? 0,
            authorAvatar: profilesMap.get(caption.user_id)?.avatar_url || null,
          })) || [];

        console.log('[CategoryCaptions] setCaptions with', captionsWithProfiles.length, 'items');
        setCaptions(captionsWithProfiles);
      } catch (error) {
        console.error('[CategoryCaptions] fetch error:', error);
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
  }, [category, user?.id]);

  const filteredCaptions = captions.filter(caption =>
    caption.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (caption.title && caption.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Get current captions for pagination
  const indexOfLastCaption = currentPage * itemsPerPage;
  const indexOfFirstCaption = indexOfLastCaption - itemsPerPage;
  const currentCaptions = filteredCaptions.slice(indexOfFirstCaption, indexOfLastCaption);
  const totalPages = Math.ceil(filteredCaptions.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Reset to first page when search query changes
  useEffect(() => {
    if (sharedCaptionId) return;
    setCurrentPage(1);
  }, [searchQuery, category, sharedCaptionId]);

  useEffect(() => {
    if (!sharedCaptionId || captions.length === 0) return;

    const captionIndex = captions.findIndex((caption) => caption.id === sharedCaptionId);
    if (captionIndex === -1) return;

    setSearchQuery("");
    setCurrentPage(Math.floor(captionIndex / itemsPerPage) + 1);
  }, [captions, sharedCaptionId]);

  useEffect(() => {
    if (!sharedCaptionId || currentCaptions.length === 0) return;

    const target = document.getElementById(`caption-${sharedCaptionId}`);
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [currentCaptions, sharedCaptionId]);

  const handleLikeUpdate = (captionId: string, newLikeCount: number, isLiked: boolean) => {
    setCaptions((prev) =>
      prev.map((caption) =>
        caption.id === captionId
          ? {
              ...caption,
              likes: newLikeCount,
              isLiked,
            }
          : caption,
      ),
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-muted mb-4"></div>
              <div className="h-4 bg-muted rounded w-32 mb-2"></div>
              <div className="h-4 bg-muted rounded w-48"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Back button and header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)} 
              className="mb-6 group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Categories
            </Button>
            
            <div className="flex items-center mb-4">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${gradientClass} flex items-center justify-center mr-4`}>
                <Hash className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                  {category}
                </h1>
                <p className="text-muted-foreground">
                  {filteredCaptions.length} {filteredCaptions.length === 1 ? 'caption' : 'captions'} available
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search captions in this category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Captions Grid */}
          {filteredCaptions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Search className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {searchQuery ? "No captions found" : `Nothing in ${category} yet`}
              </h3>
              <p className="text-muted-foreground max-w-sm">
                {searchQuery
                  ? `No results for "${searchQuery}". Try different keywords.`
                  : "This category doesn't have any captions yet. Check back later or explore other categories."}
              </p>
              {searchQuery ? (
                <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                  Clear search
                </Button>
              ) : (
                <Button variant="outline" className="mt-4" onClick={() => navigate('/explore')}>
                  Explore all captions
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentCaptions.map((captionData) => (
                  <div
                    key={captionData.id}
                    id={`caption-${captionData.id}`}
                    className="scroll-mt-28 rounded-2xl transition-shadow duration-500"
                    style={
                      captionData.id === sharedCaptionId
                        ? { boxShadow: "0 0 0 2px hsl(38 90% 54% / 0.9), 0 0 32px hsl(38 90% 54% / 0.22)" }
                        : undefined
                    }
                  >
                    <CaptionCard 
                      id={captionData.id}
                      caption={captionData.content}
                      author={captionData.profiles?.display_name || captionData.profiles?.email || "Anonymous"}
                      category={captionData.category || "General"}
                      likes={captionData.likes ?? 0}
                      isLiked={captionData.isLiked ?? false}
                      authorAvatar={captionData.authorAvatar ?? undefined}
                      onLikeUpdate={handleLikeUpdate}
                    />
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8 mb-12">
                  <nav className="flex items-center space-x-1">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded-md border border-muted-foreground/20 text-muted-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Show first page, last page, and pages around current page
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
                        <button
                          key={pageNum}
                          onClick={() => paginate(pageNum)}
                          className={`px-3 py-1 rounded-md border ${
                            currentPage === pageNum
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'border-muted-foreground/20 text-muted-foreground hover:bg-muted'
                          } transition-colors`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded-md border border-muted-foreground/20 text-muted-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </nav>
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

export default CategoryCaptions;
