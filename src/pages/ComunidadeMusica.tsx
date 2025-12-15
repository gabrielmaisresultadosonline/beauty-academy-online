import { Button } from '@/components/ui/button';
import CountdownTimer from '@/components/CountdownTimer';
import {
  Music,
  Download,
  RefreshCw,
  Infinity,
  Headphones,
  Zap,
  Check,
  X,
  ArrowRight,
  Shield,
  CheckCircle2,
  Smartphone,
  Usb,
  Star,
  TrendingUp,
  Users,
  Clock,
} from 'lucide-react';

const KIWIFY_LINK = 'https://pay.kiwify.com.br/AFMNBej';

const scrollToPrice = () => {
  const priceSection = document.getElementById('preco');
  if (priceSection) {
    priceSection.scrollIntoView({ behavior: 'smooth' });
  }
};

const features = [
  { icon: Music, title: '+15.000 Músicas', description: 'Biblioteca gigante com todos os gêneros musicais' },
  { icon: RefreshCw, title: 'Atualização Semanal', description: 'Novas músicas adicionadas toda semana' },
  { icon: Download, title: 'Download Ilimitado', description: 'Baixe todas as músicas que quiser' },
  { icon: Infinity, title: 'Acesso Vitalício', description: 'Pague uma vez, use para sempre' },
  { icon: Smartphone, title: 'Use em Qualquer Lugar', description: 'Celular, carro, computador, onde quiser' },
  { icon: Usb, title: 'Pendrive Digital', description: 'Acesso direto às suas músicas favoritas' },
];

const testimonials = [
  {
    name: 'Ricardo Santos',
    role: 'DJ Profissional',
    content: 'Melhor investimento! Tenho todas as músicas que preciso para minhas festas. Atualização semanal é sensacional!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Carla Mendes',
    role: 'Motorista de App',
    content: 'Cancelei meu Spotify! Paguei uma vez e agora tenho música infinita no carro. Economia demais!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Fernando Lima',
    role: 'Dono de Loja',
    content: 'Uso no meu estabelecimento todos os dias. Qualidade top e sempre tem música nova. Vale muito a pena!',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  },
];

const ComunidadeMusica = () => {
  return (
    <div className="min-h-screen bg-foreground font-body">
      {/* Header Badge */}
      <div className="bg-secondary py-2 text-center">
        <p className="text-secondary-foreground text-sm font-medium flex items-center justify-center gap-2">
          <Zap className="w-4 h-4" />
          ACESSO VITALÍCIO - PAGUE UMA VEZ SÓ!
        </p>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="animate-fade-in">
              <span className="inline-flex items-center gap-2 bg-primary/20 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium border border-primary/30">
                <Music className="w-4 h-4" />
                SEU PENDRIVE DIGITAL
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading text-background leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Comunidade da{' '}
              <span className="text-primary">Música</span>
            </h1>

            <p className="text-xl md:text-2xl text-background/80 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Mais de <span className="text-secondary font-bold">15.000 músicas</span> atualizadas toda semana por apenas{' '}
              <span className="text-primary font-bold">R$47</span> - pagamento único e vitalício!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Button variant="cta" size="xl" onClick={scrollToPrice}>
                QUERO PARTICIPAR
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 pt-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-2 text-background/70">
                <Music className="w-5 h-5 text-primary" />
                <span>+15.000 músicas</span>
              </div>
              <div className="flex items-center gap-2 text-background/70">
                <RefreshCw className="w-5 h-5 text-secondary" />
                <span>Atualização semanal</span>
              </div>
              <div className="flex items-center gap-2 text-background/70">
                <Infinity className="w-5 h-5 text-primary" />
                <span>Acesso vitalício</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">
              Por que é melhor que Spotify?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Compare e veja a economia que você vai ter
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Spotify */}
            <div className="bg-muted/50 rounded-2xl p-8 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#1DB954] rounded-xl flex items-center justify-center">
                  <Headphones className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">Spotify Premium</h3>
                  <p className="text-muted-foreground text-sm">Assinatura mensal</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <X className="w-5 h-5 text-destructive" />
                  <span className="text-muted-foreground">R$21,90/mês</span>
                </div>
                <div className="flex items-center gap-3">
                  <X className="w-5 h-5 text-destructive" />
                  <span className="text-muted-foreground">R$262,80/ano</span>
                </div>
                <div className="flex items-center gap-3">
                  <X className="w-5 h-5 text-destructive" />
                  <span className="text-muted-foreground">Precisa de internet</span>
                </div>
                <div className="flex items-center gap-3">
                  <X className="w-5 h-5 text-destructive" />
                  <span className="text-muted-foreground">Pagamento eterno</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">Em 2 anos você gasta:</p>
                <p className="text-2xl font-bold text-destructive">R$ 525,60</p>
              </div>
            </div>

            {/* Nossa Comunidade */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 border-2 border-primary relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full">
                  MELHOR OPÇÃO
                </span>
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
                  <Music className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">Comunidade da Música</h3>
                  <p className="text-muted-foreground text-sm">Pagamento único</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-success" />
                  <span className="text-foreground font-medium">R$47 uma única vez</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-success" />
                  <span className="text-foreground">Acesso vitalício</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-success" />
                  <span className="text-foreground">Funciona offline</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-success" />
                  <span className="text-foreground">Atualizações semanais grátis</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-primary/30">
                <p className="text-sm text-muted-foreground">Investimento total:</p>
                <p className="text-2xl font-bold text-primary">R$ 47,00</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <p className="text-lg text-muted-foreground">
              Economia de até <span className="text-primary font-bold text-2xl">R$ 478,60</span> comparado ao Spotify em 2 anos!
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">
              O Que Você Recebe
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-card p-6 rounded-2xl shadow-card hover:shadow-glow transition-all duration-300 border border-border/50 hover:border-primary/30"
              >
                <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 font-heading">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="py-16 md:py-24 gradient-primary text-primary-foreground">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Clock className="w-6 h-6" />
                <span className="text-lg font-semibold">OFERTA LIMITADA</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-heading">
                Vagas Limitadas
              </h2>
              <p className="text-primary-foreground/80 text-lg">
                Apenas <span className="font-bold text-secondary">100 vagas</span> disponíveis neste preço especial
              </p>
              <div className="bg-primary-foreground/10 rounded-2xl p-6 backdrop-blur">
                <p className="text-center mb-4 font-medium">Vagas restantes:</p>
                <div className="flex justify-center gap-2 mb-4">
                  {['2', '3'].map((num, i) => (
                    <span key={i} className="text-5xl font-bold font-heading bg-primary-foreground text-primary w-16 h-20 flex items-center justify-center rounded-lg">
                      {num}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6" />
                <span className="text-lg font-semibold">Tempo Limitado</span>
              </div>
              <p className="text-primary-foreground/80">
                Oferta válida por apenas 48 horas
              </p>
              <div className="bg-primary-foreground/10 rounded-2xl p-6 backdrop-blur">
                <CountdownTimer />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 md:py-24" id="preco">
        <div className="container">
          <div className="max-w-xl mx-auto text-center">
            <span className="inline-block bg-secondary/20 text-secondary px-4 py-2 rounded-full text-sm font-bold mb-6 animate-pulse-slow">
              OFERTA ESPECIAL
            </span>
            <div className="bg-card rounded-3xl p-8 md:p-12 shadow-card border border-border/50">
              <h3 className="text-2xl font-heading font-bold text-foreground mb-2">ACESSO VITALÍCIO</h3>
              <p className="text-muted-foreground text-lg mb-2">Mais barato que 2 meses de Spotify!</p>
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-2xl font-bold text-foreground">R$</span>
                <span className="text-7xl font-bold font-heading text-primary">47</span>
                <span className="text-2xl font-bold text-foreground">,00</span>
              </div>
              <p className="text-muted-foreground mb-8">
                Pagamento único. Acesso vitalício + atualizações semanais grátis.
              </p>
              <Button variant="cta" size="xl" className="w-full" asChild>
                <a href={KIWIFY_LINK} target="_blank" rel="noopener noreferrer">
                  QUERO PARTICIPAR AGORA
                  <ArrowRight className="w-5 h-5" />
                </a>
              </Button>
              <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-success" />
                  Compra segura
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  Acesso imediato
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">
              O Que Dizem os Membros
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-card p-6 rounded-2xl shadow-card border border-border/50 hover:border-primary/20 transition-all duration-300">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="gradient-primary rounded-3xl p-8 md:p-16 text-center text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Pare de Pagar Mensalidade!
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto text-lg">
              Entre agora para a Comunidade da Música e tenha acesso a mais de 15.000 músicas para sempre. Pagamento único de R$47!
            </p>
            <Button variant="secondary" size="xl" className="text-foreground" asChild>
              <a href={KIWIFY_LINK} target="_blank" rel="noopener noreferrer">
                GARANTIR MEU ACESSO
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-border bg-foreground">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-heading font-bold text-lg text-background">Comunidade da Música</h3>
              <p className="text-sm text-background/60">
                Seu pendrive digital com +15.000 músicas
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-background/60">
                Email: contato@acessar.click
              </p>
              <p className="text-sm text-background/60">
                Suporte 24/7 disponível
              </p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-background/20 text-center">
            <p className="text-xs text-background/40">
              © 2024 Comunidade da Música. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ComunidadeMusica;
