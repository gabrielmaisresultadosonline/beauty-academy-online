-- Create platform_settings table for storing pixel codes and other configs per product
CREATE TABLE public.platform_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_slug text NOT NULL UNIQUE,
  facebook_pixel_code text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can manage settings
CREATE POLICY "Admins can manage platform_settings"
ON public.platform_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can read settings (needed for pixel to load on public pages)
CREATE POLICY "Anyone can read platform_settings"
ON public.platform_settings
FOR SELECT
USING (true);

-- Insert default rows for existing products
INSERT INTO public.platform_settings (product_slug) VALUES ('belezalisoperfeito'), ('comunidademusica');

-- Create trigger for updated_at
CREATE TRIGGER update_platform_settings_updated_at
BEFORE UPDATE ON public.platform_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();