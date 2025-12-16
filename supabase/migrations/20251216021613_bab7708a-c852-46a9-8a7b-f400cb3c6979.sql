-- Adicionar colunas para gerenciar planos e descrições do site
ALTER TABLE public.platform_clients 
ADD COLUMN IF NOT EXISTS plan_type text DEFAULT 'trial',
ADD COLUMN IF NOT EXISTS plan_amount numeric DEFAULT 247,
ADD COLUMN IF NOT EXISTS trial_ends_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS subscription_ends_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS site_blocked boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS existing_site_url text,
ADD COLUMN IF NOT EXISTS site_description_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS phone_number text,
ADD COLUMN IF NOT EXISTS payment_link text;

-- Criar tabela para histórico de pagamentos dos clientes
CREATE TABLE IF NOT EXISTS public.client_payments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid NOT NULL REFERENCES public.platform_clients(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  amount numeric NOT NULL,
  plan_type text NOT NULL DEFAULT 'trial',
  payment_provider text DEFAULT 'infinitepay',
  payment_reference text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.client_payments ENABLE ROW LEVEL SECURITY;

-- Policies for client_payments
CREATE POLICY "Users can view own client_payments" 
ON public.client_payments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own client_payments" 
ON public.client_payments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all client_payments" 
ON public.client_payments 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));