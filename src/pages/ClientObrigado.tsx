import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle, ArrowRight, Zap, PartyPopper } from "lucide-react";
import confetti from "canvas-confetti";

const ClientObrigado = () => {
  const [loading, setLoading] = useState(true);
  const [activated, setActivated] = useState(false);
  const navigate = useNavigate();
  
  // Detecta o plano do localStorage ou do perfil pendente
  const [planType, setPlanType] = useState<string>('trial');

  useEffect(() => {
    const activatePayment = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast.error("Faça login para continuar");
          navigate('/cliente/auth');
          return;
        }

        // Busca os dados do cliente incluindo o plano pendente (da nuvem)
        const { data: clientData, error: fetchError } = await supabase
          .from('platform_clients')
          .select('pending_plan_type')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (fetchError) throw fetchError;

        // Usa o plano pendente salvo no banco ou default para trial
        const detectedPlan = clientData?.pending_plan_type || 'trial';
        setPlanType(detectedPlan);

        const now = new Date();
        let updateData: any = {
          is_paid: true,
          paid_at: now.toISOString(),
          plan_type: detectedPlan,
          site_blocked: false,
          pending_plan_type: null // Limpa o plano pendente após ativar
        };

        if (detectedPlan === 'trial') {
          updateData.plan_amount = 247;
          updateData.trial_ends_at = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
        } else if (detectedPlan === 'annual') {
          updateData.plan_amount = 797;
          updateData.subscription_ends_at = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString();
        }

        const { error } = await supabase
          .from('platform_clients')
          .update(updateData)
          .eq('user_id', session.user.id);

        if (error) throw error;

        setActivated(true);
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });

      } catch (error) {
        console.error('Error activating payment:', error);
        toast.error("Erro ao ativar pagamento");
      } finally {
        setLoading(false);
      }
    };

    activatePayment();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white font-bold">Ativando seu acesso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-green-950/50 via-black to-emerald-950/30" />

      <div className="relative z-10 w-full max-w-lg">
        <Card className="bg-zinc-900/90 border border-green-500/30 backdrop-blur-sm overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-1" />
          <CardContent className="p-10 text-center">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-14 h-14 text-green-400" />
            </div>

            <div className="flex items-center justify-center gap-2 mb-4">
              <PartyPopper className="w-6 h-6 text-yellow-400" />
              <span className="text-yellow-400 font-black text-lg">PARABÉNS!</span>
              <PartyPopper className="w-6 h-6 text-yellow-400" />
            </div>

            <h1 className="text-3xl font-black text-white mb-4">
              {planType === 'annual' ? 'Renovação Confirmada!' : 'Pagamento Confirmado!'}
            </h1>

            <p className="text-white/70 text-lg mb-8">
              {planType === 'annual' 
                ? 'Seu site permanecerá ativo por mais 1 ano!'
                : 'Sua área de membros está sendo preparada. Descreva seu projeto para começarmos.'}
            </p>

            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                <div className="flex items-center gap-3 justify-center mb-2">
                  <Zap className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-bold">
                    {planType === 'trial' ? 'Próximo Passo' : 'Tudo Pronto'}
                  </span>
                </div>
                <p className="text-white/60 text-sm">
                  {planType === 'trial' 
                    ? 'Descreva seu produto para criarmos sua página de vendas e área de membros.'
                    : 'Seu site continua ativo. Acesse o dashboard para gerenciar.'}
                </p>
              </div>

              <Button
                onClick={() => navigate('/cliente/dashboard')}
                className="w-full bg-green-500 hover:bg-green-400 text-black font-black py-6 text-lg"
              >
                {planType === 'trial' ? 'DESCREVER MEU PROJETO' : 'IR PARA DASHBOARD'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientObrigado;