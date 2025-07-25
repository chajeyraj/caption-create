-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create captions table
CREATE TABLE public.captions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.captions ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policies for captions
CREATE POLICY "Captions are viewable by everyone" 
ON public.captions 
FOR SELECT 
USING (true);

CREATE POLICY "Users can view their own captions" 
ON public.captions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all captions" 
ON public.captions 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid()::text AND is_admin = true
  )
);

CREATE POLICY "Users can insert their own captions" 
ON public.captions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own captions" 
ON public.captions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own captions" 
ON public.captions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_captions_updated_at
BEFORE UPDATE ON public.captions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create storage bucket for caption images
INSERT INTO storage.buckets (id, name, public) VALUES ('captions', 'captions', true);

-- Create storage policies for caption images
CREATE POLICY "Caption images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'captions');

CREATE POLICY "Authenticated users can upload caption images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'captions' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own caption images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'captions' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own caption images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'captions' AND auth.role() = 'authenticated');