import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Music, Headphones, Loader2 } from 'lucide-react';
import { z } from 'zod';

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  email: z.string().email('Email inválido').max(255),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').max(100)
});

const signInSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória')
});

export default function SpotMusicLogin() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { user, signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/comunidademusica/dashboard');
    }
  }, [user, navigate]);

  const validateForm = () => {
    try {
      if (isSignUp) {
        signUpSchema.parse({ fullName, email, password });
      } else {
        signInSchema.parse({ email, password });
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              title: 'Email já cadastrado',
              description: 'Este email já possui uma conta. Tente fazer login.',
              variant: 'destructive'
            });
          } else {
            toast({
              title: 'Erro ao cadastrar',
              description: error.message,
              variant: 'destructive'
            });
          }
        } else {
          toast({
            title: 'Conta criada com sucesso!',
            description: 'Bem-vindo ao SpotMusic!'
          });
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: 'Erro ao entrar',
            description: 'Email ou senha incorretos.',
            variant: 'destructive'
          });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-spotmusic-dark flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-spotmusic-green/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-spotmusic-amber/5 rounded-full blur-3xl" />
      </div>
      
      <Card className="w-full max-w-md bg-spotmusic-card border-spotmusic-border relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="relative">
              <Headphones className="w-10 h-10 text-spotmusic-green" />
              <Music className="w-4 h-4 text-spotmusic-amber absolute -top-1 -right-1" />
            </div>
            <span className="text-2xl font-bold text-spotmusic-foreground">
              Spot<span className="text-spotmusic-green">Music</span>
            </span>
          </div>
          <CardTitle className="text-xl text-spotmusic-foreground">
            {isSignUp ? 'Criar Conta' : 'Entrar'}
          </CardTitle>
          <CardDescription className="text-spotmusic-muted">
            {isSignUp 
              ? 'Cadastre-se para acessar toda a música' 
              : 'Entre na sua conta SpotMusic'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-spotmusic-foreground">Nome Completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="bg-spotmusic-dark border-spotmusic-border text-spotmusic-foreground placeholder:text-spotmusic-muted"
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName}</p>
                )}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-spotmusic-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="bg-spotmusic-dark border-spotmusic-border text-spotmusic-foreground placeholder:text-spotmusic-muted"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-spotmusic-foreground">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-spotmusic-dark border-spotmusic-border text-spotmusic-foreground placeholder:text-spotmusic-muted"
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-spotmusic-green hover:bg-spotmusic-green/90 text-spotmusic-dark font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isSignUp ? 'Criando conta...' : 'Entrando...'}
                </>
              ) : (
                isSignUp ? 'Criar Conta' : 'Entrar'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrors({});
              }}
              className="text-spotmusic-green hover:underline text-sm"
            >
              {isSignUp 
                ? 'Já tem conta? Entre aqui' 
                : 'Não tem conta? Cadastre-se'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
