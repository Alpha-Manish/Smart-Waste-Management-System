-- ==============================================================================
-- Smart Urban Waste Management System: Admin Authorization & Row-Level Security
-- Authorized Admin Email: 2302031800069@silveroakuni.ac.in
-- ==============================================================================

-- 0. Ensure public.complaints has dedicated user_email column and clean up existing data
ALTER TABLE IF EXISTS public.complaints ADD COLUMN IF NOT EXISTS user_email text;

-- Migrate any rows (like row 20) where email was stored in description:
UPDATE public.complaints 
SET 
  user_email = substring(description from '\[Reported By:\s*([^\]]+)\]'),
  description = trim(regexp_replace(description, '\[Reported By:\s*[^\]]+\]\s*', ''))
WHERE description LIKE '[Reported By:%';

-- 1. Helper Function: is_authorized_admin()
-- Evaluates whether the currently authenticated Supabase user matches the authorized admin email.
-- Compares case-insensitively after trimming whitespace.
CREATE OR REPLACE FUNCTION public.is_authorized_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN lower(trim(coalesce(auth.jwt() ->> 'email', ''))) = '2302031800069@silveroakuni.ac.in';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 2. Smart Bins Table (public.bins)
-- Enable Row Level Security
ALTER TABLE IF EXISTS public.bins ENABLE ROW LEVEL SECURITY;

-- Citizens / Authenticated users can view smart bins (for monitoring/public awareness)
DROP POLICY IF EXISTS "Allow authenticated users to read bins" ON public.bins;
CREATE POLICY "Allow authenticated users to read bins"
ON public.bins FOR SELECT
TO authenticated
USING (true);

-- Only Authorized Admin can insert smart bins
DROP POLICY IF EXISTS "Allow authorized admin to insert bins" ON public.bins;
CREATE POLICY "Allow authorized admin to insert bins"
ON public.bins FOR INSERT
TO authenticated
WITH CHECK (public.is_authorized_admin());

-- Only Authorized Admin can update smart bins
DROP POLICY IF EXISTS "Allow authorized admin to update bins" ON public.bins;
CREATE POLICY "Allow authorized admin to update bins"
ON public.bins FOR UPDATE
TO authenticated
USING (public.is_authorized_admin())
WITH CHECK (public.is_authorized_admin());

-- Only Authorized Admin can delete smart bins
DROP POLICY IF EXISTS "Allow authorized admin to delete bins" ON public.bins;
CREATE POLICY "Allow authorized admin to delete bins"
ON public.bins FOR DELETE
TO authenticated
USING (public.is_authorized_admin());

-- 3. Complaints Table (public.complaints)
-- Enable Row Level Security
ALTER TABLE IF EXISTS public.complaints ENABLE ROW LEVEL SECURITY;

-- Citizens and Admin can read complaints
DROP POLICY IF EXISTS "Allow authenticated users to view complaints" ON public.complaints;
CREATE POLICY "Allow authenticated users to view complaints"
ON public.complaints FOR SELECT
TO authenticated
USING (true);

-- Any authenticated citizen can submit a complaint
DROP POLICY IF EXISTS "Allow authenticated users to create complaints" ON public.complaints;
CREATE POLICY "Allow authenticated users to create complaints"
ON public.complaints FOR INSERT
TO authenticated
WITH CHECK (true);

-- ONLY Authorized Admin can update complaint status and details
DROP POLICY IF EXISTS "Allow only authorized admin to update complaints" ON public.complaints;
CREATE POLICY "Allow only authorized admin to update complaints"
ON public.complaints FOR UPDATE
TO authenticated
USING (public.is_authorized_admin())
WITH CHECK (public.is_authorized_admin());

-- ONLY Authorized Admin can delete complaints
DROP POLICY IF EXISTS "Allow only authorized admin to delete complaints" ON public.complaints;
CREATE POLICY "Allow only authorized admin to delete complaints"
ON public.complaints FOR DELETE
TO authenticated
USING (public.is_authorized_admin());

-- 4. Predictions Table (public.predictions)
-- Enable Row Level Security
ALTER TABLE IF EXISTS public.predictions ENABLE ROW LEVEL SECURITY;

-- Only Authorized Admin can read predictions
DROP POLICY IF EXISTS "Allow only authorized admin to select predictions" ON public.predictions;
CREATE POLICY "Allow only authorized admin to select predictions"
ON public.predictions FOR SELECT
TO authenticated
USING (public.is_authorized_admin());

-- Only Authorized Admin can insert predictions
DROP POLICY IF EXISTS "Allow only authorized admin to insert predictions" ON public.predictions;
CREATE POLICY "Allow only authorized admin to insert predictions"
ON public.predictions FOR INSERT
TO authenticated
WITH CHECK (public.is_authorized_admin());

-- Only Authorized Admin can update predictions
DROP POLICY IF EXISTS "Allow only authorized admin to update predictions" ON public.predictions;
CREATE POLICY "Allow only authorized admin to update predictions"
ON public.predictions FOR UPDATE
TO authenticated
USING (public.is_authorized_admin())
WITH CHECK (public.is_authorized_admin());

-- Only Authorized Admin can delete predictions
DROP POLICY IF EXISTS "Allow only authorized admin to delete predictions" ON public.predictions;
CREATE POLICY "Allow only authorized admin to delete predictions"
ON public.predictions FOR DELETE
TO authenticated
USING (public.is_authorized_admin());

-- 5. Storage Buckets (complaint-images)
-- Ensure storage bucket permissions protect admin and citizen images
-- Citizens can upload images
DROP POLICY IF EXISTS "Allow authenticated citizens to upload complaint images" ON storage.objects;
CREATE POLICY "Allow authenticated citizens to upload complaint images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'complaint-images');

-- Authenticated users can view complaint images
DROP POLICY IF EXISTS "Allow authenticated users to view complaint images" ON storage.objects;
CREATE POLICY "Allow authenticated users to view complaint images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'complaint-images');

-- Only authorized admin can delete or overwrite stored complaint images
DROP POLICY IF EXISTS "Allow only authorized admin to delete complaint images" ON storage.objects;
CREATE POLICY "Allow only authorized admin to delete complaint images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'complaint-images' AND public.is_authorized_admin());
