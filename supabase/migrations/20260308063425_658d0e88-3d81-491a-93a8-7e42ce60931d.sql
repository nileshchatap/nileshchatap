ALTER TABLE public.site_hero 
ADD COLUMN IF NOT EXISTS kaggle_url text DEFAULT '',
ADD COLUMN IF NOT EXISTS other_url text DEFAULT '',
ADD COLUMN IF NOT EXISTS other_url_label text DEFAULT '';