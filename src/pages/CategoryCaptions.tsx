import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CaptionCard } from "@/components/CaptionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
  const { category } = useParams<{ category: string }>();
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
    caption.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">Loading captions...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-20">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {category} Captions
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Browse {captions.length} captions in the {category} category
          </p>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search captions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredCaptions.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              {searchQuery ? "No captions found matching your search." : "No captions found in this category."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCaptions.map((captionData) => (
              <CaptionCard 
                key={captionData.id} 
                caption={captionData.content}
                author={captionData.profiles?.display_name || "Anonymous"}
                category={captionData.category || "General"}
                likes={0}
                isLiked={false}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CategoryCaptions;