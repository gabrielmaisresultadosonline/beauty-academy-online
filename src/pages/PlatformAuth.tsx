import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Zap, Eye, EyeOff, ArrowLeft, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

const PlatformAuth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        // Check if user is a platform client
        setTimeout(() => {
          checkClientStatus(session.user.id);
        }, 0);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        checkClientStatus(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkClientStatus = async (userId: string) => {
    const { data } = await supabase
      .from('platform_clients')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (data) {
      navigate('/cliente/dashboard');
    }
  };

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWhatsapp(formatWhatsApp(e.target.value));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName.trim() || !email.trim() || !password || !whatsapp.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/cliente/dashboard`,
          data: {
            full_name: fullName.trim()
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create platform client record
        const { error: clientError } = await supabase
          .from('platform_clients')
          .insert({
            user_id: authData.user.id,
            full_name: fullName.trim(),
            email: email.trim(),
            whatsapp: whatsapp.replace(/\D/g, '')
          });

        if (clientError) throw clientError;

        toast.success("Cadastro realizado com sucesso!");
        navigate('/cliente/dashboard');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.message?.includes('already registered')) {
        toast.error("Este email já está cadastrado. Faça login.");
        setIsLogin(true);
      } else {
        toast.error(error.message || "Erro ao cadastrar");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password) {
      toast.error("Preencha email e senha");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) throw error;

      toast.success("Login realizado com sucesso!");
      navigate('/cliente/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-950/40 via-black to-emerald-950/30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-semibold">Voltar</span>
        </Link>

        <Card className="bg-zinc-900/80 border border-white/10 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-black" />
              </div>
              <span className="text-2xl font-black text-white">acessar<span className="text-green-400">.click</span></span>
            </div>
            <CardTitle className="text-2xl font-black text-white">
              {isLogin ? "Entrar" : "Criar Conta"}
            </CardTitle>
            <p className="text-white/50 text-sm mt-2">
              {isLogin ? "Acesse sua área de cliente" : "Crie sua conta para começar"}
            </p>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={isLogin ? handleLogin : handleSignUp} className="space-y-4">
              {!isLogin && (
                <div>
                  <Label className="text-white font-semibold">Nome Completo</Label>
                  <Input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="bg-black/50 border-white/20 text-white placeholder:text-white/30 h-12 mt-1"
                    required
                  />
                </div>
              )}

              <div>
                <Label className="text-white font-semibold">Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="bg-black/50 border-white/20 text-white placeholder:text-white/30 h-12 mt-1"
                  required
                />
              </div>

              <div>
                <Label className="text-white font-semibold">Senha</Label>
                <div className="relative mt-1">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-black/50 border-white/20 text-white placeholder:text-white/30 h-12 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <Label className="text-white font-semibold">WhatsApp</Label>
                  <Input
                    type="tel"
                    value={whatsapp}
                    onChange={handleWhatsAppChange}
                    placeholder="(11) 99999-9999"
                    className="bg-black/50 border-white/20 text-white placeholder:text-white/30 h-12 mt-1"
                    required
                  />
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-400 text-black font-black h-12 text-base"
              >
                {loading ? "Aguarde..." : isLogin ? "Entrar" : "Criar Conta"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-green-400 hover:text-green-300 font-semibold transition-colors"
              >
                {isLogin ? "Não tem conta? Cadastre-se" : "Já tem conta? Faça login"}
              </button>
            </div>

            {!isLogin && (
              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-bold text-sm">InfinitePay Obrigatório</span>
                </div>
                <p className="text-white/50 text-xs">
                  Você precisará de uma conta InfinitePay para receber seus pagamentos instantaneamente.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlatformAuth;