import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Zap, CreditCard, LogOut, CheckCircle, Clock, ArrowRight, FileText, Send, AlertTriangle, Calendar, Lock, Edit } from "lucide-react";
import confetti from "canvas-confetti";

interface ClientData {
  id: string;
  full_name: string;
  email: string;
  whatsapp: string;
  is_paid: boolean;
  paid_at: string | null;
  product_name: string | null;
  product_type: string | null;
  product_description: string | null;
  target_audience: string | null;
  product_price: number | null;
  infinitepay_username: string | null;
  additional_notes: string | null;
  site_status: string;
  plan_type: string | null;
  plan_amount: number | null;
  trial_ends_at: string | null;
  subscription_ends_at: string | null;
  site_blocked: boolean | null;
  existing_site_url: string | null;
  site_description_count: number | null;
  phone_number: string | null;
  payment_link: string | null;
}

const ClientDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const navigate = useNavigate();

  // Form state for site request
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [infinitepayUsername, setInfinitepayUsername] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [existingSiteUrl, setExistingSiteUrl] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentLink, setPaymentLink] = useState("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/cliente/auth');
      } else {
        setTimeout(() => {
          fetchClientData(session.user.id);
        }, 0);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/cliente/auth');
      } else {
        fetchClientData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchClientData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('platform_clients')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      if (data) {
        setClientData(data as ClientData);
        // Populate form if data exists
        if (data.product_name) setProductName(data.product_name);
        if (data.product_type) setProductType(data.product_type);
        if (data.product_description) setProductDescription(data.product_description);
        if (data.target_audience) setTargetAudience(data.target_audience);
        if (data.product_price) setProductPrice(String(data.product_price));
        if (data.infinitepay_username) setInfinitepayUsername(data.infinitepay_username);
        if (data.additional_notes) setAdditionalNotes(data.additional_notes);
        if (data.existing_site_url) setExistingSiteUrl(data.existing_site_url);
        if (data.phone_number) setPhoneNumber(data.phone_number);
        if (data.payment_link) setPaymentLink(data.payment_link);
      }
    } catch (error) {
      console.error('Error fetching client data:', error);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // Check if trial has expired (needs annual payment)
  const isTrialExpired = () => {
    if (!clientData?.trial_ends_at) return false;
    return new Date() > new Date(clientData.trial_ends_at);
  };

  // Check if annual subscription has expired
  const isSubscriptionExpired = () => {
    if (!clientData?.subscription_ends_at) return false;
    return new Date() > new Date(clientData.subscription_ends_at);
  };

  // Check if can edit site description (max 2 times)
  const canEditDescription = () => {
    const count = clientData?.site_description_count || 0;
    return count < 2;
  };

  const getRemainingEdits = () => {
    const count = clientData?.site_description_count || 0;
    return 2 - count;
  };

  const handleTrialPayment = () => {
    if (!clientData) return;
    
    const paymentLink = `https://checkout.infinitepay.io/paguemro?items=[{"name":"AREA%20DE%20MEMBROS%2030%20DIAS%20-%20${encodeURIComponent(clientData.full_name)}","price":24700,"quantity":1}]&redirect_url=${encodeURIComponent(`${window.location.origin}/cliente/obrigado?plan=trial`)}`;
    window.open(paymentLink, '_blank');
  };

  const handleAnnualPayment = () => {
    if (!clientData) return;
    
    const paymentLink = `https://checkout.infinitepay.io/paguemro?items=[{"name":"AREA%20DE%20MEMBROS%20ANUAL%20-%20${encodeURIComponent(clientData.full_name)}","price":79700,"quantity":1}]&redirect_url=${encodeURIComponent(`${window.location.origin}/cliente/obrigado?plan=annual`)}`;
    window.open(paymentLink, '_blank');
  };

  const handleSaveSiteRequest = async () => {
    if (!clientData) return;

    if (!canEditDescription()) {
      toast.error("Você já utilizou suas 2 alterações permitidas");
      return;
    }

    if (!productName.trim() || !productType || !productDescription.trim() || !infinitepayUsername.trim()) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setSaving(true);

    try {
      const currentCount = clientData.site_description_count || 0;
      
      const { error } = await supabase
        .from('platform_clients')
        .update({
          product_name: productName.trim(),
          product_type: productType,
          product_description: productDescription.trim(),
          target_audience: targetAudience.trim(),
          product_price: productPrice ? parseFloat(productPrice) : null,
          infinitepay_username: infinitepayUsername.trim(),
          additional_notes: additionalNotes.trim(),
          existing_site_url: existingSiteUrl.trim() || null,
          phone_number: phoneNumber.trim() || null,
          payment_link: paymentLink.trim() || null,
          site_status: 'pending',
          site_description_count: currentCount + 1
        })
        .eq('id', clientData.id);

      if (error) throw error;

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      toast.success("Solicitação enviada com sucesso! Entraremos em contato em breve.");
      
      // Refresh data
      const session = await supabase.auth.getSession();
      if (session.data.session) {
        fetchClientData(session.data.session.user.id);
      }
    } catch (error: any) {
      console.error('Error saving site request:', error);
      toast.error("Erro ao salvar solicitação");
    } finally {
      setSaving(false);
    }
  };

  const getDaysRemaining = (endDate: string | null) => {
    if (!endDate) return 0;
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-400 font-bold">Carregando...</div>
      </div>
    );
  }

  // Site is blocked - need payment
  if (clientData?.site_blocked) {
    return (
      <div className="min-h-screen bg-black">
        <header className="bg-zinc-900/50 border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-black text-white">acessar<span className="text-green-400">.click</span></span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-12">
          <Card className="bg-red-900/20 border-2 border-red-500/50">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-red-400" />
              </div>
              <h2 className="text-2xl font-black text-white mb-4">Acesso Bloqueado</h2>
              <p className="text-white/60 mb-6">
                Seu período de acesso expirou. Renove agora para manter seu site ativo e continuar vendendo.
              </p>
              <Button
                onClick={handleAnnualPayment}
                className="bg-green-500 hover:bg-green-400 text-black font-black px-8 py-6 text-lg"
              >
                RENOVAR POR R$797/ANO
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-zinc-900/50 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-black text-white">acessar<span className="text-green-400">.click</span></span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/60 text-sm hidden md:block">{clientData?.email}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-2">
            Olá, {clientData?.full_name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-white/60">
            {clientData?.is_paid 
              ? "Seu pagamento foi confirmado. Descreva seu projeto abaixo."
              : "Faça o pagamento para começarmos a criar sua área de membros."}
          </p>
        </div>

        {/* Payment Status - Not Paid Yet */}
        {!clientData?.is_paid ? (
          <div className="space-y-6 mb-8">
            <h2 className="text-xl font-black text-white">Escolha seu plano:</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* Plano Mensal */}
              <Card className="bg-zinc-900 border-2 border-[#00D26A] relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 bg-[#00D26A] py-2 text-center">
                  <span className="text-zinc-950 font-black text-xs tracking-wide uppercase">MENSAL</span>
                </div>
                <CardContent className="p-6 pt-12">
                  <div className="text-center mb-4">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-[#00D26A] text-lg font-black">R$</span>
                      <span className="text-4xl font-black text-white">247</span>
                      <span className="text-zinc-500 text-sm">/mês</span>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Check className="w-4 h-4 text-[#00D26A]" />
                      <span>Hospedagem do site</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Check className="w-4 h-4 text-[#00D26A]" />
                      <span>Página de vendas</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Check className="w-4 h-4 text-[#00D26A]" />
                      <span>Área de membros</span>
                    </div>
                  </div>
                  <Button onClick={handleTrialPayment} className="w-full bg-[#00D26A] hover:bg-[#00D26A]/90 text-black font-black">
                    ASSINAR MENSAL
                  </Button>
                </CardContent>
              </Card>

              {/* Plano Anual */}
              <Card className="bg-zinc-900 border border-yellow-500/50 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 bg-yellow-500 py-2 text-center">
                  <span className="text-zinc-950 font-black text-xs tracking-wide uppercase">⭐ ANUAL - ECONOMIA</span>
                </div>
                <CardContent className="p-6 pt-12">
                  <div className="text-center mb-4">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-yellow-400 text-sm font-bold">12x de</span>
                      <span className="text-yellow-400 text-lg font-black">R$</span>
                      <span className="text-4xl font-black text-white">81</span>
                    </div>
                    <p className="text-zinc-500 text-xs">ou R$797 à vista</p>
                  </div>
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Check className="w-4 h-4 text-yellow-400" />
                      <span>Tudo do mensal</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Check className="w-4 h-4 text-yellow-400" />
                      <span>Economia de R$2.167/ano</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Check className="w-4 h-4 text-yellow-400" />
                      <span>Suporte prioritário</span>
                    </div>
                  </div>
                  <Button onClick={handleAnnualPayment} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black">
                    ASSINAR ANUAL
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <>
            {/* Plan Status Card */}
            <Card className="bg-green-500/10 border border-green-500/30 mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                    <div>
                      <p className="text-green-400 font-bold">Pagamento Confirmado!</p>
                      <p className="text-white/60 text-sm">
                        Plano: {clientData?.plan_type === 'annual' ? 'Anual' : '30 Dias'}
                        {clientData?.paid_at && ` • Pago em ${new Date(clientData.paid_at).toLocaleDateString('pt-BR')}`}
                      </p>
                    </div>
                  </div>
                  
                  {/* Show renewal info */}
                  {clientData?.trial_ends_at && clientData?.plan_type === 'trial' && (
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-yellow-400">
                        <Calendar className="w-4 h-4" />
                        <span className="font-bold text-sm">
                          {getDaysRemaining(clientData.trial_ends_at)} dias restantes
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {clientData?.subscription_ends_at && clientData?.plan_type === 'annual' && (
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-green-400">
                        <Calendar className="w-4 h-4" />
                        <span className="font-bold text-sm">
                          Válido até {new Date(clientData.subscription_ends_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Warning if trial is about to expire */}
            {clientData?.plan_type === 'trial' && clientData?.trial_ends_at && getDaysRemaining(clientData.trial_ends_at) <= 7 && (
              <Card className="bg-yellow-900/20 border border-yellow-500/30 mb-6">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-yellow-400 font-bold text-sm">Seu período inicial está acabando!</p>
                      <p className="text-white/60 text-xs">
                        Renove por R$797/ano para manter seu site ativo e continuar vendendo.
                      </p>
                    </div>
                    <Button
                      onClick={handleAnnualPayment}
                      size="sm"
                      className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold"
                    >
                      Renovar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Site Request Form - Only show after payment */}
        {clientData?.is_paid && (
          <Card className="bg-zinc-900/50 border border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-green-400" />
                  <CardTitle className="text-white font-black text-xl">
                    Descreva seu Projeto
                  </CardTitle>
                </div>
                {clientData.site_description_count !== null && clientData.site_description_count > 0 && (
                  <div className="flex items-center gap-2 text-white/50 text-sm">
                    <Edit className="w-4 h-4" />
                    <span>{getRemainingEdits()} alteração(ões) restante(s)</span>
                  </div>
                )}
              </div>
              <p className="text-white/50 text-sm">
                Preencha as informações abaixo para criarmos sua página de vendas e área de membros.
                {!canEditDescription() && (
                  <span className="text-red-400 block mt-1">
                    Você já utilizou suas 2 alterações permitidas.
                  </span>
                )}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Badge */}
              {clientData.site_status && clientData.product_name && (
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                  clientData.site_status === 'completed' 
                    ? 'bg-green-500/10 text-green-400'
                    : clientData.site_status === 'in_progress'
                    ? 'bg-yellow-500/10 text-yellow-400'
                    : 'bg-blue-500/10 text-blue-400'
                }`}>
                  <Clock className="w-4 h-4" />
                  {clientData.site_status === 'completed' ? 'Site Pronto!' 
                    : clientData.site_status === 'in_progress' ? 'Em Produção'
                    : 'Aguardando Início'}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white font-semibold">Nome do Produto *</Label>
                  <Input
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Ex: Curso de Marketing Digital"
                    className="bg-black/50 border-white/20 text-white mt-1"
                    disabled={!canEditDescription()}
                  />
                </div>
                <div>
                  <Label className="text-white font-semibold">Tipo do Produto *</Label>
                  <Select value={productType} onValueChange={setProductType} disabled={!canEditDescription()}>
                    <SelectTrigger className="bg-black/50 border-white/20 text-white mt-1">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="curso">Curso Online</SelectItem>
                      <SelectItem value="comunidade">Comunidade/Assinatura</SelectItem>
                      <SelectItem value="ebook">E-book/Material Digital</SelectItem>
                      <SelectItem value="mentoria">Mentoria/Consultoria</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-white font-semibold">Descrição do Produto *</Label>
                <Textarea
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="Descreva seu produto em detalhes. O que ele oferece? Quais são os benefícios?"
                  className="bg-black/50 border-white/20 text-white mt-1 min-h-[100px]"
                  disabled={!canEditDescription()}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white font-semibold">Público-Alvo</Label>
                  <Input
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="Ex: Empreendedores iniciantes"
                    className="bg-black/50 border-white/20 text-white mt-1"
                    disabled={!canEditDescription()}
                  />
                </div>
                <div>
                  <Label className="text-white font-semibold">Preço de Venda (R$)</Label>
                  <Input
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    placeholder="Ex: 97"
                    className="bg-black/50 border-white/20 text-white mt-1"
                    disabled={!canEditDescription()}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white font-semibold">Usuário InfinitePay *</Label>
                  <Input
                    value={infinitepayUsername}
                    onChange={(e) => setInfinitepayUsername(e.target.value)}
                    placeholder="Seu @usuario da InfinitePay"
                    className="bg-black/50 border-white/20 text-white mt-1"
                    disabled={!canEditDescription()}
                  />
                  <p className="text-white/40 text-xs mt-1">
                    Necessário para configurar os pagamentos.
                  </p>
                </div>
                <div>
                  <Label className="text-white font-semibold">Telefone/WhatsApp</Label>
                  <Input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="bg-black/50 border-white/20 text-white mt-1"
                    disabled={!canEditDescription()}
                  />
                </div>
              </div>

              <div>
                <Label className="text-white font-semibold">Link do seu site atual (se tiver)</Label>
                <Input
                  value={existingSiteUrl}
                  onChange={(e) => setExistingSiteUrl(e.target.value)}
                  placeholder="https://seusite.com.br"
                  className="bg-black/50 border-white/20 text-white mt-1"
                  disabled={!canEditDescription()}
                />
                <p className="text-white/40 text-xs mt-1">
                  Se você já tem um site, usaremos como referência para criar um melhor.
                </p>
              </div>

              <div>
                <Label className="text-white font-semibold">Link de pagamento (se já tiver)</Label>
                <Input
                  value={paymentLink}
                  onChange={(e) => setPaymentLink(e.target.value)}
                  placeholder="https://checkout.infinitepay.io/seulink"
                  className="bg-black/50 border-white/20 text-white mt-1"
                  disabled={!canEditDescription()}
                />
              </div>

              <div>
                <Label className="text-white font-semibold">Observações Adicionais</Label>
                <Textarea
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Algo mais que devemos saber? Cores preferidas, referências, etc."
                  className="bg-black/50 border-white/20 text-white mt-1 min-h-[80px]"
                  disabled={!canEditDescription()}
                />
              </div>

              {canEditDescription() && (
                <Button
                  onClick={handleSaveSiteRequest}
                  disabled={saving}
                  className="w-full bg-green-500 hover:bg-green-400 text-black font-black py-6 text-lg"
                >
                  {saving ? "Salvando..." : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      {(clientData?.site_description_count || 0) === 0 ? 'ENVIAR SOLICITAÇÃO' : 'SALVAR ALTERAÇÃO'}
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ClientDashboard;