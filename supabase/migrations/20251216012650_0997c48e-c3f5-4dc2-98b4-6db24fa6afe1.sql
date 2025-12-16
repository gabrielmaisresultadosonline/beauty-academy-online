-- Create table for platform clients (people who buy the membership area service)
CREATE TABLE public.platform_clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  is_paid BOOLEAN DEFAULT false,
  paid_at TIMESTAMP WITH TIME ZONE,
  -- Site request info filled after payment
  product_name TEXT,
  product_type TEXT,
  product_description TEXT,
  target_audience TEXT,
  product_price NUMERIC,
  infinitepay_username TEXT,
  additional_notes TEXT,
  site_status TEXT DEFAULT 'pending', -- pending, in_progress, completed
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.platform_clients ENABLE ROW LEVEL SECURITY;

-- Users can view and update their own record
CREATE POLICY "Users can view own client profile"
  ON public.platform_clients
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own client profile"
  ON public.platform_clients
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own client profile"
  ON public.platform_clients
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can do everything
CREATE POLICY "Admins can manage all client profiles"
  ON public.platform_clients
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger to update updated_at
CREATE TRIGGER update_platform_clients_updated_at
  BEFORE UPDATE ON public.platform_clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();