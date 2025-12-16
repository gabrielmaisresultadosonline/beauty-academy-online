-- Adiciona colunas para informações do site pronto pelo admin
ALTER TABLE public.platform_clients 
ADD COLUMN IF NOT EXISTS site_url text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS admin_instructions text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS site_completed_at timestamp with time zone DEFAULT NULL;