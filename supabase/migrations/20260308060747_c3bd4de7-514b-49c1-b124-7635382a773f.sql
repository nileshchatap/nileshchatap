
CREATE TABLE public.site_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon text NOT NULL DEFAULT 'Award',
  value text NOT NULL DEFAULT '0',
  label text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);

ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read stats" ON public.site_stats FOR SELECT USING (true);
CREATE POLICY "Admins can insert stats" ON public.site_stats FOR INSERT WITH CHECK (is_admin(auth.email()));
CREATE POLICY "Admins can update stats" ON public.site_stats FOR UPDATE USING (is_admin(auth.email()));
CREATE POLICY "Admins can delete stats" ON public.site_stats FOR DELETE USING (is_admin(auth.email()));

INSERT INTO public.site_stats (icon, value, label, sort_order) VALUES
  ('Award', '3+', 'Years Experience', 0),
  ('Users', '100+', 'Students Trained', 1),
  ('FolderKanban', '15+', 'Projects Completed', 2),
  ('Code', '10+', 'Tools Mastered', 3);
