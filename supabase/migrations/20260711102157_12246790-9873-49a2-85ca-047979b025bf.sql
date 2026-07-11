
-- Helper: only signed-in admins can write
-- Uses existing public.is_admin(text) function against auth.jwt() email

-- 1. Achievements
CREATE TABLE public.site_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'Award',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_achievements TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_achievements TO authenticated;
GRANT ALL ON public.site_achievements TO service_role;
ALTER TABLE public.site_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read achievements" ON public.site_achievements FOR SELECT USING (true);
CREATE POLICY "Admin write achievements" ON public.site_achievements
  FOR ALL TO authenticated
  USING (public.is_admin((auth.jwt() ->> 'email')))
  WITH CHECK (public.is_admin((auth.jwt() ->> 'email')));

-- 2. Services
CREATE TABLE public.site_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'Sparkles',
  price TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_services TO authenticated;
GRANT ALL ON public.site_services TO service_role;
ALTER TABLE public.site_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read services" ON public.site_services FOR SELECT USING (true);
CREATE POLICY "Admin write services" ON public.site_services
  FOR ALL TO authenticated
  USING (public.is_admin((auth.jwt() ->> 'email')))
  WITH CHECK (public.is_admin((auth.jwt() ->> 'email')));

-- 3. Gallery
CREATE TABLE public.site_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT '',
  caption TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_gallery TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_gallery TO authenticated;
GRANT ALL ON public.site_gallery TO service_role;
ALTER TABLE public.site_gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read gallery" ON public.site_gallery FOR SELECT USING (true);
CREATE POLICY "Admin write gallery" ON public.site_gallery
  FOR ALL TO authenticated
  USING (public.is_admin((auth.jwt() ->> 'email')))
  WITH CHECK (public.is_admin((auth.jwt() ->> 'email')));

-- 4. Testimonials
CREATE TABLE public.site_testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  quote TEXT NOT NULL,
  avatar_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_testimonials TO authenticated;
GRANT ALL ON public.site_testimonials TO service_role;
ALTER TABLE public.site_testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read testimonials" ON public.site_testimonials FOR SELECT USING (true);
CREATE POLICY "Admin write testimonials" ON public.site_testimonials
  FOR ALL TO authenticated
  USING (public.is_admin((auth.jwt() ->> 'email')))
  WITH CHECK (public.is_admin((auth.jwt() ->> 'email')));

-- 5. SEO (single row)
CREATE TABLE public.site_seo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meta_title TEXT NOT NULL DEFAULT '',
  meta_description TEXT NOT NULL DEFAULT '',
  keywords TEXT NOT NULL DEFAULT '',
  og_image_url TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_seo TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_seo TO authenticated;
GRANT ALL ON public.site_seo TO service_role;
ALTER TABLE public.site_seo ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read seo" ON public.site_seo FOR SELECT USING (true);
CREATE POLICY "Admin write seo" ON public.site_seo
  FOR ALL TO authenticated
  USING (public.is_admin((auth.jwt() ->> 'email')))
  WITH CHECK (public.is_admin((auth.jwt() ->> 'email')));
INSERT INTO public.site_seo (meta_title, meta_description, keywords) VALUES ('Nilesh Chatap — Portfolio', 'Personal portfolio of Nilesh Chatap.', 'portfolio, developer, nilesh chatap');

-- 6. Site settings (single row)
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT NOT NULL DEFAULT 'Portfolio',
  favicon_url TEXT NOT NULL DEFAULT '',
  primary_color TEXT NOT NULL DEFAULT '#8b5cf6',
  accent_color TEXT NOT NULL DEFAULT '#ec4899',
  notification_email TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admin write settings" ON public.site_settings
  FOR ALL TO authenticated
  USING (public.is_admin((auth.jwt() ->> 'email')))
  WITH CHECK (public.is_admin((auth.jwt() ->> 'email')));
INSERT INTO public.site_settings (site_name, notification_email) VALUES ('Nilesh Chatap Portfolio', 'nileshchatap25@gmail.com');
