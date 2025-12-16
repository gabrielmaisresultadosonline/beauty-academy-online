import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Zap, LogOut, Users, CreditCard, Settings, BarChart3, 
  CheckCircle, Clock, AlertTriangle, Save, Eye, Calendar,
  DollarSign, TrendingUp
} from "lucide-react";

interface PlatformClient {
  id: string;
  full_name: string;
  email: string;
  whatsapp: string;
  is_paid: boolean;
  paid_at: string | null;
  plan_type: string | null;
  plan_amount: number | null;
  trial_ends_at: string | null;
  subscription_ends_at: string | null;
  site_blocked: boolean | null;
  site_status: string | null;
  product_name: string | null;
  created_at: string;
}

interface PlatformSettings {
  id?: string;
  product_slug: string;
  facebook_pixel_code: string | null;
  infinitepay_link: string | null;
  thank_you_url: string | null;
}

const ClientAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [clients, setClients] = useState<PlatformClient[]>([]);
  const [settings, setSettings] = useState<PlatformSettings>({
    product_slug: 'acessar-click',
    facebook_pixel_code: '',
    infinitepay_link: '',
    thank_you_url: ''
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate('/cliente/auth');
      return;
    }

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!roleData) {
      toast.error("Acesso negado");
      navigate('/cliente/dashboard');
      return;
    }

    setIsAdmin(true);
    await Promise.all([fetchClients(), fetchSettings()]);
    setLoading(false);
  };

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from('platform_clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching clients:', error);
      return;
    }

    setClients(data || []);
  };

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('platform_settings')
      .select('*')
      .eq('product_slug', 'acessar-click')
      .maybeSingle();

    if (data) {
      setSettings(data);
    }
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    
    try {
      const { data: existing } = await supabase
        .from('platform_settings')
        .select('id')
        .eq('product_slug', 'acessar-click')
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('platform_settings')
          .update({
            facebook_pixel_code: settings.facebook_pixel_code,
            infinitepay_link: settings.infinitepay_link,
            thank_you_url: settings.thank_you_url
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('platform_settings')
          .insert({
            product_slug: 'acessar-click',
            facebook_pixel_code: settings.facebook_pixel_code,
            infinitepay_link: settings.infinitepay_link,
            thank_you_url: settings.thank_you_url
          });

        if (error) throw error;
      }

      toast.success("Configurações salvas com sucesso!");
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error("Erro ao salvar configurações");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const toggleClientBlock = async (clientId: string, currentBlocked: boolean) => {
    const { error } = await supabase
      .from('platform_clients')
      .update({ site_blocked: !currentBlocked })
      .eq('id', clientId);

    if (error) {
      toast.error("Erro ao atualizar cliente");
      return;
    }

    toast.success(currentBlocked ? "Cliente desbloqueado" : "Cliente bloqueado");
    fetchClients();
  };

  const markAsPaid = async (clientId: string, planType: string) => {
    const now = new Date();
    const endDate = planType === 'annual' 
      ? new Date(now.setFullYear(now.getFullYear() + 1))
      : new Date(now.setMonth(now.getMonth() + 1));

    const { error } = await supabase
      .from('platform_clients')
      .update({ 
        is_paid: true, 
        paid_at: new Date().toISOString(),
        plan_type: planType,
        plan_amount: planType === 'annual' ? 797 : 247,
        subscription_ends_at: endDate.toISOString(),
        site_blocked: false
      })
      .eq('id', clientId);

    if (error) {
      toast.error("Erro ao marcar como pago");
      return;
    }

    toast.success("Cliente marcado como pago!");
    fetchClients();
  };

  // Statistics
  const totalClients = clients.length;
  const paidClients = clients.filter(c => c.is_paid).length;
  const pendingClients = clients.filter(c => !c.is_paid).length;
  const blockedClients = clients.filter(c => c.site_blocked).length;
  const annualClients = clients.filter(c => c.plan_type === 'annual').length;
  const monthlyClients = clients.filter(c => c.plan_type === 'trial' || c.plan_type === 'monthly').length;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (client: PlatformClient) => {
    if (client.site_blocked) {
      return <Badge variant="destructive">Bloqueado</Badge>;
    }
    if (client.is_paid) {
      return <Badge className="bg-green-500">Ativo</Badge>;
    }
    return <Badge variant="secondary">Pendente</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-400 font-bold">Carregando...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-zinc-900/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="text-xl font-black text-white">acessar<span className="text-green-400">.click</span></span>
              <span className="ml-2 text-sm text-green-400 font-medium">Admin Master</span>
            </div>
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

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-zinc-900 border border-white/10">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="clients" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
              <Users className="w-4 h-4 mr-2" />
              Clientes
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-zinc-900 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/60">Total Clientes</p>
                      <p className="text-3xl font-black text-white">{totalClients}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/60">Clientes Pagos</p>
                      <p className="text-3xl font-black text-green-400">{paidClients}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/60">Pendentes</p>
                      <p className="text-3xl font-black text-amber-400">{pendingClients}</p>
                    </div>
                    <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-amber-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/60">Bloqueados</p>
                      <p className="text-3xl font-black text-red-400">{blockedClients}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-zinc-900 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Planos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white/80">Planos Anuais</span>
                    <span className="text-xl font-bold text-green-400">{annualClients}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white/80">Planos Mensais</span>
                    <span className="text-xl font-bold text-amber-400">{monthlyClients}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    Receita Estimada
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white/80">Anuais (R$797)</span>
                    <span className="text-xl font-bold text-green-400">R$ {(annualClients * 797).toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white/80">Mensais (R$247)</span>
                    <span className="text-xl font-bold text-amber-400">R$ {(monthlyClients * 247).toLocaleString('pt-BR')}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Clients */}
            <Card className="bg-zinc-900 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Últimos Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {clients.slice(0, 5).map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="font-medium text-white">{client.full_name}</p>
                        <p className="text-sm text-white/60">{client.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(client)}
                        <span className="text-xs text-white/40">{formatDate(client.created_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients">
            <Card className="bg-zinc-900 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Todos os Clientes ({totalClients})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10">
                        <TableHead className="text-white/60">Nome</TableHead>
                        <TableHead className="text-white/60">Email</TableHead>
                        <TableHead className="text-white/60">WhatsApp</TableHead>
                        <TableHead className="text-white/60">Plano</TableHead>
                        <TableHead className="text-white/60">Status</TableHead>
                        <TableHead className="text-white/60">Expira</TableHead>
                        <TableHead className="text-white/60">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clients.map((client) => (
                        <TableRow key={client.id} className="border-white/10">
                          <TableCell className="text-white font-medium">{client.full_name}</TableCell>
                          <TableCell className="text-white/80">{client.email}</TableCell>
                          <TableCell className="text-white/80">{client.whatsapp}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-white/20 text-white/80">
                              {client.plan_type === 'annual' ? 'Anual' : client.plan_type === 'trial' ? 'Mensal' : 'Pendente'}
                            </Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(client)}</TableCell>
                          <TableCell className="text-white/60">{formatDate(client.subscription_ends_at)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {!client.is_paid && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => markAsPaid(client.id, 'trial')}
                                    className="border-amber-500/50 text-amber-400 hover:bg-amber-500/20 text-xs"
                                  >
                                    Mensal
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => markAsPaid(client.id, 'annual')}
                                    className="border-green-500/50 text-green-400 hover:bg-green-500/20 text-xs"
                                  >
                                    Anual
                                  </Button>
                                </>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toggleClientBlock(client.id, client.site_blocked || false)}
                                className={client.site_blocked 
                                  ? "border-green-500/50 text-green-400 hover:bg-green-500/20 text-xs"
                                  : "border-red-500/50 text-red-400 hover:bg-red-500/20 text-xs"
                                }
                              >
                                {client.site_blocked ? 'Desbloquear' : 'Bloquear'}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="bg-zinc-900 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-green-400" />
                  Configurações da Página Principal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="pixelCode" className="text-white">Código do Facebook Pixel</Label>
                  <Textarea
                    id="pixelCode"
                    placeholder="Cole aqui o código completo do seu Facebook Pixel..."
                    value={settings.facebook_pixel_code || ''}
                    onChange={(e) => setSettings({...settings, facebook_pixel_code: e.target.value})}
                    className="bg-black border-white/20 text-white min-h-[150px] font-mono text-sm"
                  />
                  <p className="text-xs text-white/40">
                    Cole o código completo do Pixel do Facebook (incluindo as tags script)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentLink" className="text-white">Link de Pagamento InfinitePay</Label>
                  <Input
                    id="paymentLink"
                    placeholder="https://checkout.infinitepay.io/..."
                    value={settings.infinitepay_link || ''}
                    onChange={(e) => setSettings({...settings, infinitepay_link: e.target.value})}
                    className="bg-black border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thankYouUrl" className="text-white">URL de Obrigado (após pagamento)</Label>
                  <Input
                    id="thankYouUrl"
                    placeholder="https://acessar.click/cliente/obrigado"
                    value={settings.thank_you_url || ''}
                    onChange={(e) => setSettings({...settings, thank_you_url: e.target.value})}
                    className="bg-black border-white/20 text-white"
                  />
                </div>

                <Button 
                  onClick={handleSaveSettings}
                  disabled={savingSettings}
                  className="bg-green-500 hover:bg-green-400 text-black font-bold"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {savingSettings ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ClientAdmin;
