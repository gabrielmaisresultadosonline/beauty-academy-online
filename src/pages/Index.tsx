import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Check, 
  ArrowRight, 
  Zap, 
  Shield, 
  Users, 
  CreditCard,
  Star,
  ChevronRight,
  Calculator,
  Palette,
  BarChart3,
  Sparkles,
  BadgeCheck,
  Play
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import infinitepayLogo from "@/assets/infinitepay-logo.png";

const Index = () => {
  const navigate = useNavigate();
  const [productPrice, setProductPrice] = useState(97);
  const [salesCount, setSalesCount] = useState(100);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Fee calculations
  const totalRevenue = productPrice * salesCount;
  const kiwifyFees = (totalRevenue * 0.0899) + (salesCount * 2.49) + 3.50;
  const kiwifyNet = totalRevenue - kiwifyFees;
  const hotmartFees = (totalRevenue * 0.099) + (salesCount * 1);
  const hotmartNet = totalRevenue - hotmartFees;
  const eduzzFees = (totalRevenue * 0.099) + (salesCount * 1) + 2.90;
  const eduzzNet = totalRevenue - eduzzFees;
  const monetizzeFees = totalRevenue * 0.099;
  const monetizzeNet = totalRevenue - monetizzeFees;
  const acessarNet = totalRevenue;
  const maxSavings = Math.max(kiwifyFees, hotmartFees, eduzzFees, monetizzeFees);

  const activeProducts = [
    { name: "Beleza Liso Perfeito", description: "Curso completo de alisamento capilar", link: "/belezalisoperfeito" },
    { name: "SpotMusic", description: "Comunidade de música premium", link: "/comunidademusica" }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden font-body">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-[#00D26A]/10 blur-[200px] animate-glow-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#00D26A]/8 blur-[180px] animate-glow-pulse" style={{ animationDelay: '1.5s' }} />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="h-full w-full" style={{
            backgroundImage: 'linear-gradient(rgba(0,210,106,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,210,106,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>
        
        <div className={`relative z-10 max-w-6xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Header */}
          <header className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <div className="flex items-center gap-3 bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 px-5 py-3">
              <div className="w-10 h-10 bg-[#00D26A] flex items-center justify-center">
                <Zap className="w-5 h-5 text-zinc-950" />
              </div>
              <span className="text-xl font-bold tracking-tight">acessar<span className="text-[#00D26A]">.</span>click</span>
            </div>
            <span className="text-zinc-700 font-light">+</span>
            <div className="flex items-center gap-2 bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 px-5 py-3">
              <div className="w-8 h-8 bg-[#00D26A] flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-zinc-950" />
              </div>
              <span className="font-bold text-[#00D26A] tracking-tight">InfinitePay</span>
            </div>
            <span className="text-zinc-700 font-light">+</span>
            <div className="flex items-center gap-2 bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 px-5 py-3">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-blue-500">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="font-semibold text-sm tracking-tight">Meta Pixel</span>
            </div>
          </header>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#00D26A]/10 border border-[#00D26A]/40 px-6 py-2.5 mb-8">
            <BadgeCheck className="w-5 h-5 text-[#00D26A]" />
            <span className="text-sm text-[#00D26A] font-bold tracking-wide uppercase">Venda sem taxas • Receba na hora</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.1] tracking-tight">
            Sua <span className="text-[#00D26A]">Área de Membros</span>
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>e página de vendas pronta
          </h1>

          {/* Subheadline Features */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-2 sm:gap-4 mb-8">
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight">Sem taxas por venda</span>
            <span className="hidden sm:block text-zinc-700">•</span>
            <span className="text-lg sm:text-xl md:text-2xl font-black text-yellow-400 tracking-tight">Recebimento na hora</span>
            <span className="hidden sm:block text-zinc-700">•</span>
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight">100% do lucro é seu</span>
          </div>

          <p className="text-lg sm:text-xl md:text-2xl text-zinc-400 mb-8 max-w-3xl mx-auto leading-relaxed font-medium tracking-tight">
            Receba <span className="text-[#00D26A] font-bold">100% de cada venda</span> direto na sua conta InfinitePay.
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>Criamos seu site completo em até 24 horas.
          </p>

          {/* Instant Payment Badge */}
          <div className="inline-flex items-center gap-4 sm:gap-5 bg-gradient-to-r from-yellow-500/15 to-[#00D26A]/10 border-2 border-yellow-400/40 px-6 sm:px-10 py-4 sm:py-5 mb-10">
            <div className="relative flex-shrink-0">
              <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-400" />
              <div className="absolute inset-0 bg-yellow-400/40 blur-2xl animate-glow-pulse" />
            </div>
            <div className="text-left">
              <p className="text-yellow-400 font-black text-xl sm:text-2xl tracking-tight">RECEBA EM 8 SEGUNDOS</p>
              <p className="text-zinc-400 text-sm sm:text-base font-semibold tracking-tight">Infinit Nitro • Instantâneo na sua conta</p>
            </div>
          </div>

          {/* Price */}
          <div className="mb-10">
            <div className="flex items-center justify-center gap-4 mb-3">
              <span className="text-lg sm:text-xl text-zinc-500 line-through">R$ 2.000</span>
              <span className="bg-red-500 text-white px-3 py-1 text-sm font-black tracking-tight">-50%</span>
            </div>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-[#00D26A] text-2xl sm:text-3xl font-black">R$</span>
              <span className="text-6xl sm:text-7xl md:text-8xl font-black text-white tracking-tighter">997</span>
              <span className="text-zinc-500 text-lg sm:text-xl font-medium">/ano</span>
            </div>
            <p className="text-zinc-500 mt-3 font-semibold tracking-tight">12x de R$83,08 • Vendas ilimitadas</p>
          </div>

          {/* CTA Button */}
          <Button 
            onClick={() => navigate('/cliente/auth')}
            size="lg" 
            className="bg-[#00D26A] hover:bg-[#00D26A]/90 text-zinc-950 px-8 sm:px-12 py-6 sm:py-7 text-lg sm:text-xl font-black tracking-tight hover:scale-[1.02] transition-all duration-300 shadow-[0_0_80px_rgba(0,210,106,0.35)] group"
          >
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            Criar Minha Área de Membros
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-8 text-zinc-500 text-sm font-medium">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#00D26A]" />
              <span>Site de vendas incluso</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#00D26A]" />
              <span>Pronto em 24h</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#00D26A]" />
              <span>Zero taxas por venda</span>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-20 sm:py-24 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#00D26A]/10 border border-[#00D26A]/40 px-4 py-2 mb-6">
              <Calculator className="w-5 h-5 text-[#00D26A]" />
              <span className="text-[#00D26A] font-bold text-sm tracking-wide uppercase">Simulador de Economia</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tight">
              Compare e <span className="text-[#00D26A]">economize milhares</span>
            </h2>
            <p className="text-zinc-500 text-base sm:text-lg max-w-2xl mx-auto font-medium">
              Veja quanto você perde em taxas nas outras plataformas
            </p>
          </div>

          {/* Calculator Inputs */}
          <Card className="bg-zinc-900 border border-zinc-800 mb-10 max-w-xl mx-auto">
            <CardContent className="p-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <Label className="text-white font-bold text-sm tracking-tight">Preço do Produto</Label>
                  <div className="relative mt-2">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">R$</span>
                    <Input
                      type="number"
                      value={productPrice}
                      onChange={(e) => setProductPrice(Number(e.target.value) || 0)}
                      className="bg-zinc-800 border-zinc-700 text-white text-xl font-bold pl-12 h-14"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-white font-bold text-sm tracking-tight">Quantidade de Vendas</Label>
                  <Input
                    type="number"
                    value={salesCount}
                    onChange={(e) => setSalesCount(Number(e.target.value) || 0)}
                    className="bg-zinc-800 border-zinc-700 text-white text-xl font-bold h-14 mt-2"
                  />
                </div>
              </div>
              <div className="mt-4 p-4 bg-zinc-800/50 border border-zinc-700">
                <p className="text-zinc-500 text-sm font-semibold tracking-tight">Faturamento Total</p>
                <p className="text-3xl font-black text-white tracking-tight">
                  R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Comparison Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-3">
            {/* Kiwify */}
            <Card className="bg-zinc-900 border border-zinc-800 hover:border-red-500/40 transition-all">
              <CardContent className="p-3 sm:p-4">
                <h3 className="text-white font-bold text-sm sm:text-base mb-1 tracking-tight">Kiwify</h3>
                <p className="text-red-400 text-[10px] sm:text-xs mb-3 font-semibold">8.99% + R$2.49 + saque</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-zinc-600 text-[10px] sm:text-xs font-semibold">Taxas</p>
                    <p className="text-red-400 font-black text-sm sm:text-base">-R$ {kiwifyFees.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p className="text-zinc-600 text-[10px] sm:text-xs font-semibold">Você recebe</p>
                    <p className="text-white font-bold text-sm sm:text-base">R$ {kiwifyNet.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hotmart */}
            <Card className="bg-zinc-900 border border-zinc-800 hover:border-red-500/40 transition-all">
              <CardContent className="p-3 sm:p-4">
                <h3 className="text-white font-bold text-sm sm:text-base mb-1 tracking-tight">Hotmart</h3>
                <p className="text-red-400 text-[10px] sm:text-xs mb-3 font-semibold">9.9% + R$1/venda</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-zinc-600 text-[10px] sm:text-xs font-semibold">Taxas</p>
                    <p className="text-red-400 font-black text-sm sm:text-base">-R$ {hotmartFees.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p className="text-zinc-600 text-[10px] sm:text-xs font-semibold">Você recebe</p>
                    <p className="text-white font-bold text-sm sm:text-base">R$ {hotmartNet.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Eduzz */}
            <Card className="bg-zinc-900 border border-zinc-800 hover:border-red-500/40 transition-all">
              <CardContent className="p-3 sm:p-4">
                <h3 className="text-white font-bold text-sm sm:text-base mb-1 tracking-tight">Eduzz</h3>
                <p className="text-red-400 text-[10px] sm:text-xs mb-3 font-semibold">9.9% + R$1 + saque</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-zinc-600 text-[10px] sm:text-xs font-semibold">Taxas</p>
                    <p className="text-red-400 font-black text-sm sm:text-base">-R$ {eduzzFees.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p className="text-zinc-600 text-[10px] sm:text-xs font-semibold">Você recebe</p>
                    <p className="text-white font-bold text-sm sm:text-base">R$ {eduzzNet.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monetizze */}
            <Card className="bg-zinc-900 border border-zinc-800 hover:border-red-500/40 transition-all">
              <CardContent className="p-3 sm:p-4">
                <h3 className="text-white font-bold text-sm sm:text-base mb-1 tracking-tight">Monetizze</h3>
                <p className="text-red-400 text-[10px] sm:text-xs mb-3 font-semibold">9.9%</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-zinc-600 text-[10px] sm:text-xs font-semibold">Taxas</p>
                    <p className="text-red-400 font-black text-sm sm:text-base">-R$ {monetizzeFees.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p className="text-zinc-600 text-[10px] sm:text-xs font-semibold">Você recebe</p>
                    <p className="text-white font-bold text-sm sm:text-base">R$ {monetizzeNet.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Acessar.click */}
            <Card className="bg-[#00D26A]/10 border-2 border-[#00D26A] relative col-span-2 md:col-span-1">
              <div className="absolute -top-2 -right-2 bg-[#00D26A] text-zinc-950 px-2 py-0.5 text-[10px] sm:text-xs font-black tracking-tight">
                MELHOR
              </div>
              <CardContent className="p-3 sm:p-4">
                <h3 className="text-[#00D26A] font-bold text-sm sm:text-base mb-1 tracking-tight">Acessar.click</h3>
                <p className="text-[#00D26A] text-[10px] sm:text-xs mb-3 font-semibold">0% taxa • 0% saque</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-zinc-500 text-[10px] sm:text-xs font-semibold">Taxas</p>
                    <p className="text-[#00D26A] font-black text-sm sm:text-base">R$ 0,00</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-[10px] sm:text-xs font-semibold">Você recebe</p>
                    <p className="text-[#00D26A] font-black text-sm sm:text-base">R$ {acessarNet.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Savings Highlight */}
          <div className="mt-10 text-center">
            <Card className="bg-[#00D26A]/5 border border-[#00D26A]/30 inline-block">
              <CardContent className="p-6 sm:p-8">
                <p className="text-zinc-500 mb-2 font-semibold tracking-tight">Com Acessar.click você economiza até:</p>
                <p className="text-4xl sm:text-5xl md:text-6xl font-black text-[#00D26A] tracking-tighter">
                  R$ {maxSavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-24 bg-zinc-950">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-black text-center mb-12 tracking-tight">
            Como <span className="text-[#00D26A]">funciona</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { step: "1", title: "Cadastre-se", description: "Crie sua conta com nome, email, WhatsApp e senha" },
              { step: "2", title: "Faça o pagamento", description: "Pague R$997/ano via InfinitePay" },
              { step: "3", title: "Descreva seu produto", description: "Conte-nos sobre seu curso ou serviço" },
              { step: "4", title: "Receba em 24h", description: "Sua área de membros pronta para usar" }
            ].map((item, index) => (
              <div key={index} className="relative group">
                <Card className="bg-zinc-900 border border-zinc-800 hover:border-[#00D26A]/50 transition-all h-full group-hover:translate-y-[-4px]">
                  <CardContent className="p-4 sm:p-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#00D26A] text-zinc-950 flex items-center justify-center text-lg sm:text-xl font-black mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-white font-bold text-sm sm:text-base mb-2 tracking-tight">{item.title}</h3>
                    <p className="text-zinc-500 text-xs sm:text-sm font-medium">{item.description}</p>
                  </CardContent>
                </Card>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-5 h-5 text-[#00D26A]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-24 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-center mb-14 tracking-tight">
            Tudo <span className="text-[#00D26A]">incluso</span> no seu plano
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: <Zap className="w-6 h-6 sm:w-7 sm:h-7" />, title: "Receba em 8 Segundos", description: "Com Infinit Nitro, seu dinheiro cai na conta instantaneamente." },
              { icon: <Star className="w-6 h-6 sm:w-7 sm:h-7" />, title: "Zero Taxas por Venda", description: "Venda R$1.000 ou R$1.000.000 — você recebe 100%." },
              { icon: <Palette className="w-6 h-6 sm:w-7 sm:h-7" />, title: "Criamos Seu Site", description: "Página de vendas profissional completa em até 24 horas." },
              { icon: <Users className="w-6 h-6 sm:w-7 sm:h-7" />, title: "Área de Membros", description: "Sistema completo com login, dashboard e módulos." },
              { icon: <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7" />, title: "Facebook Pixel", description: "Configure seu pixel e rastreie todas as conversões." },
              { icon: <Shield className="w-6 h-6 sm:w-7 sm:h-7" />, title: "100% Automatizado", description: "Pagamento libera acesso instantâneo. Zero trabalho manual." }
            ].map((feature, index) => (
              <Card key={index} className="bg-zinc-900 border border-zinc-800 hover:border-[#00D26A]/50 transition-all hover:translate-y-[-4px] group">
                <CardContent className="p-5 sm:p-7">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#00D26A]/15 flex items-center justify-center mb-5 text-[#00D26A] group-hover:bg-[#00D26A]/25 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-white font-bold text-lg sm:text-xl mb-3 tracking-tight">{feature.title}</h3>
                  <p className="text-zinc-500 text-sm sm:text-base font-medium">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* InfinitePay Requirement */}
      <section className="py-16 sm:py-20 bg-zinc-950">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="bg-white border-0 overflow-hidden shadow-2xl">
            <CardContent className="p-6 sm:p-8 md:p-10">
              {/* Logo em cima */}
              <div className="flex justify-center mb-6">
                <img 
                  src={infinitepayLogo} 
                  alt="InfinitePay" 
                  className="h-16 sm:h-20 w-auto"
                />
              </div>
              
              {/* Informações abaixo */}
              <div className="text-center mb-6">
                <h3 className="text-xl sm:text-2xl font-black text-zinc-900 mb-3 tracking-tight">
                  Você precisa ter uma conta InfinitePay
                </h3>
                <p className="text-zinc-600 text-sm sm:text-base max-w-xl mx-auto font-medium">
                  Nossa área de membros se integra diretamente com a InfinitePay.
                  Ao vender, o dinheiro cai direto na sua conta — sem intermediários.
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {/* Recebimento na hora */}
                <div className="bg-zinc-100 p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-[#00D26A] p-2 flex-shrink-0">
                      <Zap className="w-5 h-5 text-zinc-900" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 text-base sm:text-lg tracking-tight">Recebimento na hora</h4>
                      <p className="text-zinc-600 text-xs sm:text-sm font-medium">
                        Receba em <span className="font-bold text-[#00D26A]">PIX</span> ou <span className="font-bold text-[#00D26A]">Cartão de Crédito</span> instantaneamente. 
                        Sem esperar 1 semana ou 15 dias — <span className="font-bold">receba na hora</span> todas as vendas.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reembolso */}
                <div className="bg-zinc-100 p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-zinc-300 p-2 flex-shrink-0">
                      <Shield className="w-5 h-5 text-zinc-700" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 text-base sm:text-lg tracking-tight">Como funciona o reembolso?</h4>
                      <p className="text-zinc-600 text-xs sm:text-sm font-medium">
                        Você recebe o ticket de reembolso em sua área administrativa. 
                        <span className="font-bold"> Você controla o seu reembolso</span> — total autonomia.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                <div className="flex items-center gap-2 bg-[#00D26A] px-4 py-2">
                  <Zap className="w-4 h-4 text-zinc-900" />
                  <span className="text-xs sm:text-sm font-black text-zinc-900 tracking-tight">Infinit Nitro: 8 segundos</span>
                </div>
                <div className="flex items-center gap-2 bg-zinc-200 px-4 py-2">
                  <Shield className="w-4 h-4 text-[#00D26A]" />
                  <span className="text-xs sm:text-sm font-bold text-zinc-700 tracking-tight">100% Seguro</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Active Products */}
      <section className="py-20 sm:py-24 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-center mb-4 tracking-tight">
            Produtos <span className="text-[#00D26A]">ativos</span> em nossa plataforma
          </h2>
          <p className="text-zinc-500 text-center mb-10 font-medium">
            Veja exemplos reais funcionando agora mesmo
          </p>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {activeProducts.map((product, index) => (
              <Link key={index} to={product.link} className="group">
                <Card className="bg-zinc-900 border border-zinc-800 hover:border-[#00D26A]/50 transition-all hover:translate-y-[-4px]">
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#00D26A]/15 flex items-center justify-center">
                        <Play className="w-5 h-5 sm:w-6 sm:h-6 text-[#00D26A]" />
                      </div>
                    </div>
                    <h3 className="text-white font-bold text-lg sm:text-xl group-hover:text-[#00D26A] transition-colors mb-2 tracking-tight">
                      {product.name}
                    </h3>
                    <p className="text-zinc-500 text-sm font-medium mb-4">{product.description}</p>
                    <div className="flex items-center gap-2 text-[#00D26A] font-bold text-sm">
                      <span>Ver página de vendas</span>
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-24 bg-zinc-950">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Card className="bg-gradient-to-b from-[#00D26A]/10 to-transparent border border-[#00D26A]/20">
            <CardContent className="p-8 sm:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                Pronto para <span className="text-[#00D26A]">faturar sem taxas</span>?
              </h2>
              <p className="text-zinc-500 text-base sm:text-lg mb-8 max-w-2xl mx-auto font-medium">
                Nós criamos sua página de vendas e área de membros completa.
                Você só adiciona seu conteúdo e começa a vender.
              </p>

              <div className="mb-8">
                <div className="flex items-center justify-center gap-4 mb-2">
                  <span className="text-base sm:text-lg text-zinc-500 line-through">R$ 2.000</span>
                </div>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-[#00D26A] text-xl sm:text-2xl font-black">R$</span>
                  <span className="text-5xl sm:text-6xl font-black text-white tracking-tighter">997</span>
                  <span className="text-zinc-500 text-base sm:text-lg font-medium">/ano</span>
                </div>
              </div>

              <Button 
                onClick={() => navigate('/cliente/auth')}
                size="lg" 
                className="bg-[#00D26A] hover:bg-[#00D26A]/90 text-zinc-950 px-10 sm:px-12 py-5 sm:py-6 text-lg sm:text-xl font-black tracking-tight hover:scale-[1.02] transition-all duration-300 shadow-[0_0_80px_rgba(0,210,106,0.4)] group"
              >
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                Criar Minha Área de Membros
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-8 text-zinc-500 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00D26A]" />
                  <span>Site de vendas incluso</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00D26A]" />
                  <span>Pronto em 24h</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00D26A]" />
                  <span>Suporte incluído</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#00D26A] flex items-center justify-center">
                <Zap className="w-4 h-4 text-zinc-950" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                acessar<span className="text-[#00D26A]">.</span>click
              </span>
            </div>
            <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium">
              <span>Pagamentos via</span>
              <div className="flex items-center gap-1 text-[#00D26A] font-bold">
                <CreditCard className="w-4 h-4" />
                InfinitePay
              </div>
            </div>
            <p className="text-zinc-600 text-sm font-medium">
              © 2024 acessar.click — Todos os direitos reservados
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
