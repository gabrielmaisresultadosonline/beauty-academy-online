import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Check, 
  ArrowRight, 
  Zap, 
  Shield, 
  Clock, 
  Users, 
  TrendingUp, 
  CreditCard,
  Star,
  ChevronRight,
  Calculator,
  DollarSign,
  Palette,
  BarChart3,
  Sparkles,
  BadgeCheck
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import infinitepayLogo from "@/assets/infinitepay-logo.png";

const Index = () => {
  const navigate = useNavigate();
  const [productPrice, setProductPrice] = useState(97);
  const [salesCount, setSalesCount] = useState(100);

  // Fee calculations
  const totalRevenue = productPrice * salesCount;
  
  // Kiwify: 8.99% + R$2.49 per sale + R$3.50 withdrawal fee
  const kiwifyFees = (totalRevenue * 0.0899) + (salesCount * 2.49) + 3.50;
  const kiwifyNet = totalRevenue - kiwifyFees;
  
  // Hotmart: 9.9% + R$1 per sale
  const hotmartFees = (totalRevenue * 0.099) + (salesCount * 1);
  const hotmartNet = totalRevenue - hotmartFees;
  
  // Eduzz: 9.9% + R$1 per sale + R$2.90 withdrawal
  const eduzzFees = (totalRevenue * 0.099) + (salesCount * 1) + 2.90;
  const eduzzNet = totalRevenue - eduzzFees;
  
  // Monetizze: 9.9%
  const monetizzeFees = totalRevenue * 0.099;
  const monetizzeNet = totalRevenue - monetizzeFees;
  
  // Acessar.click: 0%
  const acessarNet = totalRevenue;
  const maxSavings = Math.max(kiwifyFees, hotmartFees, eduzzFees, monetizzeFees);

  const activeProducts = [
    { name: "Beleza Liso Perfeito", description: "Curso completo de alisamento", price: "R$ 47", link: "/belezalisoperfeito" },
    { name: "SpotMusic", description: "Comunidade de música", price: "R$ 47", link: "/comunidademusica" }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-16">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#00D26A]/15 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#00D26A]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="h-full w-full" style={{
            backgroundImage: 'linear-gradient(rgba(0,210,106,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,210,106,0.5) 1px, transparent 1px)',
            backgroundSize: '80px 80px'
          }} />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Header */}
          <header className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <div className="flex items-center gap-3 bg-zinc-900/80 border border-zinc-800 px-5 py-3 rounded-2xl">
              <div className="w-9 h-9 bg-[#00D26A] rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-zinc-950" />
              </div>
              <span className="text-xl font-bold">acessar<span className="text-[#00D26A]">.</span>click</span>
            </div>
            <span className="text-zinc-600">+</span>
            <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-5 py-3 rounded-2xl">
              <div className="w-8 h-8 bg-[#00D26A] rounded-lg flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-zinc-950" />
              </div>
              <span className="font-bold text-[#00D26A]">InfinitePay</span>
            </div>
            <span className="text-zinc-600">+</span>
            <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-5 py-3 rounded-2xl">
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-blue-500">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="font-semibold text-sm">Meta Pixel</span>
            </div>
          </header>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#00D26A]/10 border border-[#00D26A]/30 rounded-full px-5 py-2 mb-8">
            <BadgeCheck className="w-5 h-5 text-[#00D26A]" />
            <span className="text-sm text-[#00D26A] font-semibold">Venda sem taxas • Receba na hora</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Sua <span className="text-[#00D26A]">Área de Membros</span>
            <br />sem taxas por venda
          </h1>

          <p className="text-xl text-zinc-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            Receba <span className="text-white font-semibold">100% de cada venda</span> direto na sua conta InfinitePay.
            <br />Criamos seu site de vendas completo em até 24 horas.
          </p>

          {/* Instant Payment Badge */}
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-yellow-500/10 to-[#00D26A]/10 border border-yellow-500/30 px-8 py-4 rounded-2xl mb-10">
            <div className="relative">
              <Zap className="w-8 h-8 text-yellow-400" />
              <div className="absolute inset-0 bg-yellow-400/40 rounded-full blur-xl animate-pulse" />
            </div>
            <div className="text-left">
              <p className="text-yellow-400 font-bold text-lg">Infinit Nitro: 8 segundos</p>
              <p className="text-zinc-400 text-sm">Receba instantaneamente na sua conta</p>
            </div>
          </div>

          {/* Price */}
          <div className="mb-10">
            <div className="flex items-center justify-center gap-4 mb-3">
              <span className="text-xl text-zinc-500 line-through">R$ 2.000</span>
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">-50%</span>
            </div>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-[#00D26A] text-3xl font-bold">R$</span>
              <span className="text-7xl md:text-8xl font-bold text-white">997</span>
              <span className="text-zinc-500 text-xl">/ano</span>
            </div>
            <p className="text-zinc-500 mt-3 font-medium">12x de R$83,08 • Vendas ilimitadas</p>
          </div>

          {/* CTA Button */}
          <Button 
            onClick={() => navigate('/cliente/auth')}
            size="lg" 
            className="bg-[#00D26A] hover:bg-[#00D26A]/90 text-zinc-950 px-10 py-7 text-xl font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-[0_0_60px_rgba(0,210,106,0.3)]"
          >
            <Sparkles className="w-6 h-6 mr-2" />
            Criar Minha Área de Membros
            <ArrowRight className="w-6 h-6 ml-2" />
          </Button>

          <div className="flex flex-wrap justify-center gap-6 mt-8 text-zinc-400 text-sm">
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
      <section className="py-20 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#00D26A]/10 border border-[#00D26A]/30 px-4 py-2 rounded-full mb-6">
              <Calculator className="w-5 h-5 text-[#00D26A]" />
              <span className="text-[#00D26A] font-semibold text-sm">SIMULADOR DE ECONOMIA</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Compare e <span className="text-[#00D26A]">economize milhares</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Veja quanto você perde em taxas nas outras plataformas
            </p>
          </div>

          {/* Calculator Inputs */}
          <Card className="bg-zinc-900 border border-zinc-800 mb-10 max-w-xl mx-auto">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-white font-medium">Preço do Produto</Label>
                  <div className="relative mt-2">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">R$</span>
                    <Input
                      type="number"
                      value={productPrice}
                      onChange={(e) => setProductPrice(Number(e.target.value) || 0)}
                      className="bg-zinc-800 border-zinc-700 text-white text-xl font-semibold pl-10 h-14"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-white font-medium">Quantidade de Vendas</Label>
                  <Input
                    type="number"
                    value={salesCount}
                    onChange={(e) => setSalesCount(Number(e.target.value) || 0)}
                    className="bg-zinc-800 border-zinc-700 text-white text-xl font-semibold h-14 mt-2"
                  />
                </div>
              </div>
              <div className="mt-4 p-4 bg-zinc-800/50 rounded-xl">
                <p className="text-zinc-400 text-sm">Faturamento Total</p>
                <p className="text-3xl font-bold text-white">
                  R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Comparison Cards */}
          <div className="grid md:grid-cols-5 gap-3">
            {/* Kiwify */}
            <Card className="bg-zinc-900 border border-zinc-800 hover:border-red-500/30 transition-all">
              <CardContent className="p-4">
                <h3 className="text-white font-bold mb-1">Kiwify</h3>
                <p className="text-red-400 text-xs mb-3">8.99% + R$2.49 + saque</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-zinc-500 text-xs">Taxas</p>
                    <p className="text-red-400 font-bold">-R$ {kiwifyFees.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-xs">Você recebe</p>
                    <p className="text-white font-semibold">R$ {kiwifyNet.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hotmart */}
            <Card className="bg-zinc-900 border border-zinc-800 hover:border-red-500/30 transition-all">
              <CardContent className="p-4">
                <h3 className="text-white font-bold mb-1">Hotmart</h3>
                <p className="text-red-400 text-xs mb-3">9.9% + R$1/venda</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-zinc-500 text-xs">Taxas</p>
                    <p className="text-red-400 font-bold">-R$ {hotmartFees.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-xs">Você recebe</p>
                    <p className="text-white font-semibold">R$ {hotmartNet.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Eduzz */}
            <Card className="bg-zinc-900 border border-zinc-800 hover:border-red-500/30 transition-all">
              <CardContent className="p-4">
                <h3 className="text-white font-bold mb-1">Eduzz</h3>
                <p className="text-red-400 text-xs mb-3">9.9% + R$1 + saque</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-zinc-500 text-xs">Taxas</p>
                    <p className="text-red-400 font-bold">-R$ {eduzzFees.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-xs">Você recebe</p>
                    <p className="text-white font-semibold">R$ {eduzzNet.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monetizze */}
            <Card className="bg-zinc-900 border border-zinc-800 hover:border-red-500/30 transition-all">
              <CardContent className="p-4">
                <h3 className="text-white font-bold mb-1">Monetizze</h3>
                <p className="text-red-400 text-xs mb-3">9.9%</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-zinc-500 text-xs">Taxas</p>
                    <p className="text-red-400 font-bold">-R$ {monetizzeFees.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-xs">Você recebe</p>
                    <p className="text-white font-semibold">R$ {monetizzeNet.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Acessar.click */}
            <Card className="bg-[#00D26A]/10 border-2 border-[#00D26A] relative">
              <div className="absolute -top-2 -right-2 bg-[#00D26A] text-zinc-950 px-2 py-0.5 rounded text-xs font-bold">
                MELHOR
              </div>
              <CardContent className="p-4">
                <h3 className="text-[#00D26A] font-bold mb-1">Acessar.click</h3>
                <p className="text-[#00D26A] text-xs mb-3">0% taxa • 0% saque</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-zinc-400 text-xs">Taxas</p>
                    <p className="text-[#00D26A] font-bold">R$ 0,00</p>
                  </div>
                  <div>
                    <p className="text-zinc-400 text-xs">Você recebe</p>
                    <p className="text-[#00D26A] font-bold">R$ {acessarNet.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Savings Highlight */}
          <div className="mt-10 text-center">
            <Card className="bg-[#00D26A]/5 border border-[#00D26A]/30 inline-block">
              <CardContent className="p-8">
                <p className="text-zinc-400 mb-2">Com Acessar.click você economiza até:</p>
                <p className="text-5xl md:text-6xl font-bold text-[#00D26A]">
                  R$ {maxSavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-zinc-950">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Como <span className="text-[#00D26A]">funciona</span>
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Cadastre-se", description: "Crie sua conta com nome, email, WhatsApp e senha" },
              { step: "2", title: "Faça o pagamento", description: "Pague R$997/ano via InfinitePay" },
              { step: "3", title: "Descreva seu produto", description: "Conte-nos sobre seu curso ou serviço" },
              { step: "4", title: "Receba em 24h", description: "Sua área de membros pronta para usar" }
            ].map((item, index) => (
              <div key={index} className="relative">
                <Card className="bg-zinc-900 border border-zinc-800 hover:border-[#00D26A]/50 transition-all h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-[#00D26A] text-zinc-950 rounded-xl flex items-center justify-center text-xl font-bold mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-white font-bold mb-2">{item.title}</h3>
                    <p className="text-zinc-400 text-sm">{item.description}</p>
                  </CardContent>
                </Card>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-[#00D26A]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Tudo <span className="text-[#00D26A]">incluso</span> no seu plano
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Zap className="w-6 h-6" />, title: "Receba em 8 Segundos", description: "Com Infinit Nitro, seu dinheiro cai na conta instantaneamente." },
              { icon: <Star className="w-6 h-6" />, title: "Zero Taxas por Venda", description: "Venda R$1.000 ou R$1.000.000 — você recebe 100%." },
              { icon: <Palette className="w-6 h-6" />, title: "Criamos Seu Site", description: "Página de vendas profissional completa em até 24 horas." },
              { icon: <Users className="w-6 h-6" />, title: "Área de Membros", description: "Sistema completo com login, dashboard e módulos." },
              { icon: <BarChart3 className="w-6 h-6" />, title: "Facebook Pixel", description: "Configure seu pixel e rastreie todas as conversões." },
              { icon: <Shield className="w-6 h-6" />, title: "100% Automatizado", description: "Pagamento libera acesso instantâneo. Zero trabalho manual." }
            ].map((feature, index) => (
              <Card key={index} className="bg-zinc-900 border border-zinc-800 hover:border-[#00D26A]/50 transition-all">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-[#00D26A]/10 rounded-xl flex items-center justify-center mb-4 text-[#00D26A]">
                    {feature.icon}
                  </div>
                  <h3 className="text-white font-bold mb-2">{feature.title}</h3>
                  <p className="text-zinc-400 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* InfinitePay Requirement */}
      <section className="py-16 bg-zinc-950">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="bg-zinc-900 border border-zinc-800 overflow-hidden">
            <CardContent className="p-8 md:p-10">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <img 
                    src={infinitepayLogo} 
                    alt="InfinitePay" 
                    className="h-20 w-auto"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Você precisa ter uma conta InfinitePay
                  </h3>
                  <p className="text-zinc-400 mb-4">
                    Nossa área de membros se integra diretamente com a InfinitePay.
                    Ao vender, o dinheiro cai direto na sua conta — sem intermediários.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 bg-[#00D26A]/10 px-3 py-1.5 rounded-full">
                      <Zap className="w-4 h-4 text-[#00D26A]" />
                      <span className="text-sm font-semibold text-[#00D26A]">Infinit Nitro: 8 segundos</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#00D26A]/10 px-3 py-1.5 rounded-full">
                      <Shield className="w-4 h-4 text-[#00D26A]" />
                      <span className="text-sm font-semibold text-[#00D26A]">100% Seguro</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Active Products */}
      <section className="py-20 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Produtos <span className="text-[#00D26A]">ativos</span> em nossa plataforma
          </h2>
          <p className="text-zinc-400 text-center mb-10">
            Veja exemplos reais funcionando agora mesmo
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {activeProducts.map((product, index) => (
              <Link key={index} to={product.link} className="group">
                <Card className="bg-zinc-900 border border-zinc-800 hover:border-[#00D26A]/50 transition-all hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 bg-[#00D26A]/10 rounded-xl flex items-center justify-center">
                        <Star className="w-6 h-6 text-[#00D26A]" />
                      </div>
                      <div className="bg-[#00D26A] text-zinc-950 px-4 py-1.5 rounded-full font-bold text-lg">
                        {product.price}
                      </div>
                    </div>
                    <h3 className="text-white font-bold text-xl group-hover:text-[#00D26A] transition-colors mb-1">
                      {product.name}
                    </h3>
                    <p className="text-zinc-400 text-sm mb-4">{product.description}</p>
                    <div className="flex items-center gap-2 text-[#00D26A] font-medium">
                      <span>Ver página de vendas</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-zinc-950">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Card className="bg-gradient-to-b from-[#00D26A]/10 to-transparent border border-[#00D26A]/20">
            <CardContent className="p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Pronto para <span className="text-[#00D26A]">faturar sem taxas</span>?
              </h2>
              <p className="text-zinc-400 text-lg mb-8 max-w-2xl mx-auto">
                Nós criamos sua página de vendas e área de membros completa.
                Você só adiciona seu conteúdo e começa a vender.
              </p>

              <div className="mb-8">
                <div className="flex items-center justify-center gap-4 mb-2">
                  <span className="text-lg text-zinc-500 line-through">R$ 2.000</span>
                </div>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-[#00D26A] text-2xl font-bold">R$</span>
                  <span className="text-6xl font-bold text-white">997</span>
                  <span className="text-zinc-500 text-lg">/ano</span>
                </div>
              </div>

              <Button 
                onClick={() => navigate('/cliente/auth')}
                size="lg" 
                className="bg-[#00D26A] hover:bg-[#00D26A]/90 text-zinc-950 px-12 py-6 text-xl font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-[0_0_60px_rgba(0,210,106,0.4)]"
              >
                <Zap className="w-6 h-6 mr-2" />
                Criar Minha Área de Membros
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>

              <div className="flex flex-wrap justify-center gap-6 mt-8 text-zinc-400 text-sm">
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
              <div className="w-8 h-8 bg-[#00D26A] rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-zinc-950" />
              </div>
              <span className="text-lg font-bold text-white">
                acessar<span className="text-[#00D26A]">.</span>click
              </span>
            </div>
            <div className="flex items-center gap-2 text-zinc-500 text-sm">
              <span>Pagamentos via</span>
              <div className="flex items-center gap-1 text-[#00D26A] font-semibold">
                <CreditCard className="w-4 h-4" />
                InfinitePay
              </div>
            </div>
            <p className="text-zinc-500 text-sm">
              © 2024 acessar.click — Todos os direitos reservados
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;