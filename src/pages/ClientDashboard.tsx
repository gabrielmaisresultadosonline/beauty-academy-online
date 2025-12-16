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
import { Zap, CreditCard, LogOut, CheckCircle, Clock, ArrowRight, FileText, Send } from "lucide-react";
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
        setClientData(data);
        // Populate form if data exists
        if (data.product_name) setProductName(data.product_name);
        if (data.product_type) setProductType(data.product_type);
        if (data.product_description) setProductDescription(data.product_description);
        if (data.target_audience) setTargetAudience(data.target_audience);
        if (data.product_price) setProductPrice(String(data.product_price));
        if (data.infinitepay_username) setInfinitepayUsername(data.infinitepay_username);
        if (data.additional_notes) setAdditionalNotes(data.additional_notes);
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

  const handlePayment = () => {
    if (!clientData) return;
    
    const paymentLink = `https://checkout.infinitepay.io/paguemro?items=[{"name":"AREA%20DE%20MEMBROS%20-%20${encodeURIComponent(clientData.full_name)}","price":99700,"quantity":1}]&redirect_url=${encodeURIComponent(`${window.location.origin}/cliente/obrigado`)}`;
    window.open(paymentLink, '_blank');
  };

  const handleSaveSiteRequest = async () => {
    if (!clientData) return;

    if (!productName.trim() || !productType || !productDescription.trim() || !infinitepayUsername.trim()) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setSaving(true);

    try {
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
          site_status: 'pending'
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-400 font-bold">Carregando...</div>
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

        {/* Payment Status */}
        {!clientData?.is_paid ? (
          <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 border-2 border-green-500/50 mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 bg-green-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-10 h-10 text-green-400" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-black text-white mb-2">Ative sua Área de Membros</h2>
                  <p className="text-white/60 mb-4">
                    Pague R$997/ano e tenha sua página de vendas + área de membros completa em até 24h.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
                    <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-sm font-bold">
                      ✓ Vendas ilimitadas
                    </span>
                    <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-sm font-bold">
                      ✓ 0% taxa
                    </span>
                    <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-sm font-bold">
                      ✓ Receba em 8s
                    </span>
                  </div>
                  <Button
                    onClick={handlePayment}
                    className="bg-green-500 hover:bg-green-400 text-black font-black px-8 py-6 text-lg"
                  >
                    PAGAR R$997 E COMEÇAR
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-green-500/10 border border-green-500/30 mb-8">
            <CardContent className="p-6 flex items-center gap-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-green-400 font-bold">Pagamento Confirmado!</p>
                <p className="text-white/60 text-sm">
                  Pago em {clientData.paid_at ? new Date(clientData.paid_at).toLocaleDateString('pt-BR') : 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Site Request Form - Only show after payment */}
        {clientData?.is_paid && (
          <Card className="bg-zinc-900/50 border border-white/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-green-400" />
                <CardTitle className="text-white font-black text-xl">
                  Descreva seu Projeto
                </CardTitle>
              </div>
              <p className="text-white/50 text-sm">
                Preencha as informações abaixo para criarmos sua página de vendas e área de membros.
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
                  />
                </div>
                <div>
                  <Label className="text-white font-semibold">Tipo do Produto *</Label>
                  <Select value={productType} onValueChange={setProductType}>
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
                  />
                </div>
              </div>

              <div>
                <Label className="text-white font-semibold">Usuário InfinitePay *</Label>
                <Input
                  value={infinitepayUsername}
                  onChange={(e) => setInfinitepayUsername(e.target.value)}
                  placeholder="Seu @usuario da InfinitePay"
                  className="bg-black/50 border-white/20 text-white mt-1"
                />
                <p className="text-white/40 text-xs mt-1">
                  Necessário para configurar os pagamentos do seu produto.
                </p>
              </div>

              <div>
                <Label className="text-white font-semibold">Observações Adicionais</Label>
                <Textarea
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Algo mais que devemos saber? Cores preferidas, referências, etc."
                  className="bg-black/50 border-white/20 text-white mt-1 min-h-[80px]"
                />
              </div>

              <Button
                onClick={handleSaveSiteRequest}
                disabled={saving}
                className="w-full bg-green-500 hover:bg-green-400 text-black font-black py-6 text-lg"
              >
                {saving ? "Salvando..." : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    ENVIAR SOLICITAÇÃO
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ClientDashboard;