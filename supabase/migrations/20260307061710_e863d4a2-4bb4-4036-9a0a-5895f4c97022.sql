
-- Update admin emails
DELETE FROM public.admin_users WHERE email = 'vishnubabalsure@gmail.com';
INSERT INTO public.admin_users (email) VALUES ('vishnu53@myyahoo.com')
ON CONFLICT (email) DO NOTHING;
INSERT INTO public.admin_users (email) VALUES ('nileshchatap25@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Hero content table
CREATE TABLE public.site_hero (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL DEFAULT 'Nilesh Chatap',
  tagline text NOT NULL DEFAULT 'Intern Infosys Springboard | Edunet Foundation | Elevate Lab | Google Student Ambassador | C | Python | Data Analyst | Data Structure | AI',
  location text NOT NULL DEFAULT 'Beed, Maharashtra, India',
  email text NOT NULL DEFAULT 'nileshchatap25@gmail.com',
  phone text DEFAULT '9021412625',
  linkedin_url text DEFAULT 'https://www.linkedin.com/in/nilesh-chatap-967101348',
  github_url text DEFAULT 'https://github.com/NileshChatap2625-Star',
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_hero ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read hero" ON public.site_hero FOR SELECT USING (true);
CREATE POLICY "Admins can update hero" ON public.site_hero FOR UPDATE TO authenticated USING (is_admin(auth.email()));
INSERT INTO public.site_hero DEFAULT VALUES;

-- Experience table
CREATE TABLE public.site_experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL,
  role text NOT NULL,
  period text NOT NULL,
  location text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_experiences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read experiences" ON public.site_experiences FOR SELECT USING (true);
CREATE POLICY "Admins can insert experiences" ON public.site_experiences FOR INSERT TO authenticated WITH CHECK (is_admin(auth.email()));
CREATE POLICY "Admins can update experiences" ON public.site_experiences FOR UPDATE TO authenticated USING (is_admin(auth.email()));
CREATE POLICY "Admins can delete experiences" ON public.site_experiences FOR DELETE TO authenticated USING (is_admin(auth.email()));

INSERT INTO public.site_experiences (company, role, period, location, sort_order) VALUES
('Infosys Springboard', 'Artificial Intelligence', 'January 2026 - Present (2 months)', 'Pune, Maharashtra, India', 0),
('Edunet Foundation', 'Artificial Intelligence and Machine Learning', 'December 2025 - February 2026 (3 months)', 'Bengaluru, Karnataka, India', 1),
('Google Student Ambassador Program X MCE', 'Google Student Ambassador', 'September 2025 - February 2026 (6 months)', 'Maharashtra, India', 2),
('Elevate Labs', 'Data Analyst Intern', 'September 2025 - November 2025 (3 months)', 'Bengaluru, Karnataka, India', 3);

-- Education table
CREATE TABLE public.site_education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution text NOT NULL,
  degree text NOT NULL,
  period text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_education ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read education" ON public.site_education FOR SELECT USING (true);
CREATE POLICY "Admins can insert education" ON public.site_education FOR INSERT TO authenticated WITH CHECK (is_admin(auth.email()));
CREATE POLICY "Admins can update education" ON public.site_education FOR UPDATE TO authenticated USING (is_admin(auth.email()));
CREATE POLICY "Admins can delete education" ON public.site_education FOR DELETE TO authenticated USING (is_admin(auth.email()));

INSERT INTO public.site_education (institution, degree, period, sort_order) VALUES
('Savitribai Phule Pune University', 'Bachelor of Engineering - BE, Artificial Intelligence', 'September 2024 - July 2028', 0),
('ADSULS Technical Campus Faculty of MBA, Ahmednagar', 'Bachelor of Engineering - BE, Artificial Intelligence', 'September 2024 - June 2028', 1),
('Dnyaneshwar Mauli Maydhmic & Uchh-Maydhmic Vidhyalaya, Pimpari', 'Science', 'June 2023 - March 2024', 2),
('Vasant Vidhyalaya, Kaij', 'Primary School, Science', 'June 2021 - June 2022', 3);

-- Skills table
CREATE TABLE public.site_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);
ALTER TABLE public.site_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read skills" ON public.site_skills FOR SELECT USING (true);
CREATE POLICY "Admins can insert skills" ON public.site_skills FOR INSERT TO authenticated WITH CHECK (is_admin(auth.email()));
CREATE POLICY "Admins can delete skills" ON public.site_skills FOR DELETE TO authenticated USING (is_admin(auth.email()));

INSERT INTO public.site_skills (name, sort_order) VALUES
('pandas',0),('Artificial Intelligence',1),('Machine Learning',2),('C',3),('Python',4),('Data Analyst',5),('Data Structure',6),('Scikit-learn',7),('NumPy',8),('Linear Regression',9),('Git',10),('Data Science',11),('SQL',12),('DBMS',13),('Prompt Engineering',14),('Deep Learning',15),('LLM',16);

-- Certifications table
CREATE TABLE public.site_certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);
ALTER TABLE public.site_certifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read certifications" ON public.site_certifications FOR SELECT USING (true);
CREATE POLICY "Admins can insert certifications" ON public.site_certifications FOR INSERT TO authenticated WITH CHECK (is_admin(auth.email()));
CREATE POLICY "Admins can delete certifications" ON public.site_certifications FOR DELETE TO authenticated USING (is_admin(auth.email()));

INSERT INTO public.site_certifications (name, sort_order) VALUES
('Google Student Ambassador Certified (6 Month)',0),
('Generative AI: Prompt Engineering Basics',1),
('Microsoft Azure SQL',2),
('GenAI in Data Analytics',3),
('Tata - GenAI Powered Data Analytics Job Simulation',4),
('Conditional Formatting, Tables and Charts in Microsoft Excel',5),
('5-Day AI Agents Intensive Course with Google',6),
('Getting Started with Generative AI - Certified in IBM',7),
('Introduction to Gen AI - Certified in Google Cloud',8);

-- Projects table
CREATE TABLE public.site_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  bullets jsonb NOT NULL DEFAULT '[]'::jsonb,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read projects" ON public.site_projects FOR SELECT USING (true);
CREATE POLICY "Admins can insert projects" ON public.site_projects FOR INSERT TO authenticated WITH CHECK (is_admin(auth.email()));
CREATE POLICY "Admins can update projects" ON public.site_projects FOR UPDATE TO authenticated USING (is_admin(auth.email()));
CREATE POLICY "Admins can delete projects" ON public.site_projects FOR DELETE TO authenticated USING (is_admin(auth.email()));

INSERT INTO public.site_projects (title, description, bullets, sort_order) VALUES
('Youtube Trending Video Analytics', '', '["Analyzed YouTube trending data using Python & Pandas to identify engagement","Performed statistical analysis on views, likes, categories, posting time, and keywords to understand trend drivers","Created visual dashboards to highlight top categories, growth trends, and virality insights"]'::jsonb, 0),
('JARVIS AI Control With Voice', '', '["Developed a Python-based voice-controlled AI assistant to automate system tasks, searches, reminders, and file operations","Integrated speech recognition & text-to-speech for real-time interaction and continuous listening","Designed a modular, scalable architecture enabling easy feature expansion and intelligent responses"]'::jsonb, 1),
('SmartHelp AI — Enterprise Customer Support Agent', '', '["Built and implemented a custom AI agent using the Kaggle AI Agents Intensive framework","Implemented task execution, reasoning, and decision logic in an agent system","Used prompt engineering and evaluation metrics to improve agent output","Built and tested autonomous agent behavior in real-world scenarios","Earned Kaggle badge for AI Agents Capstone completion"]'::jsonb, 2);
