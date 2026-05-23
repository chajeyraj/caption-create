import { useState, useEffect, useRef, useCallback } from "react";
import { Heart, Share, Copy, Check } from "lucide-react";
import type { PostgrestError } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";
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

/* Stable hue per category for the category pill */
function categoryHue(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  return h % 360;
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

  /* Magnetic tilt */
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (prevLikesRef.current !== likes) {
      prevLikesRef.current = likes;
      setLikeCountKey((k) => k + 1);
    }
  }, [likes]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const cx = left + width / 2;
    const cy = top + height / 2;
    const dx = (e.clientX - cx) / (width / 2);
    const dy = (e.clientY - cy) / (height / 2);
    setTilt({ x: dx * 4, y: -dy * 3 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  const handleLike = async () => {
    if (!user) {
      toast({ title: "Sign in to like", description: "Create an account or sign in to like captions." });
      return;
    }
    if (!areLikesSupported()) {
      toast({ title: "Likes unavailable", description: "We're setting things up. Please try again later." });
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
        const { error } = await supabase.from('likes').delete()
          .eq('user_id', user.id).eq('caption_id', id);
        if (error) throw error;
      }
    } catch (error) {
      markLikesFeatureUnavailable(error as PostgrestError | null);
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
    } catch {
      toast({ title: 'Error', description: 'Failed to copy caption', variant: 'destructive' });
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Caption by ' + author, text: `"${caption}" - ${author}`, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(`"${caption}" - ${author}\n\nShared from CaptionCrafter`);
        toast({ title: 'Copied to clipboard', description: 'Sharing not supported — caption copied instead.' });
      }
    } catch (err) {
      if ((err as DOMException)?.name === 'AbortError') return;
      toast({ title: 'Share failed', description: 'Could not share caption.', variant: 'destructive' });
    }
  };

  const hue = categoryHue(category);

  return (
    <div
      ref={cardRef}
      className="group relative will-change-transform"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(900px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) translateZ(0)`,
        transition: tilt.x === 0 && tilt.y === 0
          ? 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
          : 'transform 0.12s ease-out',
      }}
    >
      {/* Ink card shell with amber left border */}
      <div
        className="relative overflow-hidden rounded-2xl transition-all duration-300"
        style={{
          background: 'hsl(235, 18%, 10%)',
          borderLeft: '3px solid hsl(38, 90%, 54%)',
          borderTop: '1px solid hsl(240, 12%, 19%)',
          borderRight: '1px solid hsl(240, 12%, 19%)',
          borderBottom: '1px solid hsl(240, 12%, 19%)',
          boxShadow: '0 4px 24px hsl(0 0% 0% / 0.35)',
        }}
        /* Elevate on hover */
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 48px hsl(0 0% 0% / 0.55), 0 0 0 1px hsl(38 90% 54% / 0.15)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 24px hsl(0 0% 0% / 0.35)';
        }}
      >
        {/* Decorative giant opening quote */}
        <div
          className="absolute top-0 right-4 font-display font-bold leading-none pointer-events-none select-none"
          style={{ fontSize: '7rem', color: 'hsl(38 90% 54% / 0.07)', lineHeight: 1 }}
          aria-hidden
        >
          &#8220;
        </div>

        <div className="p-6 space-y-4 relative z-10">
          {/* Author + category */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="h-8 w-8 shrink-0 ring-1" style={{ ringColor: 'hsl(38 90% 54% / 0.25)' }}>
                {authorAvatar ? (
                  <AvatarImage src={authorAvatar} alt={author} />
                ) : (
                  <AvatarFallback
                    className="text-xs font-semibold"
                    style={{
                      background: 'linear-gradient(135deg, hsl(38, 90%, 54%), hsl(25, 90%, 58%))',
                      color: 'hsl(232, 20%, 7%)',
                    }}
                  >
                    {author.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <p className="text-sm font-medium truncate" style={{ color: 'hsl(40, 20%, 78%)' }}>
                {author}
              </p>
            </div>

            {/* Category pill — hue derived from category name */}
            <span
              className="shrink-0 text-xs px-2.5 py-1 rounded-full font-medium"
              style={{
                background: `hsl(${hue}, 70%, 54% / 0.12)`,
                color: `hsl(${hue}, 70%, 68%)`,
                border: `1px solid hsl(${hue}, 70%, 54% / 0.22)`,
              }}
            >
              {category}
            </span>
          </div>

          {/* Caption text — editorial italic Lora */}
          <div className="min-h-[80px] flex items-start pt-1">
            <p
              className="caption-quote leading-relaxed text-base group-hover:text-[hsl(40,20%,95%)] transition-colors duration-300"
              style={{ color: 'hsl(40, 20%, 82%)' }}
            >
              &#8220;{caption}&#8221;
            </p>
          </div>

          {/* Action bar */}
          <div
            className="flex items-center gap-1 pt-3"
            style={{ borderTop: '1px solid hsl(240, 12%, 20%)' }}
          >
            {/* Like */}
            <button
              onClick={handleLike}
              disabled={isUpdating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 hover:scale-105 active:scale-95 disabled:opacity-50"
              style={{
                color: isLiked ? 'hsl(0, 80%, 65%)' : 'hsl(260, 8%, 52%)',
                background: isLiked ? 'hsl(0 80% 65% / 0.1)' : 'transparent',
              }}
            >
              <Heart
                key={`heart-${heartKey}`}
                className={`h-4 w-4 ${isLiked ? 'fill-current' : ''} ${heartKey > 0 ? 'animate-heartbeat' : ''}`}
              />
              {likes > 0 && (
                <span
                  key={`count-${likeCountKey}`}
                  className={`tabular-nums ${likeCountKey > 0 ? 'animate-count-flip-up' : ''}`}
                >
                  {likes}
                </span>
              )}
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-150 hover:scale-105 active:scale-95 hover:text-foreground"
              style={{ color: 'hsl(260, 8%, 52%)' }}
            >
              <Share className="h-4 w-4" />
            </button>

            {/* Copy — right-aligned */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 hover:scale-105 active:scale-95 ml-auto"
              style={{
                color: copied ? 'hsl(142, 70%, 52%)' : 'hsl(260, 8%, 52%)',
                background: copied ? 'hsl(142 70% 52% / 0.1)' : 'transparent',
              }}
            >
              {copied ? (
                <Check key="check" className="h-4 w-4 animate-icon-swap" />
              ) : (
                <Copy key="copy" className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
