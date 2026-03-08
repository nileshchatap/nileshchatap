
ALTER TABLE public.site_hero ADD COLUMN IF NOT EXISTS photo_url text DEFAULT '';

INSERT INTO storage.buckets (id, name, public) VALUES ('profile-photos', 'profile-photos', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Public read profile photos" ON storage.objects FOR SELECT USING (bucket_id = 'profile-photos');
CREATE POLICY "Admin upload profile photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profile-photos' AND (SELECT is_admin(auth.email())));
CREATE POLICY "Admin delete profile photos" ON storage.objects FOR DELETE USING (bucket_id = 'profile-photos' AND (SELECT is_admin(auth.email())));
CREATE POLICY "Admin update profile photos" ON storage.objects FOR UPDATE USING (bucket_id = 'profile-photos' AND (SELECT is_admin(auth.email())));

CREATE POLICY "Admins can update certifications" ON public.site_certifications FOR UPDATE USING (is_admin(auth.email()));
CREATE POLICY "Admins can update skills" ON public.site_skills FOR UPDATE USING (is_admin(auth.email()));
