
-- Remove "Current Working" stat
DELETE FROM site_stats WHERE id = 'aa09f53a-0f17-4026-af70-6878bbce53e7';

-- Create visitor tracking table
CREATE TABLE public.site_visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id text NOT NULL,
  visited_at timestamp with time zone NOT NULL DEFAULT now(),
  page text DEFAULT '/'
);

-- Enable RLS but allow anonymous inserts and reads
ALTER TABLE public.site_visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert visits" ON public.site_visitors FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can read visit count" ON public.site_visitors FOR SELECT TO anon, authenticated USING (true);
