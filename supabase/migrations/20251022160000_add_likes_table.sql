-- Add likes column to captions if missing
ALTER TABLE public.captions
ADD COLUMN IF NOT EXISTS likes INTEGER NOT NULL DEFAULT 0;

-- Create likes table for tracking user likes on captions
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  caption_id UUID NOT NULL REFERENCES public.captions(id) ON DELETE CASCADE
);

-- Ensure counts on existing captions are initialized
UPDATE public.captions
SET likes = COALESCE(likes, 0)
WHERE likes IS NULL;

-- Enforce uniqueness of user likes per caption
ALTER TABLE public.likes
ADD CONSTRAINT likes_user_caption_key UNIQUE (user_id, caption_id);

-- Helpful indexes for querying likes
CREATE INDEX IF NOT EXISTS likes_user_id_idx ON public.likes (user_id);
CREATE INDEX IF NOT EXISTS likes_caption_id_idx ON public.likes (caption_id);

-- Enable Row Level Security for likes table
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read likes
CREATE POLICY "Likes are viewable by everyone"
ON public.likes
FOR SELECT
USING (true);

-- Allow users to like captions on their own behalf
CREATE POLICY "Users can insert their own likes"
ON public.likes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to remove their own likes
CREATE POLICY "Users can delete their own likes"
ON public.likes
FOR DELETE
USING (auth.uid() = user_id);

