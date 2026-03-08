
-- Add resume_url column to site_hero
ALTER TABLE public.site_hero ADD COLUMN IF NOT EXISTS resume_url text DEFAULT '';

-- Create resumes storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for resumes bucket
CREATE POLICY "Anyone can read resumes" ON storage.objects FOR SELECT USING (bucket_id = 'resumes');
CREATE POLICY "Admins can upload resumes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resumes' AND is_admin(auth.email()));
CREATE POLICY "Admins can update resumes" ON storage.objects FOR UPDATE USING (bucket_id = 'resumes' AND is_admin(auth.email()));
CREATE POLICY "Admins can delete resumes" ON storage.objects FOR DELETE USING (bucket_id = 'resumes' AND is_admin(auth.email()));
