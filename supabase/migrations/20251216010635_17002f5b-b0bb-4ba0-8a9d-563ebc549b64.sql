-- Add payment link column to platform_settings
ALTER TABLE public.platform_settings 
ADD COLUMN infinitepay_link text,
ADD COLUMN thank_you_url text;