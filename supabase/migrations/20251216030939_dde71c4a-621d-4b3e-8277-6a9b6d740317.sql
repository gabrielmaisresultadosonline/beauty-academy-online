-- Adiciona coluna para armazenar o plano pendente antes do pagamento
ALTER TABLE public.platform_clients 
ADD COLUMN IF NOT EXISTS pending_plan_type text DEFAULT NULL;