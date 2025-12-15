import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import {
  Music,
  Music2,
  Music4,
  Download,
  RefreshCw,
  Infinity,
  Headphones,
  Disc3,
  Radio,
  Volume2,
  PlayCircle,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Check,
  X,
  ArrowRight,
  Shield,
  CheckCircle2,
  Smartphone,
  Star,
  Users,
  Clock,
  Zap,
  Mic2,
  ListMusic,
  Heart,
  Sparkles,
} from 'lucide-react';

const KIWIFY_LINK = 'https://pay.kiwify.com.br/AFMNBej';

const scrollToPrice = () => {
  const priceSection = document.getElementById('preco');
  if (priceSection) {
    priceSection.scrollIntoView({ behavior: 'smooth' });
  }
};

// Countdown Timer Component
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const totalSeconds = prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1;
        if (totalSeconds <= 0) return { hours: 23, minutes: 59, seconds: 59 };
        return {
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60,
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-3">
      {[
        { value: timeLeft.hours, label: 'HRS' },
        { value: timeLeft.minutes, label: 'MIN' },
        { value: timeLeft.seconds, label: 'SEG' },
      ].map((item, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 min-w-[60px]">
            <span className="text-2xl md:text-3xl font-mono font-bold text-amber-400">
              {formatNumber(item.value)}
            </span>
          </div>
          <span className="text-[10px] text-zinc-500 mt-1 font-medium tracking-wider">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

// Animated Music Bars
const MusicBars = () => (
  <div className="flex items-end gap-1 h-8">
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className="w-1 bg-gradient-to-t from-amber-500 to-amber-300 rounded-full animate-pulse"
        style={{
          height: `${Math.random() * 60 + 40}%`,
          animationDelay: `${i * 0.1}s`,
          animationDuration: `${0.5 + Math.random() * 0.5}s`,
        }}
      />
    ))}
  </div>
);

const genres = [
  'Sertanejo', 'Funk', 'Pop', 'Rock', 'MPB', 'Eletrônica', 
  'Hip Hop', 'Reggaeton', 'Pagode', 'Forró', 'Gospel', 'Jazz'
];

const features = [
  { icon: Music2, title: '+15.000 Músicas', description: 'Biblioteca completa com todos os hits' },
  { icon: RefreshCw, title: 'Atualização Semanal', description: 'Novidades toda semana no seu acervo' },
  { icon: Download, title: 'Download Ilimitado', description: 'Baixe e ouça offline onde quiser' },
  { icon: Infinity, title: 'Acesso Vitalício', description: 'Pague uma vez, use para sempre' },
  { icon: Smartphone, title: 'Multiplataforma', description: 'Celular, PC, carro, TV, qualquer lugar' },
  { icon: ListMusic, title: 'Organizado', description: 'Músicas separadas por gênero e artista' },
];

const testimonials = [
  {
    name: 'Ricardo Santos',
    role: 'DJ Profissional',
    content: 'Uso nas minhas festas todos os fins de semana. A qualidade do áudio é impecável e sempre tem lançamento novo!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Carla Mendes',
    role: 'Motorista de App',
    content: 'Cancelei todas as assinaturas! Paguei R$47 uma vez e agora tenho música infinita no carro. Melhor decisão!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Fernando Lima',
    role: 'Dono de Restaurante',
    content: 'Ambiente musical perfeito pro meu restaurante. Os clientes elogiam demais! Vale cada centavo.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  },
];

const ComunidadeMusica = () => {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="min-h-screen bg-zinc-950 font-body overflow-hidden">
      {/* Floating Music Notes Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-zinc-800/30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 40 + 20}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            ♪
          </div>
        ))}
      </div>

      {/* Top Bar */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 py-2 relative z-10">
        <p className="text-zinc-900 text-sm font-bold text-center flex items-center justify-center gap-2">
          <Zap className="w-4 h-4" />
          PAGUE UMA VEZ, OUÇA PARA SEMPRE
          <Zap className="w-4 h-4" />
        </p>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 z-10">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Disc3 className="w-8 h-8 text-zinc-900" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tight">
                    Spot<span className="text-amber-400">Music</span>
                  </h2>
                  <p className="text-zinc-500 text-sm">Seu pendrive digital</p>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                Mais de{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                  15.000 músicas
                </span>
                <br />
                por apenas <span className="text-amber-400">R$47</span>
              </h1>

              <p className="text-lg text-zinc-400 max-w-lg">
                Atualizações semanais, download ilimitado e acesso vitalício. 
                Mais barato que 2 meses de qualquer streaming!
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={scrollToPrice}
                  className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-900 font-bold text-lg h-14 px-8 rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all hover:scale-105"
                >
                  <Headphones className="w-5 h-5 mr-2" />
                  QUERO MEU ACESSO
                </Button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <p className="text-3xl font-black text-amber-400">15K+</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">Músicas</p>
                </div>
                <div className="w-px h-10 bg-zinc-800" />
                <div className="text-center">
                  <p className="text-3xl font-black text-blue-400">2K+</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">Membros</p>
                </div>
                <div className="w-px h-10 bg-zinc-800" />
                <div className="text-center">
                  <p className="text-3xl font-black text-green-400">100%</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">Satisfação</p>
                </div>
              </div>
            </div>

            {/* Right - Player Visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-blue-500/20 rounded-3xl blur-2xl" />
              <div className="relative bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
                {/* Album Art */}
                <div className="aspect-square bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl mb-6 relative overflow-hidden group">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Disc3 className="w-32 h-32 text-zinc-700 animate-spin" style={{ animationDuration: '8s' }} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white font-bold text-lg">Hits do Momento</p>
                    <p className="text-zinc-500 text-sm">+15.000 músicas disponíveis</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" />
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-zinc-600">
                    <span>1:23</span>
                    <span>3:45</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <button className="text-zinc-500 hover:text-white transition-colors">
                    <Shuffle className="w-5 h-5" />
                  </button>
                  <button className="text-zinc-500 hover:text-white transition-colors">
                    <SkipBack className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-14 h-14 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full flex items-center justify-center text-zinc-900 hover:scale-105 transition-transform shadow-lg shadow-amber-500/30"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <PlayCircle className="w-6 h-6" />}
                  </button>
                  <button className="text-zinc-500 hover:text-white transition-colors">
                    <SkipForward className="w-6 h-6" />
                  </button>
                  <button className="text-zinc-500 hover:text-white transition-colors">
                    <Repeat className="w-5 h-5" />
                  </button>
                </div>

                {/* Volume */}
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Volume2 className="w-4 h-4 text-zinc-600" />
                  <div className="w-24 h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-zinc-600 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Genres Section */}
      <section className="py-12 relative z-10 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...genres, ...genres].map((genre, i) => (
            <span
              key={i}
              className="mx-4 px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 text-sm font-medium hover:border-amber-500/50 hover:text-amber-400 transition-colors cursor-default"
            >
              {genre}
            </span>
          ))}
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 md:py-24 relative z-10">
        <div className="container">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 px-4 py-2 rounded-full text-sm font-medium border border-amber-500/20 mb-4">
              <Sparkles className="w-4 h-4" />
              COMPARATIVO
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Por que SpotMusic é a <span className="text-amber-400">melhor escolha</span>?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Spotify */}
            <div className="bg-zinc-900/50 backdrop-blur rounded-2xl p-6 border border-zinc-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#1DB954] rounded-lg flex items-center justify-center">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Spotify</h3>
                  <p className="text-zinc-500 text-xs">Premium</p>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                {['R$ 21,90/mês', 'Precisa de internet', 'Cancela = perde tudo', 'R$ 262/ano'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-zinc-500 text-sm">
                    <X className="w-4 h-4 text-red-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-zinc-800">
                <p className="text-xs text-zinc-600">Em 2 anos:</p>
                <p className="text-xl font-bold text-red-400">R$ 525,60</p>
              </div>
            </div>

            {/* Deezer */}
            <div className="bg-zinc-900/50 backdrop-blur rounded-2xl p-6 border border-zinc-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Headphones className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Deezer</h3>
                  <p className="text-zinc-500 text-xs">Premium</p>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                {['R$ 24,90/mês', 'Precisa de internet', 'Cancela = perde tudo', 'R$ 298/ano'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-zinc-500 text-sm">
                    <X className="w-4 h-4 text-red-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-zinc-800">
                <p className="text-xs text-zinc-600">Em 2 anos:</p>
                <p className="text-xl font-bold text-red-400">R$ 597,60</p>
              </div>
            </div>

            {/* SpotMusic */}
            <div className="bg-gradient-to-b from-amber-500/10 to-zinc-900/50 backdrop-blur rounded-2xl p-6 border-2 border-amber-500/50 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-amber-500 text-zinc-900 text-xs font-bold px-3 py-1 rounded-full">
                  RECOMENDADO
                </span>
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                  <Disc3 className="w-5 h-5 text-zinc-900" />
                </div>
                <div>
                  <h3 className="font-bold text-white">SpotMusic</h3>
                  <p className="text-amber-400 text-xs">Vitalício</p>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                {['R$ 47 única vez', 'Funciona offline', 'Seu para sempre', 'Updates grátis'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-white text-sm">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-amber-500/30">
                <p className="text-xs text-zinc-400">Investimento total:</p>
                <p className="text-xl font-bold text-amber-400">R$ 47,00</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <p className="text-zinc-500">
              Economia de até{' '}
              <span className="text-2xl font-black text-green-400">R$ 550+</span>
              {' '}comparado aos streamings em 2 anos!
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-24 bg-zinc-900/30 relative z-10">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Tudo que você <span className="text-amber-400">precisa</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-zinc-900/50 backdrop-blur p-6 rounded-2xl border border-zinc-800 hover:border-amber-500/30 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-zinc-500 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Urgency */}
      <section className="py-16 relative z-10">
        <div className="container">
          <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 rounded-3xl p-8 md:p-12 border border-zinc-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-amber-400 mb-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-bold uppercase tracking-wider text-sm">Oferta por tempo limitado</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
                  Essa promoção acaba em:
                </h3>
                <p className="text-zinc-400">Depois o preço volta para R$ 97</p>
              </div>
              <CountdownTimer />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 md:py-24 relative z-10" id="preco">
        <div className="container">
          <div className="max-w-lg mx-auto">
            <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-3xl p-8 md:p-10 border border-zinc-800 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500" />
              
              <div className="text-center mb-8">
                <span className="inline-block bg-amber-500/10 text-amber-400 px-4 py-1 rounded-full text-sm font-bold mb-4">
                  ACESSO VITALÍCIO
                </span>
                <h3 className="text-2xl font-black text-white mb-2">SpotMusic Premium</h3>
                <p className="text-zinc-500">Tudo incluso. Para sempre.</p>
              </div>

              <div className="text-center mb-8">
                <p className="text-zinc-500 line-through text-lg">De R$ 97,00</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-2xl font-bold text-zinc-400">R$</span>
                  <span className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">47</span>
                </div>
                <p className="text-zinc-500 mt-2">Pagamento único • Acesso imediato</p>
              </div>

              <div className="space-y-3 mb-8">
                {[
                  '+15.000 músicas em alta qualidade',
                  'Atualizações semanais grátis',
                  'Download ilimitado',
                  'Funciona 100% offline',
                  'Suporte exclusivo via WhatsApp',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-zinc-300">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-900 font-bold text-lg h-14 rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all hover:scale-[1.02]"
                asChild
              >
                <a href={KIWIFY_LINK} target="_blank" rel="noopener noreferrer">
                  <Headphones className="w-5 h-5 mr-2" />
                  GARANTIR MEU ACESSO
                </a>
              </Button>

              <div className="flex items-center justify-center gap-4 mt-6 text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  Compra segura
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  Acesso imediato
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-zinc-900/30 relative z-10">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              O que dizem os <span className="text-amber-400">membros</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-zinc-900/50 backdrop-blur p-6 rounded-2xl border border-zinc-800">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-zinc-300 mb-6 text-sm leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-500/20"
                  />
                  <div>
                    <p className="font-bold text-white text-sm">{testimonial.name}</p>
                    <p className="text-xs text-zinc-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 relative z-10">
        <div className="container">
          <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              {[...Array(10)].map((_, i) => (
                <Music key={i} className="absolute text-zinc-900" style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  fontSize: `${Math.random() * 60 + 40}px`,
                }} />
              ))}
            </div>
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-black text-zinc-900 mb-4">
                Pare de Pagar Mensalidade!
              </h2>
              <p className="text-zinc-800 mb-8 max-w-2xl mx-auto text-lg">
                Entre agora para o SpotMusic e tenha +15.000 músicas para sempre por apenas R$47
              </p>
              <Button 
                className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-lg h-14 px-10 rounded-xl shadow-lg hover:scale-105 transition-all"
                asChild
              >
                <a href={KIWIFY_LINK} target="_blank" rel="noopener noreferrer">
                  QUERO MEU ACESSO AGORA
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-zinc-800 relative z-10">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                <Disc3 className="w-5 h-5 text-zinc-900" />
              </div>
              <div>
                <h3 className="font-bold text-white">SpotMusic</h3>
                <p className="text-xs text-zinc-500">Seu pendrive digital</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-zinc-500">contato@acessar.click</p>
              <p className="text-xs text-zinc-600">Suporte 24/7</p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-zinc-800/50 text-center">
            <p className="text-xs text-zinc-600">
              © 2024 SpotMusic. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ComunidadeMusica;
