import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Music, Loader2, PartyPopper } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

export default function SpotMusicObrigado() {
  const { user, isLoading, refreshPremiumStatus } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isActivating, setIsActivating] = useState(false);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/comunidademusica/login');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user && !activated && !isActivating) {
      activatePremium();
    }
  }, [user]);

  const activatePremium = async () => {
    if (!user) return;
    
    setIsActivating(true);
    
    try {
      // Record payment
      await supabase.from('payments').insert({
        user_id: user.id,
        amount: 47.00,
        status: 'completed',
        payment_provider: 'infinitepay'
      });

      // Activate premium
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_premium: true,
          premium_activated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) {
        toast({
          title: 'Erro ao ativar premium',
          description: 'Entre em contato com o suporte.',
          variant: 'destructive'
        });
      } else {
        setActivated(true);
        await refreshPremiumStatus();
        
        // Trigger confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        toast({
          title: 'Premium ativado!',
          description: 'Bem-vindo ao SpotMusic Premium!'
        });
      }
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Algo deu errado. Tente novamente.',
        variant: 'destructive'
      });
    }
    
    setIsActivating(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-spotmusic-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-spotmusic-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-spotmusic-dark flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-spotmusic-green/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-spotmusic-amber/5 rounded-full blur-3xl" />
      </div>

      <Card className="max-w-md w-full bg-spotmusic-card border-spotmusic-border relative z-10">
        <CardContent className="p-8 text-center space-y-6">
          {isActivating ? (
            <>
              <Loader2 className="w-16 h-16 text-spotmusic-green mx-auto animate-spin" />
              <h2 className="text-2xl font-bold text-spotmusic-foreground">
                Ativando seu acesso...
              </h2>
              <p className="text-spotmusic-muted">
                Aguarde um momento enquanto configuramos sua conta premium.
              </p>
            </>
          ) : activated ? (
            <>
              <div className="relative">
                <CheckCircle className="w-20 h-20 text-spotmusic-green mx-auto" />
                <PartyPopper className="w-8 h-8 text-spotmusic-amber absolute -top-2 -right-2 animate-bounce" />
              </div>
              <h2 className="text-2xl font-bold text-spotmusic-foreground">
                Obrigado pela compra!
              </h2>
              <p className="text-spotmusic-muted">
                Seu acesso premium foi ativado com sucesso. 
                Agora você tem acesso ilimitado a todo o catálogo do SpotMusic!
              </p>
              <div className="bg-spotmusic-dark rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-spotmusic-muted">Plano</span>
                  <span className="text-spotmusic-foreground font-medium">Premium Vitalício</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-spotmusic-muted">Valor</span>
                  <span className="text-spotmusic-green font-medium">R$ 47,00</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-spotmusic-muted">Status</span>
                  <span className="text-spotmusic-green font-medium flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Ativo
                  </span>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/comunidademusica/dashboard')}
                className="w-full bg-spotmusic-green hover:bg-spotmusic-green/90 text-spotmusic-dark font-semibold"
              >
                <Music className="w-4 h-4 mr-2" />
                Acessar SpotMusic
              </Button>
            </>
          ) : (
            <>
              <Loader2 className="w-16 h-16 text-spotmusic-green mx-auto animate-spin" />
              <h2 className="text-2xl font-bold text-spotmusic-foreground">
                Processando...
              </h2>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
