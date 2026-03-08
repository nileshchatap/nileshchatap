
ALTER TABLE public.site_visitors ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE public.site_visitors ADD COLUMN IF NOT EXISTS country text;
ALTER TABLE public.site_visitors ADD COLUMN IF NOT EXISTS ip_address text;
