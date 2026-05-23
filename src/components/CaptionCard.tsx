import { useState, useRef, useCallback } from "react";
import { Share, Copy, Check, Link2, MessageCircle, Twitter, X as XIcon } from "lucide-react";
import type { PostgrestError } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { areLikesSupported, markLikesFeatureUnavailable } from "@/utils/likes";
import { AnimatedNumber } from "@/components/AnimatedNumber";

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

function categoryHue(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  return h % 360;
}

/* ── Liquid Heart SVG ── */
const LiquidHeart = ({
  liked,
  rippleKey,
}: {
  liked: boolean;
  rippleKey: number;
}) => {
  const path =
    "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z";

  return (
    <span className="relative inline-flex items-center justify-center" style={{ width: 18, height: 18 }}>
      {/* Ink-splash ripple on click */}
      {rippleKey > 0 && (
        <span
          key={rippleKey}
          className="absolute inset-0 rounded-full animate-like-ripple"
          style={{
            background: liked ? 'hsl(0, 80%, 65%)' : 'hsl(260, 8%, 55%)',
          }}
        />
      )}

      <svg viewBox="0 0 24 24" width={16} height={16} fill="none" strokeWidth={2}>
        {/* Outline heart */}
        <path
          d={path}
          stroke={liked ? 'hsl(0, 80%, 65%)' : 'hsl(260, 8%, 52%)'}
          style={{ transition: 'stroke 0.25s ease' }}
        />
        {/* Liquid fill — clips from bottom upward */}
        <path
          d={path}
          fill="hsl(0, 80%, 65%)"
          stroke="none"
          style={{
            clipPath: liked ? 'inset(0% 0 0 0)' : 'inset(100% 0 0 0)',
            transition: 'clip-path 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />
      </svg>
    </span>
  );
};

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
  const [rippleKey, setRippleKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  /* Close share menu on outside click */
  const handleShareMenuOutsideClick = useCallback((e: MouseEvent) => {
    if (!shareMenuRef.current?.contains(e.target as Node)) {
      setShowShareMenu(false);
      document.removeEventListener('mousedown', handleShareMenuOutsideClick);
    }
  }, []);

  /* Magnetic tilt */
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const dx = (e.clientX - (left + width / 2)) / (width / 2);
    const dy = (e.clientY - (top + height / 2)) / (height / 2);
    setTilt({ x: dx * 4, y: -dy * 3 });
  }, []);

  const handleMouseLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);

  const handleLike = async () => {
    if (!user) {
      toast({ title: "Sign in to like", description: "Create an account or sign in to like captions." });
      return;
    }
    if (!areLikesSupported()) {
      toast({ title: "Likes unavailable", description: "We're setting things up. Please try again later." });
      return;
    }

    setRippleKey((k) => k + 1);
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

  const shareUrl = `${window.location.origin}/category/${encodeURIComponent(category)}`;
  const shareText = `"${caption}" — ${author}`;

  const openShareMenu = () => {
    setShowShareMenu((v) => !v);
    setTimeout(() => document.addEventListener('mousedown', handleShareMenuOutsideClick), 0);
  };

  const handleShare = async () => {
    const canNativeShare = !!navigator.share && navigator.maxTouchPoints > 0;
    if (canNativeShare) {
      try {
        await navigator.share({
          title: `${category} Caption — CaptionCrafter`,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        if ((err as DOMException)?.name === 'AbortError') return;
      }
    }
    openShareMenu();
  };

  const shareOptions = [
    {
      label: 'Copy Caption',
      icon: Copy,
      action: async () => {
        try {
          await navigator.clipboard.writeText(caption);
          toast({ title: 'Caption copied!' });
        } catch {
          toast({ title: 'Failed to copy', variant: 'destructive' } as Parameters<typeof toast>[0]);
        }
        setShowShareMenu(false);
      },
    },
    {
      label: 'Copy Link',
      icon: Link2,
      action: async () => {
        try {
          await navigator.clipboard.writeText(shareUrl);
          toast({ title: 'Link copied!' });
        } catch {
          toast({ title: 'Failed to copy', variant: 'destructive' } as Parameters<typeof toast>[0]);
        }
        setShowShareMenu(false);
      },
    },
    {
      label: 'Share on X / Twitter',
      icon: Twitter,
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          '_blank', 'noopener'
        );
        setShowShareMenu(false);
      },
    },
    {
      label: 'Share on WhatsApp',
      icon: MessageCircle,
      action: () => {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`,
          '_blank', 'noopener'
        );
        setShowShareMenu(false);
      },
    },
  ];

  const hue = categoryHue(category);

  return (
    <div
      ref={cardRef}
      className="group relative will-change-transform ink-bleed-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(900px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) translateZ(0)`,
        transition: tilt.x === 0 && tilt.y === 0
          ? 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)'
          : 'transform 0.1s ease-out',
      }}
    >
      {/* Card shell */}
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
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            '0 14px 50px hsl(0 0% 0% / 0.55), 0 0 0 1px hsl(38 90% 54% / 0.12)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            '0 4px 24px hsl(0 0% 0% / 0.35)';
        }}
      >
        {/* Decorative quote glyph */}
        <div
          className="absolute top-0 right-4 font-display font-bold pointer-events-none select-none"
          style={{ fontSize: '7rem', color: 'hsl(38 90% 54% / 0.07)', lineHeight: 1 }}
          aria-hidden
        >
          &#8220;
        </div>

        <div className="p-6 space-y-4 relative z-10">
          {/* Author + category */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="h-8 w-8 shrink-0">
                {authorAvatar ? (
                  <AvatarImage src={authorAvatar} alt={author} />
                ) : (
                  <AvatarFallback
                    className="text-xs font-semibold"
                    style={{
                      background: 'linear-gradient(135deg, hsl(38,90%,54%), hsl(25,90%,58%))',
                      color: 'hsl(232,20%,7%)',
                    }}
                  >
                    {author.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <p className="text-sm font-medium truncate" style={{ color: 'hsl(40,20%,78%)' }}>
                {author}
              </p>
            </div>

            <span
              className="shrink-0 text-xs px-2.5 py-1 rounded-full font-medium"
              style={{
                background: `hsl(${hue} 70% 54% / 0.12)`,
                color: `hsl(${hue} 70% 68%)`,
                border: `1px solid hsl(${hue} 70% 54% / 0.22)`,
              }}
            >
              {category}
            </span>
          </div>

          {/* Caption — italic Lora */}
          <div className="min-h-[80px] flex items-start pt-1">
            <p
              className="caption-quote leading-relaxed text-base transition-colors duration-300 group-hover:text-[hsl(40,20%,95%)]"
              style={{ color: 'hsl(40,20%,82%)' }}
            >
              &#8220;{caption}&#8221;
            </p>
          </div>

          {/* Action bar */}
          <div className="flex items-center gap-1 pt-3" style={{ borderTop: '1px solid hsl(240,12%,20%)' }}>

            {/* Like — liquid fill heart */}
            <button
              onClick={handleLike}
              disabled={isUpdating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 hover:scale-105 active:scale-95 disabled:opacity-50"
              style={{
                color: isLiked ? 'hsl(0,80%,65%)' : 'hsl(260,8%,52%)',
                background: isLiked ? 'hsl(0 80% 65% / 0.1)' : 'transparent',
              }}
            >
              <LiquidHeart liked={Boolean(isLiked)} rippleKey={rippleKey} />
              {likes > 0 && (
                <AnimatedNumber value={likes} className="text-xs" />
              )}
            </button>

            {/* Share */}
            <div className="relative" ref={shareMenuRef}>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-150 hover:scale-105 active:scale-95 hover:text-foreground"
                style={{ color: showShareMenu ? 'hsl(38,90%,60%)' : 'hsl(260,8%,52%)' }}
              >
                <Share className="h-4 w-4" />
              </button>

              {/* Share dropdown */}
              {showShareMenu && (
                <div
                  className="absolute bottom-full left-0 mb-2 w-52 rounded-xl overflow-hidden z-50 animate-spring-in"
                  style={{
                    background: 'hsl(235,22%,13%)',
                    border: '1px solid hsl(240,12%,24%)',
                    boxShadow: '0 16px 48px hsl(0 0% 0% / 0.55)',
                  }}
                >
                  <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: '1px solid hsl(240,12%,20%)' }}>
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'hsl(40,20%,55%)' }}>Share</span>
                    <button onClick={() => setShowShareMenu(false)} style={{ color: 'hsl(260,8%,48%)' }}>
                      <XIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {shareOptions.map(({ label, icon: Icon, action }) => (
                    <button
                      key={label}
                      onClick={action}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150"
                      style={{ color: 'hsl(40,20%,72%)' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'hsl(40 20% 92% / 0.05)'; (e.currentTarget as HTMLElement).style.color = 'hsl(40,20%,92%)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'hsl(40,20%,72%)'; }}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Copy */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 hover:scale-105 active:scale-95 ml-auto"
              style={{
                color: copied ? 'hsl(142,70%,52%)' : 'hsl(260,8%,52%)',
                background: copied ? 'hsl(142 70% 52% / 0.1)' : 'transparent',
              }}
            >
              {copied
                ? <Check key="check" className="h-4 w-4 animate-icon-swap" />
                : <Copy key="copy" className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
