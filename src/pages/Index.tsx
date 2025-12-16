import { 
  ArrowRight, 
  Zap, 
  CreditCard, 
  Users, 
  BarChart3, 
  Shield, 
  Clock,
  CheckCircle2,
  Sparkles,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: CreditCard,
    title: "Receba na Hora",
    description: "Integração direta com InfinitePay. Vendas processadas instantaneamente na sua conta."
  },
  {
    icon: Shield,
    title: "Taxa Fixa Anual",
    description: "Pague R$497/ano e venda sem limites. Sem taxas por transação, sem surpresas."
  },
  {
    icon: Users,
    title: "Área de Membros Completa",
    description: "Sistema de login, dashboard premium, controle de alunos e acesso exclusivo ao conteúdo."
  },
  {
    icon: BarChart3,
    title: "Facebook Pixel Integrado",
    description: "Configure seu pixel em cada área de membros. Rastreie PageView, compras e conversões."
  },
  {
    icon: Clock,
    title: "100% Automatizado",
    description: "Cadastro, pagamento e liberação de acesso totalmente automáticos. Zero trabalho manual."
  },
  {
    icon: Globe,
    title: "Sua Própria Nuvem",
    description: "Cada área de membros tem banco de dados separado. Seus dados são só seus."
  }
];

const benefits = [
  "Área de membros personalizada com sua marca",
  "Dashboard admin para gerenciar conteúdo",
  "Controle de usuários: pagos vs pendentes",
  "Pixel do Facebook por área de membros",
  "Integração InfinitePay sem taxas extras",
  "Suporte a vídeos, arquivos e módulos",
  "Sistema de autenticação completo",
  "Armazenamento em nuvem dedicado"
];

const PAYMENT_LINK = "https://checkout.infinitepay.io/paguemro?items=[{%22name%22:%22AREA%20DE%20MEMBROS%20ANUAL%22,%22price%22:49700,%22quantity%22:1}]&redirect_url=https://acessar.click/obrigado";

const Index = () => {
  return (
    <div className="min-h-screen bg-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-2 mb-8">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm text-background/90 font-medium">API InfinitePay • Receba na Hora</span>
            </div>

            {/* Logo */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-heading text-background tracking-tight mb-6">
              acessar<span className="text-primary">.</span>click
            </h1>

            <p className="text-xl md:text-2xl text-background/80 max-w-2xl mx-auto mb-4">
              Sua <span className="text-primary font-semibold">área de membros</span> completa
            </p>
            <p className="text-lg text-background/60 max-w-xl mx-auto mb-12">
              Venda cursos, comunidades e conteúdos exclusivos. 
              Integração com InfinitePay, sem taxas por venda!
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <a href={PAYMENT_LINK} target="_blank" rel="noopener noreferrer">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-xl hover:scale-105 transition-all duration-300 hover:shadow-[0_0_40px_hsl(var(--primary)/0.4)]"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Quero Minha Área de Membros
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </a>
            </div>

            {/* Price */}
            <div className="bg-background/10 backdrop-blur-sm border border-background/20 rounded-2xl p-6 max-w-md mx-auto">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl md:text-5xl font-bold text-background">R$497</span>
                <span className="text-background/60">/ano</span>
              </div>
              <p className="text-background/70 mt-2">em até 12x no cartão</p>
              <p className="text-primary font-medium mt-1">Taxa fixa • Venda quanto quiser!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">
              Tudo que você precisa para vender
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Uma plataforma completa para criar, gerenciar e monetizar suas áreas de membros
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-6">
                O que está incluso no seu plano
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-3xl p-8 text-center">
              <div className="bg-primary/10 rounded-2xl p-6 mb-6">
                <p className="text-sm text-muted-foreground mb-2">Plano Anual</p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-foreground">R$497</span>
                </div>
                <p className="text-muted-foreground mt-2">ou 12x de R$41,42</p>
              </div>
              
              <a href={PAYMENT_LINK} target="_blank" rel="noopener noreferrer" className="block">
                <Button 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold rounded-xl"
                >
                  Ativar Minha Área de Membros
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </a>
              
              <p className="text-sm text-muted-foreground mt-4">
                Pagamento seguro via InfinitePay
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Existing Products */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">
            Exemplos em produção
          </h2>
          <p className="text-muted-foreground mb-12">
            Veja áreas de membros funcionando agora mesmo
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/belezalisoperfeito"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-6 py-4 rounded-xl font-semibold text-base transition-all duration-300 hover:scale-105"
            >
              <span>Curso Cabeleireira</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/comunidademusica"
              className="group inline-flex items-center gap-3 bg-[#1DB954] hover:bg-[#1DB954]/90 text-white px-6 py-4 rounded-xl font-semibold text-base transition-all duration-300 hover:scale-105"
            >
              <span>SpotMusic</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-foreground border-t border-background/10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-background/40 text-sm">
            © 2024 acessar.click — Todos os direitos reservados
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
