import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FacebookPixel } from '@/components/FacebookPixel';
import { Button } from '@/components/ui/button';
import CountdownTimer from '@/components/CountdownTimer';
import WhatsAppProof from '@/components/WhatsAppProof';
import FeatureCard from '@/components/FeatureCard';
import TestimonialCard from '@/components/TestimonialCard';
import BenefitItem from '@/components/BenefitItem';
import instrutoras from '@/assets/instrutoras.png';
import {
  BookOpen,
  FileText,
  Users,
  ShoppingBag,
  Award,
  Infinity,
  Scissors,
  Heart,
  TrendingUp,
  Palette,
  Sparkles,
  Headphones,
  Clock,
  Shield,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';

const REGISTER_LINK = '/belezalisoperfeito/login?mode=signup';

const scrollToPrice = () => {
  const priceSection = document.getElementById('preco');
  if (priceSection) {
    priceSection.scrollIntoView({ behavior: 'smooth' });
  }
};

const whatsappProofs = [
  {
    name: 'Fernanda Lima',
    message: 'Gente, acabei de fazer minha primeira cliente sozinha! O módulo de colorimetria me salvou muito 😍 Obrigada Alessandra!',
    time: '10:32',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Patricia Santos',
    message: 'Meninas, já recuperei o valor do curso no primeiro mês! Melhor investimento que fiz 💰✨',
    time: '14:15',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Camila Rodrigues',
    message: 'Os PDFs são incríveis! Imprimi tudo e virou meu guia no salão. Super organizados 📚',
    time: '09:48',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Juliana Mendes',
    message: 'Nunca pensei que aprenderia corte degradê tão rápido! As aulas são muito didáticas 💇‍♀️',
    time: '16:22',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Amanda Costa',
    message: 'Grupo de alunas é show! Sempre tem alguém pra ajudar, me sinto acolhida 🥰',
    time: '11:05',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Beatriz Almeida',
    message: 'Fiz o curso achando que já sabia tudo, mas aprendi técnicas que nem imaginava! Vale cada centavo 💯',
    time: '15:42',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Larissa Ferreira',
    message: 'Minha clientela triplicou depois que apliquei as técnicas do curso! Estou muito feliz 🙏✨',
    time: '08:17',
    avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Gabriela Souza',
    message: 'O suporte é incrível! Mandei uma dúvida às 22h e responderam na hora. Nunca vi isso! 👏',
    time: '22:35',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Renata Martins',
    message: 'Saí do zero e hoje tenho meu próprio salão! Tudo graças a esse curso maravilhoso 💖💇‍♀️',
    time: '13:28',
    avatar: 'https://images.unsplash.com/photo-1499557354967-2b2d8910bcca?w=100&h=100&fit=crop&crop=face',
  },
];

const features = [
  { icon: BookOpen, title: '160 Aulas em Full HD', description: 'Conteúdo completo e detalhado em alta qualidade para você aprender no seu ritmo' },
  { icon: FileText, title: 'Materiais em PDF', description: 'Apostilas e guias práticos para complementar seu aprendizado' },
  { icon: Users, title: 'Grupo de Alunas Apoio', description: 'Comunidade ativa para tirar dúvidas e trocar experiências' },
  { icon: ShoppingBag, title: 'Lista de Fornecedores', description: 'Acesso a fornecedores confiáveis para insumos profissionais' },
  { icon: Award, title: 'Certificado Incluso', description: 'Certificado reconhecido ao final do curso para sua carreira' },
  { icon: Infinity, title: 'Acesso Vitalício', description: 'Assista quantas vezes quiser, quando quiser, para sempre' },
];

const benefits = [
  { title: 'Técnicas Profissionais', description: 'Aprenda as técnicas mais modernas e procuradas do mercado' },
  { title: 'Atendimento ao Cliente', description: 'Dicas para fidelizar clientes e aumentar sua renda' },
  { title: 'Gestão de Negócio', description: 'Como gerenciar seu próprio salão ou trabalhar como autônoma' },
  { title: 'Colorimetria Completa', description: 'Domine a arte de escolher as melhores cores para cada cliente' },
  { title: 'Penteados Modernos', description: 'Tendências atuais em penteados para qualquer ocasião' },
  { title: 'Suporte Contínuo', description: 'Acesso a mentoria e suporte durante todo seu aprendizado' },
];

const testimonials = [
  {
    name: 'Maria Silva',
    role: 'Cabeleireira Autônoma',
    content: 'Curso excelente! Aprendi tudo que precisava para abrir meu próprio salão. As aulas são muito bem estruturadas e o suporte é ótimo!',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Ana Costa',
    role: 'Cabeleireira Profissional',
    content: 'Já tinha experiência, mas o curso me atualizou com as tendências mais novas. Meus clientes adoraram as novas técnicas!',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Juliana Oliveira',
    role: 'Iniciante no Ramo',
    content: 'Melhor investimento que fiz! O preço é ótimo e o conteúdo é de qualidade profissional. Recomendo para todas!',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop&crop=face',
  },
];

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Curso de Cabeleireira Completo | Comunidade da Cabeleireira - Acesso Vitalício</title>
        <meta name="description" content="Curso completo de cabeleireira com acesso vitalício. Aprenda técnicas profissionais de alisamento, colorimetria, corte e muito mais. Comunidade da Cabeleireira." />
        <meta property="og:title" content="Curso de Cabeleireira Completo | Comunidade da Cabeleireira" />
        <meta property="og:description" content="Acesso vitalício ao curso completo de cabeleireira. Aprenda técnicas profissionais e transforme sua carreira!" />
        <meta property="og:url" content="https://acessar.click/belezalisoperfeito" />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content="Curso de Cabeleireira Completo | Comunidade da Cabeleireira" />
        <meta name="twitter:description" content="Acesso vitalício ao curso completo de cabeleireira. Transforme sua carreira!" />
        <link rel="canonical" href="https://acessar.click/belezalisoperfeito" />
      </Helmet>
      <div className="min-h-screen bg-background font-body">
        <FacebookPixel productSlug="belezalisoperfeito" />
      {/* Header Badge */}
      <div className="gradient-primary py-2">
        <div className="container flex items-center justify-between">
          <p className="text-primary-foreground text-sm font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            RECONHECIDO PELO MEC
          </p>
          <Link 
            to="/belezalisoperfeito/login" 
            className="text-primary-foreground/90 hover:text-primary-foreground text-sm font-medium underline"
          >
            Área do Aluno
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="gradient-hero py-12 md:py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6 animate-fade-in">
              <span className="inline-block bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-medium">
                COMUNIDADE DA CABELEIREIRA • ACESSO VITALÍCIO
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-foreground leading-tight">
                Curso de Cabeleireira{' '}
                <span className="text-gradient">Completo</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                Curso completo com conhecimentos atualizados mensalmente. Aprenda com especialistas e faça parte da maior comunidade de cabeleireiras do Brasil!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="cta" size="xl" asChild>
                  <Link to={REGISTER_LINK}>
                    QUERO ME INSCREVER
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
                    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
                    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
                  ].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="Aluna"
                      className="w-10 h-10 rounded-full border-2 border-background object-cover"
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">+2.500</span> alunas transformadas
                </p>
              </div>
            </div>
            <div className="relative animate-scale-in">
              <div className="absolute -inset-4 gradient-primary opacity-20 blur-3xl rounded-full"></div>
              <img
                src={instrutoras}
                alt="Alessandra Linhares - Instrutoras do Curso"
                className="relative w-full max-w-lg mx-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Highlighted Purpose Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600">
        <div className="container">
          <div className="text-center text-white">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-heading mb-6">
              Escolha o Seu Caminho
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Option 1 - Save Money */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20 hover:bg-white/20 transition-all">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3">Faça em Você Mesma</h3>
                <p className="text-white/90 text-lg">
                  Aprenda para fazer em você mesma e <span className="font-bold text-yellow-300">economize milhares de reais</span> em salão todo ano!
                </p>
              </div>
              {/* Option 2 - Make Money */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20 hover:bg-white/20 transition-all">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3">Trabalhe e Fature</h3>
                <p className="text-white/90 text-lg">
                  Aprenda para trabalhar e <span className="font-bold text-yellow-300">faturar fazendo em outros cabelos</span> como profissional!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">
              O QUE VOCÊ VAI APRENDER
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Conteúdo completo e atualizado para você dominar todas as técnicas
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} style={{ animationDelay: `${index * 100}ms` }} className="animate-slide-up">
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">
              TUDO INCLUSO NO CURSO
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <BenefitItem key={index} {...benefit} />
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp Social Proof */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full mb-4">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">Mensagens Reais das Alunas</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">
              Veja o que estão falando no grupo
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {whatsappProofs.map((proof, index) => (
              <div key={index} style={{ animationDelay: `${index * 150}ms` }}>
                <WhatsAppProof {...proof} />
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
                Apenas <span className="font-bold text-secondary">50 vagas</span> disponíveis neste preço especial
              </p>
              <div className="bg-primary-foreground/10 rounded-2xl p-6 backdrop-blur">
                <p className="text-center mb-4 font-medium">Vagas restantes:</p>
                <div className="flex justify-center gap-2 mb-4">
                  {[1, 2].map((i) => (
                    <span key={i} className="text-5xl font-bold font-heading bg-primary-foreground text-primary w-16 h-20 flex items-center justify-center rounded-lg">
                      {i === 1 ? '1' : '2'}
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
            <span className="inline-block bg-destructive/10 text-destructive px-4 py-2 rounded-full text-sm font-bold mb-6 animate-pulse-slow">
              DESCONTO DE 87%
            </span>
            <div className="bg-card rounded-3xl p-8 md:p-12 shadow-card border border-border/50">
              <h3 className="text-2xl font-heading font-bold text-foreground mb-2">INVESTIMENTO</h3>
              <p className="text-muted-foreground line-through text-lg mb-2">De R$ 197,00</p>
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-2xl font-bold text-foreground">R$</span>
                <span className="text-7xl font-bold font-heading text-primary">25</span>
                <span className="text-2xl font-bold text-foreground">,00</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Pagamento único • Acesso vitalício • Certificado incluso • Conteúdo atualizado mensalmente
              </p>
              <div className="flex items-center justify-center gap-2 mb-6 text-success">
                <Award className="w-5 h-5" />
                <span className="font-medium">Comunidade + Certificado Inclusos</span>
              </div>
              <Button variant="cta" size="xl" className="w-full" asChild>
                <Link to={REGISTER_LINK}>
                  GARANTIR MINHA VAGA POR R$25
                  <ArrowRight className="w-5 h-5" />
                </Link>
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
                <span className="flex items-center gap-1">
                  <Infinity className="w-4 h-4 text-success" />
                  Vitalício
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
              O QUE DIZEM NOSSAS ALUNAS
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="gradient-primary rounded-3xl p-8 md:p-16 text-center text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Comece Sua Transformação Agora
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto text-lg">
              Não perca mais tempo. Milhares de mulheres já transformaram suas vidas com o nosso curso. Agora é a sua vez!
            </p>
            <Button variant="secondary" size="xl" className="text-foreground" asChild>
              <Link to={REGISTER_LINK}>
                GARANTIR MINHA VAGA
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-border">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-heading font-bold text-lg text-foreground">Beleza Liso Perfeito</h3>
              <p className="text-sm text-muted-foreground">
                Aprenda cabeleiraria profissional com os melhores especialistas
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground">
                Email: contato@belezalisoperfeito.online
              </p>
              <p className="text-sm text-muted-foreground">
                Suporte 24/7 disponível
              </p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              © 2024 Curso Cabeleireira Completo. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
};

export default Index;
