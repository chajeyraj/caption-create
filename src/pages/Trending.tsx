import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CaptionCard } from "@/components/CaptionCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Flame, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Trending = () => {
  const navigate = useNavigate();
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
          bg: 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10',
          text: 'text-blue-600',
          border: 'border-blue-500/20',
          icon: <Clock className="h-4 w-4 text-blue-500" />,
          gradient: 'from-blue-500 to-cyan-500'
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
                <h3 className="text-3xl font-bold text-foreground mb-1">{stats.hot}+</h3>
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
                <h3 className="text-3xl font-bold text-foreground mb-1">{stats.rising}+</h3>
                <p className="text-muted-foreground">Rising Fast</p>
                <div className="mt-4 h-1 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500" style={{ width: `${Math.min(100, (stats.rising / 20) * 100)}%` }}></div>
                </div>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-card to-card/80 border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors duration-300">
                  <Clock className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-1">{stats.new}+</h3>
                <p className="text-muted-foreground">New Today</p>
                <div className="mt-4 h-1 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: `${Math.min(100, (stats.new / 20) * 100)}%` }}></div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-muted/50 rounded-xl animate-pulse"></div>
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
              <div className="space-y-6">
                {captions.map((caption, index) => {
                  const trendStyles = getTrendColor(caption.trend);
                  return (
                    <div 
                      key={caption.id} 
                      className={`group relative overflow-hidden rounded-xl p-6 transition-all duration-300 ${trendStyles.bg} border ${trendStyles.border} hover:shadow-lg`}
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
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${trendStyles.text} ${trendStyles.bg} border ${trendStyles.border}`}>
                                  {caption.trend.charAt(0).toUpperCase() + caption.trend.slice(1)}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {caption.likes.toLocaleString()} likes
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                in {caption.category || 'General'}
                              </p>
                            </div>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="1"></circle>
                                <circle cx="12" cy="5" r="1"></circle>
                                <circle cx="12" cy="19" r="1"></circle>
                              </svg>
                            </Button>
                          </div>
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
                                className={`h-8 px-3 rounded-full ${caption.isLiked ? 'text-red-500 hover:bg-red-500/10' : 'text-muted-foreground hover:bg-muted'}`}
                              >
                                <svg 
                                  xmlns="http://www.w3.org/2000/svg" 
                                  width="16" 
                                  height="16" 
                                  viewBox="0 0 24 24" 
                                  fill={caption.isLiked ? 'currentColor' : 'none'} 
                                  stroke="currentColor" 
                                  strokeWidth="2" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round"
                                >
                                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                                <span className="ml-1.5">{caption.likes > 1000 ? `${(caption.likes / 1000).toFixed(1)}k` : caption.likes}</span>
                              </Button>
                              
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                                  <polyline points="16 6 12 2 8 6"></polyline>
                                  <line x1="12" y1="2" x2="12" y2="15"></line>
                                </svg>
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