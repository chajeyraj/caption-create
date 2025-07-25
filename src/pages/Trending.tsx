import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CaptionCard } from "@/components/CaptionCard";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Flame, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Trending = () => {
  const [captions, setCaptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    hot: 0,
    rising: 0,
    new: 0
  });

  useEffect(() => {
    fetchTrendingCaptions();
  }, []);

  const fetchTrendingCaptions = async () => {
    try {
      setLoading(true);
      
      // Fetch captions ordered by created_at (newest first) to simulate trending
      const { data: captionsData, error } = await supabase
        .from('captions')
        .select(`
          id,
          title,
          content,
          category,
          created_at,
          user_id
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching captions:', error);
        return;
      }

      // Fetch profiles separately
      const userIds = captionsData?.map(c => c.user_id) || [];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, display_name')
        .in('user_id', userIds);

      // Transform data and assign random trends and likes for demonstration
      const transformedCaptions = captionsData?.map((caption, index) => {
        const trends = ['hot', 'rising', 'new'];
        const randomTrend = trends[Math.floor(Math.random() * trends.length)];
        const randomLikes = Math.floor(Math.random() * 3000) + 100;
        
        // Find the profile for this caption
        const profile = profilesData?.find(p => p.user_id === caption.user_id);
        
        return {
          id: caption.id,
          caption: caption.content,
          author: profile?.display_name || 'Anonymous',
          category: caption.category || 'General',
          likes: randomLikes,
          isLiked: Math.random() > 0.7,
          trend: randomTrend,
          title: caption.title
        };
      }) || [];

      setCaptions(transformedCaptions);

      // Calculate stats
      const hotCount = transformedCaptions.filter(c => c.trend === 'hot').length;
      const risingCount = transformedCaptions.filter(c => c.trend === 'rising').length;
      const newCount = transformedCaptions.filter(c => c.trend === 'new').length;
      
      setStats({
        hot: hotCount,
        rising: risingCount,
        new: newCount
      });

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "hot":
        return <Flame className="h-3 w-3" />;
      case "rising":
        return <TrendingUp className="h-3 w-3" />;
      case "new":
        return <Clock className="h-3 w-3" />;
      default:
        return <TrendingUp className="h-3 w-3" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "hot":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "rising":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "new":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Trending Captions
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover the most popular captions right now
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="text-center p-6 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50">
              <Flame className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-foreground">{stats.hot}</h3>
              <p className="text-muted-foreground">Hot Captions</p>
            </div>
            <div className="text-center p-6 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50">
              <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-foreground">{stats.rising}</h3>
              <p className="text-muted-foreground">Rising Fast</p>
            </div>
            <div className="text-center p-6 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50">
              <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-foreground">{stats.new}</h3>
              <p className="text-muted-foreground">New Today</p>
            </div>
          </div>

          {/* Trending Captions */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-4">Loading trending captions...</p>
            </div>
          ) : captions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No captions found</p>
            </div>
          ) : (
            <div className="space-y-6 mb-12">
              {captions.map((caption, index) => (
              <div key={caption.id} className="relative">
                <div className="absolute -left-4 top-4 z-10">
                  <Badge className={`${getTrendColor(caption.trend)} flex items-center gap-1`}>
                    {getTrendIcon(caption.trend)}
                    {caption.trend}
                  </Badge>
                </div>
                <div className="absolute -left-8 top-0 w-8 h-full bg-gradient-primary opacity-20 rounded-l-lg"></div>
                <div className="pl-12">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-2xl font-bold text-muted-foreground/50">#{index + 1}</span>
                    <span className="text-sm text-muted-foreground">{caption.likes.toLocaleString()} likes</span>
                  </div>
                  <CaptionCard
                    caption={caption.caption}
                    author={caption.author}
                    category={caption.category}
                    likes={caption.likes}
                    isLiked={caption.isLiked}
                  />
                </div>
              </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Trending;