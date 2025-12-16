import { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Globe,
  TrendingUp,
  DollarSign,
  Percent,
  Building2,
  Palette,
  Headphones,
  FileText,
  Send,
  ChevronDown,
  Star,
  BadgeCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Fee comparison data (based on real platform fees)
const feeComparison = [
  { platform: 'acessar.click', fee: 0, withdrawal: 0, color: '#00D26A', highlight: true },
  { platform: 'Kiwify', fee: 8.99, withdrawal: 1.99, color: '#6366F1' },
  { platform: 'Hotmart', fee: 9.9, withdrawal: 1.99, color: '#F97316' },
  { platform: 'Eduzz', fee: 9.9, withdrawal: 3.99, color: '#3B82F6' },
  { platform: 'Monetizze', fee: 9.9, withdrawal: 2.99, color: '#8B5CF6' },
];

// Calculate earnings comparison
const calculateEarnings = (salesValue: number, salesCount: number) => {
  return feeComparison.map(platform => {
    const totalSales = salesValue * salesCount;
    const platformFee = (platform.fee / 100) * totalSales;
    const withdrawalFee = platform.withdrawal * salesCount;
    const annualFee = platform.platform === 'acessar.click' ? 497 : 0;
    const netEarnings = totalSales - platformFee - withdrawalFee - annualFee;
    return {
      ...platform,
      totalSales,
      platformFee,
      withdrawalFee,
      annualFee,
      netEarnings: Math.max(0, netEarnings)
    };
  });
};

const features = [
  {
    icon: Zap,
    title: "Receba em 8 Segundos",
    description: "Com Infinit Nitro, seu dinheiro cai na conta em até 8 segundos após a venda."
  },
  {
    icon: Percent,
    title: "Zero Taxas por Venda",
    description: "Taxa fixa anual. Venda R$1.000 ou R$1.000.000 — você recebe 100% de cada venda."
  },
  {
    icon: Palette,
    title: "Criamos Seu Site",
    description: "Desenvolvemos sua página de vendas profissional completa em até 24 horas."
  },
  {
    icon: Users,
    title: "Área de Membros",
    description: "Sistema completo com login, dashboard, módulos e controle de alunos."
  },
  {
    icon: BarChart3,
    title: "Facebook Pixel",
    description: "Configure seu pixel e rastreie todas as conversões automaticamente."
  },
  {
    icon: Shield,
    title: "100% Automatizado",
    description: "Pagamento libera acesso instantâneo. Zero trabalho manual para você."
  }
];

const steps = [
  { number: "1", title: "Faça seu Cadastro", description: "Preencha seus dados e realize o pagamento seguro via InfinitePay" },
  { number: "2", title: "Descreva seu Produto", description: "Conte-nos sobre seu curso, comunidade ou serviço — nós criamos tudo" },
  { number: "3", title: "Receba em 24h", description: "Sua área de membros + página de vendas prontas para faturar" },
  { number: "4", title: "Adicione Conteúdo", description: "Acesse o painel admin e adicione seus vídeos, materiais e módulos" },
];

const activeProducts = [
  { 
    name: "Beleza Liso Perfeito", 
    category: "Curso de Cabeleireira",
    link: "/belezalisoperfeito",
    gradient: "from-pink-500 to-rose-500"
  },
  { 
    name: "SpotMusic", 
    category: "Comunidade de Música",
    link: "/comunidademusica",
    gradient: "from-green-500 to-emerald-500"
  },
];

const PAYMENT_LINK = "https://checkout.infinitepay.io/paguemro?items=[{%22name%22:%22AREA%20DE%20MEMBROS%20ANUAL%22,%22price%22:49700,%22quantity%22:1}]&redirect_url=https://acessar.click/onboarding";

const Index = () => {
  const [salesValue] = useState(97);
  const [salesCount] = useState(100);
  const earnings = calculateEarnings(salesValue, salesCount);
  const ourEarnings = earnings[0].netEarnings;
  const kiwifyEarnings = earnings[1].netEarnings;
  const savings = ourEarnings - kiwifyEarnings;

  return (
    <div className="min-h-screen bg-zinc-950 font-body">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#00D26A]/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#00D26A]/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="h-full w-full" style={{
            backgroundImage: 'linear-gradient(rgba(0,210,106,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,210,106,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
          {/* Header */}
          <header className="flex justify-between items-center mb-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00D26A] rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-zinc-950" />
              </div>
              <span className="text-2xl font-bold text-white">
                acessar<span className="text-[#00D26A]">.</span>click
              </span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400 text-sm">
              <span>Powered by</span>
              <div className="flex items-center gap-1 text-[#00D26A] font-semibold">
                <CreditCard className="w-4 h-4" />
                InfinitePay
              </div>
            </div>
          </header>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#00D26A]/10 border border-[#00D26A]/30 rounded-full px-4 py-2">
                <BadgeCheck className="w-4 h-4 text-[#00D26A]" />
                <span className="text-sm text-[#00D26A] font-medium">Venda sem taxas • Receba na hora</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Sua <span className="text-[#00D26A]">Área de Membros</span> sem taxas por venda
              </h1>

              <p className="text-xl text-zinc-400 leading-relaxed">
                Receba <span className="text-white font-semibold">100% de cada venda</span> direto na sua conta InfinitePay. 
                Criamos seu site de vendas completo em até 24 horas.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a href={PAYMENT_LINK} target="_blank" rel="noopener noreferrer">
                  <Button 
                    size="lg" 
                    className="bg-[#00D26A] hover:bg-[#00D26A]/90 text-zinc-950 px-8 py-6 text-lg font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(0,210,106,0.3)]"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Criar Minha Área de Membros
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </a>
              </div>

              {/* Price Tag */}
              <div className="flex items-center gap-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                  <p className="text-zinc-500 text-sm">Plano Anual</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">R$497</span>
                    <span className="text-zinc-500">/ano</span>
                  </div>
                  <p className="text-[#00D26A] text-sm font-medium">12x R$41,42</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-[#00D26A]" />
                    <span className="text-sm">Site de vendas incluso</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-[#00D26A]" />
                    <span className="text-sm">Área de membros completa</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-[#00D26A]" />
                    <span className="text-sm">Zero taxas por venda</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - InfinitePay Card */}
            <div className="relative">
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
                {/* InfinitePay Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#00D26A] rounded-xl flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-zinc-950" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">InfinitePay</p>
                      <p className="text-[#00D26A] text-sm font-medium">Infinit Nitro</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-zinc-500 text-xs">Recebimento em</p>
                    <p className="text-[#00D26A] font-bold text-2xl">8s</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-zinc-800/50 rounded-xl p-4">
                    <p className="text-zinc-500 text-xs mb-1">Taxa por venda</p>
                    <p className="text-[#00D26A] font-bold text-2xl">0%</p>
                  </div>
                  <div className="bg-zinc-800/50 rounded-xl p-4">
                    <p className="text-zinc-500 text-xs mb-1">Taxa de saque</p>
                    <p className="text-[#00D26A] font-bold text-2xl">R$0</p>
                  </div>
                </div>

                {/* Comparison Highlight */}
                <div className="bg-[#00D26A]/10 border border-[#00D26A]/30 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-zinc-400 text-sm">Com {salesCount} vendas de R${salesValue}</p>
                      <p className="text-white font-bold text-xl">Você recebe R${ourEarnings.toLocaleString('pt-BR')}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-[#00D26A]" />
                  </div>
                  <p className="text-[#00D26A] text-sm mt-2">
                    +R${savings.toLocaleString('pt-BR')} a mais que na Kiwify
                  </p>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-[#00D26A] text-zinc-950 px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce">
                RECEBA NA HORA
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fee Comparison Section */}
      <section className="py-20 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Compare e <span className="text-[#00D26A]">economize milhares</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Veja quanto você perde em taxas nas outras plataformas. 
              Com acessar.click, cada centavo é seu.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden mb-12">
            <div className="grid grid-cols-5 gap-4 p-4 bg-zinc-800/50 text-center text-sm font-medium text-zinc-400">
              <div>Plataforma</div>
              <div>Taxa por Venda</div>
              <div>Taxa de Saque</div>
              <div>Você Recebe*</div>
              <div>Diferença</div>
            </div>
            {earnings.map((platform, index) => (
              <div 
                key={platform.platform}
                className={`grid grid-cols-5 gap-4 p-4 text-center items-center ${
                  platform.highlight ? 'bg-[#00D26A]/10 border-l-4 border-[#00D26A]' : 'border-b border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: platform.color }}
                  />
                  <span className={platform.highlight ? 'text-[#00D26A] font-bold' : 'text-white'}>
                    {platform.platform}
                  </span>
                  {platform.highlight && <BadgeCheck className="w-4 h-4 text-[#00D26A]" />}
                </div>
                <div className={platform.highlight ? 'text-[#00D26A] font-bold' : 'text-zinc-300'}>
                  {platform.fee}%
                </div>
                <div className={platform.highlight ? 'text-[#00D26A] font-bold' : 'text-zinc-300'}>
                  {platform.withdrawal > 0 ? `R$${platform.withdrawal}` : 'Grátis'}
                </div>
                <div className={platform.highlight ? 'text-[#00D26A] font-bold text-lg' : 'text-white'}>
                  R${platform.netEarnings.toLocaleString('pt-BR')}
                </div>
                <div className={platform.highlight ? 'text-[#00D26A] font-bold' : 'text-red-400'}>
                  {platform.highlight ? '+R$' + savings.toLocaleString('pt-BR') : '-R$' + (ourEarnings - platform.netEarnings).toLocaleString('pt-BR')}
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-zinc-500 text-sm">
            * Simulação com {salesCount} vendas de R${salesValue} cada. Taxa anual de R$497 já descontada.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Como <span className="text-[#00D26A]">funciona</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Nós criamos tudo para você. Página de vendas, área de membros, 
              integração de pagamento. Você só adiciona seu conteúdo.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-[#00D26A]/50 transition-all duration-300">
                  <div className="w-12 h-12 bg-[#00D26A] text-zinc-950 rounded-xl flex items-center justify-center text-xl font-bold mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-zinc-400 text-sm">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
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
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Tudo <span className="text-[#00D26A]">incluso</span> no seu plano
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-[#00D26A]/50 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-[#00D26A]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#00D26A]/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-[#00D26A]" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* InfinitePay Requirement */}
      <section className="py-20 bg-zinc-950">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-r from-[#00D26A]/10 to-transparent border border-[#00D26A]/30 rounded-3xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-20 h-20 bg-[#00D26A] rounded-2xl flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-10 h-10 text-zinc-950" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Você precisa ter uma conta InfinitePay
                </h3>
                <p className="text-zinc-400 mb-4">
                  Nossa área de membros se integra diretamente com a InfinitePay. 
                  Ao vender, o dinheiro cai direto na sua conta — sem intermediários, sem espera.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-[#00D26A]">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">Infinit Nitro: 8 segundos</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#00D26A]">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm font-medium">100% Seguro</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#00D26A]">
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Conta bancária inclusa</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Active Products */}
      <section className="py-20 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Produtos <span className="text-[#00D26A]">ativos</span> em nossa plataforma
            </h2>
            <p className="text-zinc-400">
              Veja exemplos reais funcionando agora mesmo
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {activeProducts.map((product, index) => (
              <Link 
                key={index}
                to={product.link}
                className="group"
              >
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-[#00D26A]/50 transition-all duration-300 hover:scale-105">
                  <div className={`w-12 h-12 bg-gradient-to-r ${product.gradient} rounded-xl flex items-center justify-center mb-4`}>
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1">{product.name}</h3>
                  <p className="text-zinc-500 text-sm mb-4">{product.category}</p>
                  <div className="flex items-center gap-2 text-[#00D26A] text-sm font-medium group-hover:gap-3 transition-all">
                    <span>Ver página</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-zinc-950">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-b from-[#00D26A]/20 to-transparent rounded-3xl p-12 border border-[#00D26A]/20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pronto para <span className="text-[#00D26A]">faturar sem taxas</span>?
            </h2>
            <p className="text-zinc-400 text-lg mb-8 max-w-2xl mx-auto">
              Nós criamos sua página de vendas e área de membros completa. 
              Você só adiciona seu conteúdo e começa a vender.
            </p>

            <a href={PAYMENT_LINK} target="_blank" rel="noopener noreferrer">
              <Button 
                size="lg" 
                className="bg-[#00D26A] hover:bg-[#00D26A]/90 text-zinc-950 px-12 py-6 text-xl font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-[0_0_60px_rgba(0,210,106,0.4)]"
              >
                <Zap className="w-6 h-6 mr-2" />
                Criar Minha Área de Membros
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </a>

            <div className="flex flex-wrap justify-center gap-6 mt-8 text-zinc-400 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00D26A]" />
                <span>Página de vendas inclusa</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00D26A]" />
                <span>Pronto em 24h</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00D26A]" />
                <span>Suporte incluso</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
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
