import { useState } from "react";
import { Heart, Share, BookOpen, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface CaptionCardProps {
  id: string;
  caption: string;
  author: string;
  category: string;
  likes: number;
  isLiked?: boolean;
  authorAvatar?: string;
  onLikeUpdate?: (id: string, newLikeCount: number, isLiked: boolean) => void;
}

export const CaptionCard = ({ 
  id,
  caption, 
  author, 
  category, 
  likes, 
  isLiked = false,
  authorAvatar,
  onLikeUpdate
}: CaptionCardProps) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleLike = async () => {
    if (!user) return;
    
    const newLikedState = !liked;
    const newLikeCount = newLikedState ? likeCount + 1 : likeCount - 1;
    
    // Optimistic UI update
    setLiked(newLikedState);
    setLikeCount(newLikeCount);
    onLikeUpdate?.(id, newLikeCount, newLikedState);
    
    try {
      setIsUpdating(true);
      
      if (newLikedState) {
        // Add like to database
        const { error } = await supabase
          .from('likes')
          .upsert({
            user_id: user.id,
            caption_id: id,
            created_at: new Date().toISOString()
          });
          
        if (error) throw error;
      } else {
        // Remove like from database
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('caption_id', id);
          
        if (error) throw error;
      }
      
      // Update caption's like count in the database
      const { error: updateError } = await supabase
        .from('captions')
        .update({ likes: newLikeCount })
        .eq('id', id);
        
      if (updateError) throw updateError;
      
    } catch (error) {
      console.error('Error updating like:', error);
      // Revert optimistic update if there's an error
      setLiked(!newLikedState);
      setLikeCount(likeCount);
      onLikeUpdate?.(id, likeCount, !newLikedState);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`"${caption}" - ${author}`);
      // You could add a toast notification here
      console.log('Caption copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy caption:', err);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Caption by ' + author,
      text: `"${caption}" - ${author}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(`"${caption}" - ${author}\n\nShared from CaptionCrafter`);
        console.log('Caption shared via clipboard!');
      }
    } catch (err) {
      console.error('Error sharing caption:', err);
    }
  };

  return (
    <Card className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-card bg-blue-50 dark:bg-blue-900/20 border-border/50">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Author Info */}
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={authorAvatar} alt={author} />
              <AvatarFallback className="bg-gradient-primary text-white text-xs">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{author}</p>
              <p className="text-xs text-muted-foreground">{category}</p>
            </div>
          </div>

          {/* Caption Text */}
          <div className="min-h-[80px] flex items-center">
            <p className="text-foreground leading-relaxed text-sm group-hover:text-blue-600 transition-colors duration-300">
              "{caption}"
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={isUpdating || !user}
                className={`transition-all duration-300 ${
                  liked 
                    ? 'text-red-500 hover:text-red-600' 
                    : 'text-muted-foreground hover:text-red-500'
                }`}
                title={user ? '' : 'Please sign in to like'}
              >
                <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                <span className="text-xs">{likeCount}</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:!text-blue-600 transition-colors" 
                onClick={handleShare}
              >
                <Share className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:!text-blue-600 transition-colors" 
                onClick={handleCopy}
              >
                <BookOpen className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};