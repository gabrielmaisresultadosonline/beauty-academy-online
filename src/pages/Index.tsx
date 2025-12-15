import { ArrowRight, Sparkles, TrendingUp, Zap, Music, Scissors } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-foreground flex flex-col items-center justify-center relative overflow-hidden">
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

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Logo */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-heading text-background tracking-tight">
            acessar<span className="text-primary">.</span>click
          </h1>
        </div>

        {/* Tagline */}
        <div className="space-y-4 mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-center gap-3 text-background/80">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-lg md:text-xl font-medium">Tudo em alta no mercado!</span>
          </div>
          <p className="text-2xl md:text-3xl lg:text-4xl font-heading text-background/90">
            O <span className="text-primary font-bold">digital</span> é a chave.
          </p>
        </div>

        {/* Aguarde */}
        <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="inline-flex items-center gap-2 bg-background/10 backdrop-blur-sm border border-background/20 rounded-full px-6 py-3 mb-12">
            <Sparkles className="w-5 h-5 text-secondary animate-pulse" />
            <span className="text-background/90 font-medium">Aguarde novidades</span>
            <Zap className="w-5 h-5 text-secondary animate-pulse" />
          </div>
        </div>

        {/* Featured Links */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <Link 
            to="/belezalisoperfeito"
            className="group inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-4 rounded-xl font-semibold text-base transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_hsl(340,82%,52%,0.4)]"
          >
            <Scissors className="w-5 h-5" />
            <span>Curso Cabeleireira</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            to="/comunidademusica"
            className="group inline-flex items-center gap-3 bg-[#1DB954] hover:bg-[#1DB954]/90 text-white px-6 py-4 rounded-xl font-semibold text-base transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(29,185,84,0.4)]"
          >
            <Music className="w-5 h-5" />
            <span>SpotMusic</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
        <p className="text-background/40 text-sm">
          © 2024 acessar.click — Todos os direitos reservados
        </p>
      </div>
    </div>
  );
};

export default Index;
