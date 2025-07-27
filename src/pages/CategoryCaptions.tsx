import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CaptionCard } from "@/components/CaptionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Hash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Define category colors to match the Categories page
const categoryColors: Record<string, string> = {
  "Motivational": "from-teal-500 to-emerald-500",
  "Love & Romance": "from-pink-500 to-red-500",
  "Funny": "from-yellow-500 to-orange-500",
  "Success": "from-purple-500 to-cyan-500",
  "Life Quotes": "from-green-500 to-teal-500",
  "Coffee": "from-amber-600 to-yellow-500",
  "Books": "from-cyan-500 to-teal-500",
  "Good Morning": "from-orange-500 to-pink-500",
  "தமிழ்": "from-red-500 to-orange-500"
};

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
}

const CategoryCaptions = () => {
  const { category = '' } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); // 9 items per page (3x3 grid)
  
  // Get the gradient class for the current category, default to blue if not found
  const gradientClass = categoryColors[category] || 'from-purple-500 to-cyan-500';

  useEffect(() => {
    fetchCaptions();
  }, [category]);

  const fetchCaptions = async () => {
    if (!category) return;
    
    setLoading(true);
    try {
      const { data: captionsData, error } = await supabase
        .from('captions')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const captionsWithProfiles = captionsData?.map(caption => ({
        ...caption,
        profiles: null // Simplified for now since we don't need profile data for this view
      })) || [];
      
      setCaptions(captionsWithProfiles);
    } catch (error) {
      console.error('Error fetching captions:', error);
    } finally {
      setLoading(false);
    }
  };

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
    setCurrentPage(1);
  }, [searchQuery, category]);

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
                  {decodeURIComponent(category)}
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
            <div className="text-center py-20">
              <div className="bg-muted/50 p-8 rounded-lg inline-block">
                <p className="text-muted-foreground text-lg">
                  {searchQuery 
                    ? "No captions found matching your search." 
                    : `No captions found in the ${category} category yet.`
                  }
                </p>
                {!searchQuery && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate('/explore')}
                  >
                    Explore all captions
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentCaptions.map((captionData) => (
                  <div key={captionData.id} className="transform transition-all duration-300 hover:scale-[1.02]">
                    <CaptionCard 
                      caption={captionData.content}
                      author={captionData.profiles?.display_name || "Anonymous"}
                      category={captionData.category || "General"}
                      likes={0}
                      isLiked={false}
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