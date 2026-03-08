ALTER TABLE public.site_hero 
ADD COLUMN IF NOT EXISTS twitter_url text DEFAULT '',
ADD COLUMN IF NOT EXISTS instagram_url text DEFAULT '',
ADD COLUMN IF NOT EXISTS youtube_url text DEFAULT '',
ADD COLUMN IF NOT EXISTS website_url text DEFAULT '';