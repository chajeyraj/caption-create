import { useState, useEffect, useRef } from "react";
import { Heart, Share, Copy, Check } from "lucide-react";
import type { PostgrestError } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { areLikesSupported, markLikesFeatureUnavailable } from "@/utils/likes";

interface CaptionCardProps {
  id: string;
  caption: string;
  author: string;
  category: string;
  likes: number;
  isLiked?: boolean;
  authorAvatar?: string | null;
  onLikeUpdate?: (id: string, newLikeCount: number, isLiked: boolean) => void;
}

export const CaptionCard = ({
  id,
  caption,
  author,
  category,
  likes,
  isLiked,
  authorAvatar,
  onLikeUpdate,
}: CaptionCardProps) => {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [heartKey, setHeartKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [likeCountKey, setLikeCountKey] = useState(0);
  const prevLikesRef = useRef(likes);

  useEffect(() => {
    if (prevLikesRef.current !== likes) {
      prevLikesRef.current = likes;
      setLikeCountKey((k) => k + 1);
    }
  }, [likes]);

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Sign in to like",
        description: "Create an account or sign in to like captions.",
      });
      return;
    }
    if (!areLikesSupported()) {
      toast({
        title: "Likes unavailable",
        description: "We're setting things up. Please try again later.",
      });
      return;
    }

    setHeartKey((k) => k + 1);

    const previousLiked = Boolean(isLiked);
    const newLikedState = !previousLiked;
    const newLikeCount = newLikedState ? likes + 1 : Math.max(likes - 1, 0);
    onLikeUpdate?.(id, newLikeCount, newLikedState);

    try {
      setIsUpdating(true);

      if (newLikedState) {
        const { error } = await supabase.from('likes').upsert({
          user_id: user.id,
          caption_id: id,
          created_at: new Date().toISOString(),
        });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('caption_id', id);
        if (error) throw error;
      }
    } catch (error) {
      markLikesFeatureUnavailable(error as PostgrestError | null);
      console.error('Error updating like:', error);
      onLikeUpdate?.(id, likes, previousLiked);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy caption:', err);
      toast({ title: 'Error', description: 'Failed to copy caption', variant: 'destructive' });
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Caption by ' + author,
          text: `"${caption}" - ${author}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(`"${caption}" - ${author}\n\nShared from CaptionCrafter`);
        toast({ title: 'Copied to clipboard', description: 'Sharing not supported — caption copied instead.' });
      }
    } catch (err) {
      if ((err as DOMException)?.name === 'AbortError') return;
      console.error('Error sharing caption:', err);
      toast({ title: 'Share failed', description: 'Could not share caption.', variant: 'destructive' });
    }
  };

  return (
    <Card className="group cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-card bg-card border-border/50 will-change-transform">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Author Info */}
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              {authorAvatar ? (
                <AvatarImage src={authorAvatar} alt={author} />
              ) : (
                <AvatarFallback className="bg-gradient-primary text-white text-xs">
                  {author.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{author}</p>
              <p className="text-xs text-muted-foreground">{category}</p>
            </div>
          </div>

          {/* Caption Text */}
          <div className="min-h-[80px] flex items-center">
            <p className="text-foreground leading-relaxed text-base font-medium group-hover:text-blue-600 transition-colors duration-300">
              "{caption}"
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center space-x-4">
              {/* Like button with heartbeat */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={isUpdating}
                className={`transition-colors duration-300 ${
                  isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'
                }`}
              >
                <Heart
                  key={`heart-${heartKey}`}
                  className={`h-4 w-4 ${isLiked ? 'fill-current' : ''} ${heartKey > 0 ? 'animate-heartbeat' : ''}`}
                />
                {likes > 0 && (
                  <span
                    key={`count-${likeCountKey}`}
                    className={`ml-1 text-xs inline-block overflow-hidden ${likeCountKey > 0 ? 'animate-count-flip-up' : ''}`}
                  >
                    {likes}
                  </span>
                )}
              </Button>

              {/* Share button */}
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:!text-blue-600 transition-colors"
                onClick={handleShare}
              >
                <Share className="h-4 w-4" />
              </Button>

              {/* Copy button with Check swap */}
              <Button
                variant="ghost"
                size="sm"
                className={`transition-colors ${copied ? 'text-green-500' : 'text-muted-foreground hover:!text-blue-600'}`}
                onClick={handleCopy}
              >
                {copied ? (
                  <Check key="check" className="h-4 w-4 animate-icon-swap" />
                ) : (
                  <Copy key="copy" className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
