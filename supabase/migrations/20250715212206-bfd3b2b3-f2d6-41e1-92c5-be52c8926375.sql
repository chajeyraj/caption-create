-- Add category field to captions table
ALTER TABLE public.captions ADD COLUMN category TEXT;

-- Add an index for better performance when filtering by category
CREATE INDEX idx_captions_category ON public.captions(category);