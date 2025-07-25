import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CaptionCard } from "@/components/CaptionCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Search, Filter } from "lucide-react";

interface Caption {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  category?: string;
  user_id: string;
  created_at: string;
  profiles?: {
    display_name: string;
    email: string;
  };
}

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<string[]>(["All"]);

  useEffect(() => {
    fetchCaptions();
  }, []);

  const fetchCaptions = async () => {
    const { data: captionsData } = await supabase
      .from('captions')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: profilesData } = await supabase
      .from('profiles')
      .select('*');

    // Combine captions with profile data
    const captionsWithProfiles = captionsData?.map(caption => {
      const profile = profilesData?.find(p => p.user_id === caption.user_id);
      return {
        ...caption,
        profiles: profile ? {
          display_name: profile.display_name || profile.email,
          email: profile.email
        } : undefined
      };
    });

    if (captionsWithProfiles) {
      setCaptions(captionsWithProfiles);
      
      // Extract unique categories from captions
      const uniqueCategories = Array.from(
        new Set(
          captionsWithProfiles
            .map(caption => caption.category)
            .filter(Boolean)
        )
      ).sort();
      
      setCategories(["All", ...uniqueCategories]);
    }
    setLoading(false);
  };

  const filteredCaptions = captions.filter(caption => {
    const matchesSearch = caption.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         caption.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (caption.profiles?.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    const matchesCategory = selectedCategory === "All" || caption.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search captions or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
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
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Loading captions...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {filteredCaptions.map((caption) => (
                  <CaptionCard
                    key={caption.id}
                    caption={caption.content}
                    author={caption.profiles?.display_name || caption.profiles?.email || 'Unknown'}
                    category={caption.category || 'Uncategorized'}
                    likes={0}
                    isLiked={false}
                  />
                ))}
              </div>

              {filteredCaptions.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">No captions found matching your search.</p>
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