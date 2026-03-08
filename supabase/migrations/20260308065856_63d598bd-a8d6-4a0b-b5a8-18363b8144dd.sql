
CREATE TABLE public.site_about (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL DEFAULT '',
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.site_about ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read about" ON public.site_about FOR SELECT USING (true);
CREATE POLICY "Admins can update about" ON public.site_about FOR UPDATE USING (is_admin(auth.email()));

INSERT INTO public.site_about (content) VALUES ('Passionate and driven Data Science enthusiast with hands-on experience in Python, Machine Learning, and AI. Currently interning at Infosys Springboard and Edunet Foundation, I thrive on turning raw data into actionable insights. A Google Student Ambassador and continuous learner, I am committed to building innovative solutions that make a real-world impact.');
