import { Book, Coffee, Heart, Quote, Smile, Star, Sun, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface CategoryMeta {
  name: string;
  description: string;
  icon: LucideIcon;
  /** Tailwind `from-…/to-…` gradient (used for icon background) */
  gradient: string;
  /** Light/dark soft background gradient for card surfaces */
  bg: string;
}

export const CATEGORY_META: CategoryMeta[] = [
  {
    name: "Motivational",
    description: "Inspire yourself and others with powerful words",
    icon: Zap,
    gradient: "from-teal-500 to-emerald-500",
    bg: "bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/10",
  },
  {
    name: "Love & Romance",
    description: "Express your feelings with captions that land",
    icon: Heart,
    gradient: "from-pink-500 to-red-500",
    bg: "bg-gradient-to-br from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/10",
  },
  {
    name: "Funny",
    description: "Bring laughter to your social media feeds",
    icon: Smile,
    gradient: "from-yellow-500 to-orange-500",
    bg: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10",
  },
  {
    name: "Success",
    description: "Celebrate progress, milestones, and wins",
    icon: Star,
    gradient: "from-purple-500 to-cyan-500",
    bg: "bg-gradient-to-br from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/10",
  },
  {
    name: "Life Quotes",
    description: "Find thoughtful words for everyday moments",
    icon: Quote,
    gradient: "from-green-500 to-teal-500",
    bg: "bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/10",
  },
  {
    name: "Good Morning",
    description: "Start the day with warm, fresh captions",
    icon: Sun,
    gradient: "from-orange-500 to-pink-500",
    bg: "bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/10",
  },
  {
    name: "Coffee",
    description: "For coffee lovers",
    icon: Coffee,
    gradient: "from-amber-600 to-yellow-500",
    bg: "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/10",
  },
  {
    name: "Books",
    description: "Literary inspiration",
    icon: Book,
    gradient: "from-cyan-500 to-teal-500",
    bg: "bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/10",
  },
  {
    name: "தமிழ்",
    description: "Tamil quotes and wisdom",
    icon: Quote,
    gradient: "from-red-500 to-orange-500",
    bg: "bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/10",
  },
  {
    name: "සිංහල",
    description: "Sinhala quotes and wisdom",
    icon: Quote,
    gradient: "from-blue-500 to-indigo-500",
    bg: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/10",
  },
  {
    name: "中文",
    description: "Chinese quotes and wisdom",
    icon: Quote,
    gradient: "from-red-600 to-yellow-500",
    bg: "bg-gradient-to-br from-red-50 to-yellow-50 dark:from-red-900/20 dark:to-yellow-900/10",
  },
  {
    name: "हिन्दी",
    description: "Hindi quotes and wisdom",
    icon: Quote,
    gradient: "from-green-600 to-yellow-500",
    bg: "bg-gradient-to-br from-green-50 to-yellow-50 dark:from-green-900/20 dark:to-yellow-900/10",
  },
];

export const CATEGORIES = CATEGORY_META.map((c) => c.name);
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_GRADIENTS: Record<string, string> = CATEGORY_META.reduce(
  (acc, c) => {
    acc[c.name] = c.gradient;
    return acc;
  },
  {} as Record<string, string>,
);
