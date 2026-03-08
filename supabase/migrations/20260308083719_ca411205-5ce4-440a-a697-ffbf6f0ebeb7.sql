
ALTER TABLE public.site_visitors ADD COLUMN IF NOT EXISTS user_agent text;
ALTER TABLE public.site_visitors ADD COLUMN IF NOT EXISTS screen_size text;
ALTER TABLE public.site_visitors ADD COLUMN IF NOT EXISTS language text;
ALTER TABLE public.site_visitors ADD COLUMN IF NOT EXISTS platform text;
