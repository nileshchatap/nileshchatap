
-- Allow authenticated users to check only their own admin status (avoids recursion for SECURITY INVOKER is_admin)
CREATE POLICY "Users can check own admin status"
ON public.admin_users FOR SELECT
TO authenticated
USING (email = auth.email());

-- Recreate is_admin WITHOUT SECURITY DEFINER (fixes SECURITY DEFINER findings)
CREATE OR REPLACE FUNCTION public.is_admin(_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE email = _email
  );
$function$;

-- Drop unique_visitor_count (SECURITY DEFINER); admin counts via RLS-protected SELECT instead
DROP FUNCTION IF EXISTS public.unique_visitor_count();

-- site_visitors: restrict SELECT to admins only (fixes PII/IP exposure)
DROP POLICY IF EXISTS "Anyone can read visit count" ON public.site_visitors;
CREATE POLICY "Admins can read visitors"
ON public.site_visitors FOR SELECT
TO authenticated
USING (public.is_admin(auth.email()));

-- site_visitors INSERT: replace WITH CHECK (true) with input validation
DROP POLICY IF EXISTS "Anyone can insert visits" ON public.site_visitors;
CREATE POLICY "Anyone can insert visits"
ON public.site_visitors FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(visitor_id) BETWEEN 1 AND 100
  AND (page IS NULL OR length(page) <= 500)
  AND (user_agent IS NULL OR length(user_agent) <= 1000)
);

-- site_visitors DELETE: replace USING (true) with admin check
DROP POLICY IF EXISTS "Authenticated users can delete visits" ON public.site_visitors;
CREATE POLICY "Admins can delete visits"
ON public.site_visitors FOR DELETE
TO authenticated
USING (public.is_admin(auth.email()));

-- submissions INSERT: validate input shape (fixes always-true)
DROP POLICY IF EXISTS "Anyone can submit" ON public.submissions;
CREATE POLICY "Anyone can submit"
ON public.submissions FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(name) BETWEEN 1 AND 200
  AND length(email) BETWEEN 5 AND 320
  AND email LIKE '%@%.%'
  AND length(message) BETWEEN 1 AND 5000
  AND (phone IS NULL OR length(phone) <= 50)
);

-- newsletter_subscribers INSERT: validate email (fixes always-true)
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe"
ON public.newsletter_subscribers FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(email) BETWEEN 5 AND 320
  AND email LIKE '%@%.%'
);

-- Drop storage SELECT policies on public buckets so file listing is blocked
-- (files remain accessible via public CDN URLs because buckets are marked public)
DROP POLICY IF EXISTS "Public read profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read certificates" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read resumes" ON storage.objects;
