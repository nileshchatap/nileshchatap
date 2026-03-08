
-- Add project_url to site_projects
ALTER TABLE public.site_projects ADD COLUMN IF NOT EXISTS project_url text DEFAULT '';

-- Add image_url to site_certifications  
ALTER TABLE public.site_certifications ADD COLUMN IF NOT EXISTS image_url text DEFAULT '';

-- Create storage bucket for certificate images
INSERT INTO storage.buckets (id, name, public) VALUES ('certificates', 'certificates', true) ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read certificate images
CREATE POLICY "Anyone can read certificates" ON storage.objects FOR SELECT USING (bucket_id = 'certificates');

-- Allow admins to upload certificate images
CREATE POLICY "Admins can upload certificates" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'certificates' AND is_admin(auth.email()));

-- Allow admins to delete certificate images
CREATE POLICY "Admins can delete certificates" ON storage.objects FOR DELETE USING (bucket_id = 'certificates' AND is_admin(auth.email()));
