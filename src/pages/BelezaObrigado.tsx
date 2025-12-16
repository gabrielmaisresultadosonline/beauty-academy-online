import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

export default function BelezaObrigado() {
  const [isActivating, setIsActivating] = useState(true);
  const [activated, setActivated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    activatePremium();
  }, []);

  const activatePremium = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate('/belezalisoperfeito/login');
      return;
    }

    // Check if enrollment exists
    const { data: existingEnrollment } = await supabase
      .from('course_enrollments')
      .select('*')
      .eq('user_id', user.id)
      .single();

    let success = false;

    if (existingEnrollment) {
      // Update existing enrollment to premium
      const { error } = await supabase
        .from('course_enrollments')
        .update({
          is_premium: true,
          premium_activated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
      
      success = !error;
    } else {
      // Create new enrollment as premium
      const { error } = await supabase
        .from('course_enrollments')
        .insert({
          user_id: user.id,
          is_premium: true,
          premium_activated_at: new Date().toISOString()
        });
      
      success = !error;
    }

    if (success) {
      // Record payment
      await supabase.from('course_payments').insert({
        user_id: user.id,
        amount: 25,
        status: 'completed',
        payment_provider: 'infinitepay'
      });

      setActivated(true);
      
      // Confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#f43f5e', '#fbbf24', '#22c55e']
      });
    }

    setIsActivating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
        {isActivating ? (
          <>
            <div className="w-20 h-20 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900">Ativando seu acesso...</h1>
            <p className="text-gray-600 mt-2">Aguarde um momento</p>
          </>
        ) : activated ? (
          <>
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            
            <div className="flex items-center justify-center gap-2 text-pink-500 mb-4">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Parabéns!</span>
              <Sparkles className="w-5 h-5" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Pagamento Confirmado!
            </h1>
            
            <p className="text-gray-600 mb-8">
              Seu acesso premium ao curso <strong>Beleza Liso Perfeito</strong> foi ativado com sucesso. 
              Você agora tem acesso vitalício a todo o conteúdo!
            </p>

            <div className="bg-pink-50 rounded-xl p-6 mb-8">
              <h2 className="font-bold text-gray-900 mb-3">O que você desbloqueou:</h2>
              <ul className="text-left text-gray-700 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  160+ aulas em vídeo Full HD
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  Módulos de Colorimetria, Corte, Penteados e mais
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  Certificado de conclusão
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  Acesso vitalício
                </li>
              </ul>
            </div>

            <Button
              onClick={() => navigate('/belezalisoperfeito/dashboard')}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-lg py-6"
            >
              Acessar o Curso
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Ops! Algo deu errado
            </h1>
            <p className="text-gray-600 mb-6">
              Não foi possível ativar seu acesso. Por favor, entre em contato com o suporte.
            </p>
            <Button onClick={() => navigate('/belezalisoperfeito/dashboard')} variant="outline">
              Voltar ao Dashboard
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
