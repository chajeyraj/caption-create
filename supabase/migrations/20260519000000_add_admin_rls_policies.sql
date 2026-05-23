-- Enable RLS on captions if not already enabled
ALTER TABLE public.captions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read captions (public browse)
CREATE POLICY IF NOT EXISTS "captions_select_public"
  ON public.captions FOR SELECT
  USING (true);

-- Allow authenticated users to insert their own captions
CREATE POLICY IF NOT EXISTS "captions_insert_own"
  ON public.captions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own captions, admins can update any
CREATE POLICY IF NOT EXISTS "captions_update_own_or_admin"
  ON public.captions FOR UPDATE
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Allow users to delete their own captions, admins can delete any
CREATE POLICY IF NOT EXISTS "captions_delete_own_or_admin"
  ON public.captions FOR DELETE
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );
