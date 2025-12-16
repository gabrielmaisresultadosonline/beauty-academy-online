import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Scissors, Mail, Lock, User, ArrowLeft } from 'lucide-react';

export default function BelezaLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        navigate('/belezalisoperfeito/dashboard');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/belezalisoperfeito/dashboard`,
            data: { full_name: fullName }
          }
        });
        
        if (error) throw error;
        
        // Create enrollment record
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('course_enrollments').insert({
            user_id: user.id,
            is_premium: false
          });
        }
        
        toast({
          title: "Conta criada!",
          description: "Você já pode fazer login."
        });
        navigate('/belezalisoperfeito/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link 
          to="/belezalisoperfeito" 
          className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Scissors className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isLogin ? 'Entrar no Curso' : 'Criar Conta'}
            </h1>
            <p className="text-gray-600 mt-2">
              Beleza Liso Perfeito
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="fullName">Nome Completo</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="pl-10"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="email">E-mail</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
            >
              {isLoading ? 'Aguarde...' : isLogin ? 'Entrar' : 'Criar Conta'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-pink-600 hover:text-pink-700 font-medium"
            >
              {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
