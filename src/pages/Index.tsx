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
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
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

  const paymentLink = `https://checkout.infinitepay.io/paguemro?items=[{"name":"AREA%20DE%20MEMBROS%20ANUAL","price":99700,"quantity":1}]&redirect_url=https://acessar.click/onboarding`;

  const activeProducts = [
    { name: "Beleza Liso Perfeito", description: "Curso completo de alisamento", price: "R$ 47", link: "/belezalisoperfeito" },
    { name: "SpotMusic", description: "Comunidade de música", price: "R$ 47", link: "/comunidademusica" }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-sans">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-green-950/50 via-black to-emerald-950/30" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Logos */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <div className="bg-white/5 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/10">
              <span className="text-xl font-black tracking-tight">acessar<span className="text-green-400">.click</span></span>
            </div>
            <span className="text-white/30 text-xl">+</span>
            <div className="bg-white/5 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/10 flex items-center gap-2">
              <div className="w-8 h-8 bg-[#00D26A] rounded-lg flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-black" />
              </div>
              <span className="font-bold text-[#00D26A]">InfinitePay</span>
            </div>
            <span className="text-white/30 text-xl">+</span>
            <div className="bg-white/5 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/10 flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-blue-500">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="font-bold text-sm text-white">Meta Pixel</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-none tracking-tighter uppercase">
            <span className="text-white">VENDA SEM</span>
            <br />
            <span className="text-green-400 relative inline-block">
              TAXA
              <span className="absolute -right-6 -top-2 text-xs bg-green-500 text-black px-2 py-1 rounded-full font-black">0%</span>
            </span>
          </h1>

          {/* Instant Payment Badge */}
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-yellow-500/10 to-green-500/10 border-2 border-yellow-400/50 px-8 py-5 rounded-2xl mb-10">
            <div className="relative">
              <Zap className="w-10 h-10 text-yellow-400" />
              <div className="absolute inset-0 w-10 h-10 bg-yellow-400/50 rounded-full blur-xl animate-pulse" />
            </div>
            <div className="text-left">
              <p className="text-yellow-400 font-black text-2xl tracking-tight">RECEBA EM 8 SEGUNDOS</p>
              <p className="text-white/60 text-sm font-semibold">Direto na sua conta InfinitePay Nitro</p>
            </div>
          </div>

          <p className="text-lg md:text-xl text-white/70 mb-10 max-w-3xl mx-auto font-medium leading-relaxed">
            Sistema completo: <strong className="text-green-400">área de membros</strong> + <strong className="text-green-400">página de vendas</strong> + <strong className="text-green-400">Facebook Pixel</strong>
            <br />Nós criamos tudo. Você só adiciona seu conteúdo.
          </p>

          {/* Price */}
          <div className="mb-10">
            <div className="flex items-center justify-center gap-4 mb-3">
              <span className="text-2xl text-white/40 line-through font-bold">R$ 2.000</span>
              <span className="bg-red-500 text-white px-4 py-1.5 rounded-full text-sm font-black animate-pulse">-50% OFF</span>
            </div>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-green-400 text-4xl font-black">R$</span>
              <span className="text-8xl md:text-9xl font-black text-white tracking-tighter">997</span>
              <span className="text-white/50 text-xl font-bold">/ano</span>
            </div>
            <p className="text-white/50 mt-3 font-bold text-lg">VENDAS ILIMITADAS • 100% DO LUCRO É SEU</p>
          </div>

          <a href={paymentLink} target="_blank" rel="noopener noreferrer">
            <Button 
              size="lg" 
              className="bg-green-500 hover:bg-green-400 text-black font-black text-xl px-14 py-8 rounded-2xl shadow-2xl shadow-green-500/40 transform hover:scale-105 transition-all duration-300 uppercase tracking-wide"
            >
              QUERO COMEÇAR AGORA
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
          </a>

          <p className="mt-8 text-white/40 text-sm font-semibold tracking-wide">
            ✓ ÁREA PRONTA EM 24H • ✓ SUPORTE INCLUÍDO • ✓ AUTOMAÇÃO COMPLETA
          </p>
        </div>
      </section>

      {/* Interactive Calculator Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-black via-zinc-950 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 px-5 py-2.5 rounded-full mb-6">
              <Calculator className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-black text-sm tracking-wide uppercase">SIMULADOR DE ECONOMIA</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase">
              CALCULE <span className="text-red-500">QUANTO VOCÊ PERDE</span>
            </h2>
            <p className="text-lg text-white/50 font-semibold">
              Nas outras plataformas vs Acessar.click
            </p>
          </div>

          {/* Calculator Inputs */}
          <Card className="bg-zinc-900/80 border-2 border-green-500/40 mb-12 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <Label className="text-white font-black text-base mb-3 block uppercase tracking-wide">
                    <DollarSign className="w-4 h-4 inline mr-2 text-green-400" />
                    Preço do Produto
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-black">R$</span>
                    <Input
                      type="number"
                      value={productPrice}
                      onChange={(e) => setProductPrice(Number(e.target.value) || 0)}
                      className="bg-black border-2 border-white/20 text-white text-2xl font-black pl-12 h-16 rounded-xl focus:border-green-500"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-white font-black text-base mb-3 block uppercase tracking-wide">
                    <TrendingUp className="w-4 h-4 inline mr-2 text-green-400" />
                    Quantidade de Vendas
                  </Label>
                  <Input
                    type="number"
                    value={salesCount}
                    onChange={(e) => setSalesCount(Number(e.target.value) || 0)}
                    className="bg-black border-2 border-white/20 text-white text-2xl font-black h-16 rounded-xl focus:border-green-500"
                  />
                </div>
              </div>
              <div className="mt-6 p-6 bg-black/60 rounded-xl border border-white/10">
                <p className="text-white/50 font-bold uppercase text-sm tracking-wide">Faturamento Total:</p>
                <p className="text-5xl font-black text-white tracking-tight">
                  R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Comparison Cards */}
          <div className="grid md:grid-cols-5 gap-3">
            {/* Kiwify */}
            <Card className="bg-zinc-900/60 border border-red-500/40 hover:border-red-500/70 transition-all">
              <CardContent className="p-5">
                <h3 className="text-white font-black text-base mb-1">Kiwify</h3>
                <p className="text-red-400 text-xs font-bold mb-4">8.99% + R$2.49/venda + R$3.50 saque</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-white/40 text-xs font-bold uppercase">Taxas</p>
                    <p className="text-red-400 font-black text-xl">-R$ {kiwifyFees.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs font-bold uppercase">Você Recebe</p>
                    <p className="text-white font-black text-lg">R$ {kiwifyNet.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hotmart */}
            <Card className="bg-zinc-900/60 border border-red-500/40 hover:border-red-500/70 transition-all">
              <CardContent className="p-5">
                <h3 className="text-white font-black text-base mb-1">Hotmart</h3>
                <p className="text-red-400 text-xs font-bold mb-4">9.9% + R$1/venda</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-white/40 text-xs font-bold uppercase">Taxas</p>
                    <p className="text-red-400 font-black text-xl">-R$ {hotmartFees.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs font-bold uppercase">Você Recebe</p>
                    <p className="text-white font-black text-lg">R$ {hotmartNet.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Eduzz */}
            <Card className="bg-zinc-900/60 border border-red-500/40 hover:border-red-500/70 transition-all">
              <CardContent className="p-5">
                <h3 className="text-white font-black text-base mb-1">Eduzz</h3>
                <p className="text-red-400 text-xs font-bold mb-4">9.9% + R$1/venda + saque</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-white/40 text-xs font-bold uppercase">Taxas</p>
                    <p className="text-red-400 font-black text-xl">-R$ {eduzzFees.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs font-bold uppercase">Você Recebe</p>
                    <p className="text-white font-black text-lg">R$ {eduzzNet.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monetizze */}
            <Card className="bg-zinc-900/60 border border-red-500/40 hover:border-red-500/70 transition-all">
              <CardContent className="p-5">
                <h3 className="text-white font-black text-base mb-1">Monetizze</h3>
                <p className="text-red-400 text-xs font-bold mb-4">9.9% por venda</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-white/40 text-xs font-bold uppercase">Taxas</p>
                    <p className="text-red-400 font-black text-xl">-R$ {monetizzeFees.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs font-bold uppercase">Você Recebe</p>
                    <p className="text-white font-black text-lg">R$ {monetizzeNet.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Acessar.click */}
            <Card className="bg-gradient-to-br from-green-900/60 to-emerald-900/40 border-2 border-green-400 hover:border-green-300 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-green-400 text-black px-3 py-1 text-xs font-black uppercase">
                Melhor
              </div>
              <CardContent className="p-5">
                <h3 className="text-green-400 font-black text-base mb-1">Acessar.click</h3>
                <p className="text-green-300 text-xs font-bold mb-4">0% taxa • 0% saque</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-white/40 text-xs font-bold uppercase">Taxas</p>
                    <p className="text-green-400 font-black text-xl">R$ 0,00</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs font-bold uppercase">Você Recebe</p>
                    <p className="text-green-400 font-black text-lg">R$ {acessarNet.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Savings Highlight */}
          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-400/60 inline-block">
              <CardContent className="p-10">
                <p className="text-white/50 font-black uppercase tracking-wide mb-3">Com Acessar.click você economiza até:</p>
                <p className="text-6xl md:text-7xl font-black text-green-400 tracking-tight">
                  R$ {maxSavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-white/50 font-bold mt-3 uppercase text-sm">em taxas nas suas vendas</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black text-center mb-16 tracking-tighter uppercase">
            O QUE VOCÊ <span className="text-green-400">RECEBE</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: <Palette className="w-9 h-9" />, title: "PÁGINA DE VENDAS", description: "Site profissional de alta conversão" },
              { icon: <Users className="w-9 h-9" />, title: "ÁREA DE MEMBROS", description: "Sistema completo para seu conteúdo" },
              { icon: <BarChart3 className="w-9 h-9" />, title: "FACEBOOK PIXEL", description: "Rastreamento de conversões automático" },
              { icon: <Zap className="w-9 h-9" />, title: "RECEBA EM 8s", description: "Pagamento instantâneo InfinitePay" },
              { icon: <Star className="w-9 h-9" />, title: "VENDAS ILIMITADAS", description: "Sem limite, sem taxas por transação" },
              { icon: <Clock className="w-9 h-9" />, title: "PRONTO EM 24H", description: "Sua área funcionando rapidamente" }
            ].map((benefit, index) => (
              <Card key={index} className="bg-zinc-900/40 border border-white/10 hover:border-green-500/50 transition-all group">
                <CardContent className="p-7">
                  <div className="text-green-400 mb-4 group-hover:scale-110 transition-transform">{benefit.icon}</div>
                  <h3 className="text-lg font-black text-white mb-2 tracking-tight">{benefit.title}</h3>
                  <p className="text-white/50 font-semibold text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-gradient-to-b from-black to-zinc-950">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black text-center mb-16 tracking-tighter uppercase">
            COMO <span className="text-green-400">FUNCIONA</span>
          </h2>

          <div className="space-y-6">
            {[
              { step: "1", title: "CRIE SUA CONTA INFINITEPAY", description: "Conta bancária digital para receber pagamentos instantâneos." },
              { step: "2", title: "FAÇA O PAGAMENTO", description: "Assine o plano anual de R$997 e desbloqueie todas as funcionalidades." },
              { step: "3", title: "PREENCHA O FORMULÁRIO", description: "Descreva seu produto, público-alvo e informações para criarmos sua página." },
              { step: "4", title: "ADICIONE SEU CONTEÚDO", description: "Em 24h sua área estará pronta. Basta adicionar suas aulas e vídeos." }
            ].map((item, index) => (
              <div key={index} className="flex gap-6 items-start group">
                <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-black text-black">{item.step}</span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-white mb-1 tracking-tight">{item.title}</h3>
                  <p className="text-white/50 text-base font-semibold">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* InfinitePay Requirement */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-900/30 to-emerald-900/20 border-y-2 border-green-500/40">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-14 h-14 bg-[#00D26A] rounded-xl flex items-center justify-center">
              <CreditCard className="w-7 h-7 text-black" />
            </div>
            <span className="text-2xl font-black text-[#00D26A]">InfinitePay</span>
            <span className="bg-yellow-400 text-black px-4 py-1.5 rounded-full text-sm font-black uppercase">Nitro</span>
          </div>
          <h3 className="text-2xl md:text-4xl font-black mb-4 tracking-tight">
            RECEBIMENTO EM ATÉ <span className="text-yellow-400">8 SEGUNDOS</span>
          </h3>
          <p className="text-white/60 text-lg font-semibold max-w-2xl mx-auto">
            Você precisa ter uma conta InfinitePay para receber seus pagamentos. 
            Integração direta, sem intermediários.
          </p>
        </div>
      </section>

      {/* Active Products */}
      <section className="py-24 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-4 tracking-tighter uppercase">
            PRODUTOS <span className="text-green-400">ATIVOS</span>
          </h2>
          <p className="text-white/50 text-center mb-12 font-semibold text-lg">
            Exemplos funcionando em nossa plataforma
          </p>

          <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {activeProducts.map((product, index) => (
              <Link key={index} to={product.link}>
                <Card className="bg-zinc-900/50 border border-white/10 hover:border-green-500/50 transition-all cursor-pointer group">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-black text-white group-hover:text-green-400 transition-colors tracking-tight">
                        {product.name}
                      </h3>
                      <p className="text-white/50 font-semibold text-sm">{product.description}</p>
                      <p className="text-green-400 font-black mt-2">{product.price}</p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-white/30 group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 bg-gradient-to-t from-green-950/40 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase">
            COMECE A <span className="text-green-400">VENDER HOJE</span>
          </h2>
          <p className="text-lg text-white/60 mb-10 font-semibold">
            Sistema completo • Automação total • Receba na hora
          </p>
          
          <div className="mb-10">
            <div className="flex items-center justify-center gap-4 mb-2">
              <span className="text-xl text-white/40 line-through font-bold">R$ 2.000</span>
            </div>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-green-400 text-3xl font-black">R$</span>
              <span className="text-7xl md:text-8xl font-black text-white tracking-tighter">997</span>
              <span className="text-white/50 text-lg font-bold">/ano</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {["Vendas ilimitadas", "0% taxa de venda", "0% taxa de saque", "100% do lucro"].map((item, index) => (
              <div key={index} className="flex items-center gap-2 bg-green-500/10 px-5 py-2.5 rounded-full border border-green-500/40">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-white font-black text-sm uppercase tracking-wide">{item}</span>
              </div>
            ))}
          </div>

          <a href={paymentLink} target="_blank" rel="noopener noreferrer">
            <Button 
              size="lg" 
              className="bg-green-500 hover:bg-green-400 text-black font-black text-xl px-16 py-8 rounded-2xl shadow-2xl shadow-green-500/40 transform hover:scale-105 transition-all duration-300 uppercase tracking-wide"
            >
              QUERO MINHA ÁREA DE MEMBROS
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-black border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-2xl font-black mb-4 tracking-tight">acessar<span className="text-green-400">.click</span></p>
          <p className="text-white/40 font-semibold text-sm">
            © 2024 Acessar.click — Todos os direitos reservados
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;