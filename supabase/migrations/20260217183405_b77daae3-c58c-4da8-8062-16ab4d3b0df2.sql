
-- Create admin_users table first
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Insert admin emails
INSERT INTO public.admin_users (email) VALUES
  ('nileshchatap25@gmail.com'),
  ('vishnubabalsure@gmail.com');

-- Create admin check function
CREATE OR REPLACE FUNCTION public.is_admin(_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE email = _email
  );
$$;

-- Create submissions table
CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can submit" ON public.submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view submissions" ON public.submissions
  FOR SELECT TO authenticated
  USING (public.is_admin(auth.email()));

CREATE POLICY "Admins can delete submissions" ON public.submissions
  FOR DELETE TO authenticated
  USING (public.is_admin(auth.email()));

CREATE POLICY "Admins can view admin_users" ON public.admin_users
  FOR SELECT TO authenticated
  USING (public.is_admin(auth.email()));
