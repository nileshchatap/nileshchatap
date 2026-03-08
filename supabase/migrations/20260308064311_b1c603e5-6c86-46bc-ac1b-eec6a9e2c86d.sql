CREATE TABLE public.newsletter_subscribers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view subscribers" ON public.newsletter_subscribers
  FOR SELECT USING (is_admin(auth.email()));

CREATE POLICY "Admins can delete subscribers" ON public.newsletter_subscribers
  FOR DELETE USING (is_admin(auth.email()));