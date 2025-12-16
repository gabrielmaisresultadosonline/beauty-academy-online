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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Zap, LogOut, Users, CreditCard, Settings, BarChart3, 
  CheckCircle, Clock, AlertTriangle, Save, Eye, Calendar,
  DollarSign, TrendingUp, FileText, Phone, Globe, Link2,
  X, RefreshCw, ExternalLink, Copy, Info, Edit
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
  product_type: string | null;
  product_description: string | null;
  target_audience: string | null;
  product_price: number | null;
  infinitepay_username: string | null;
  phone_number: string | null;
  existing_site_url: string | null;
  payment_link: string | null;
  additional_notes: string | null;
  site_description_count: number | null;
  site_url: string | null;
  admin_instructions: string | null;
  site_completed_at: string | null;
  created_at: string;
  updated_at: string;
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
  const [refreshing, setRefreshing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [clients, setClients] = useState<PlatformClient[]>([]);
  const [selectedClient, setSelectedClient] = useState<PlatformClient | null>(null);
  const [settings, setSettings] = useState<PlatformSettings>({
    product_slug: 'acessar-click',
    facebook_pixel_code: '',
    infinitepay_link: '',
    thank_you_url: ''
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [editingSiteInfo, setEditingSiteInfo] = useState(false);
  const [siteUrl, setSiteUrl] = useState("");
  const [adminInstructions, setAdminInstructions] = useState("");
  const [savingSiteInfo, setSavingSiteInfo] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      setSiteUrl(selectedClient.site_url || "");
      setAdminInstructions(selectedClient.admin_instructions || "");
      setEditingSiteInfo(false);
    }
  }, [selectedClient]);

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

  const refreshData = async () => {
    setRefreshing(true);
    await fetchClients();
    toast.success("Dados atualizados da nuvem!");
    setRefreshing(false);
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

      toast.success("Configurações salvas na nuvem!");
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

  const handleSaveSiteInfo = async () => {
    if (!selectedClient) return;
    
    setSavingSiteInfo(true);
    
    const { error } = await supabase
      .from('platform_clients')
      .update({
        site_url: siteUrl.trim() || null,
        admin_instructions: adminInstructions.trim() || null,
        site_status: siteUrl.trim() ? 'completed' : selectedClient.site_status,
        site_completed_at: siteUrl.trim() && !selectedClient.site_completed_at ? new Date().toISOString() : selectedClient.site_completed_at
      })
      .eq('id', selectedClient.id);
    
    if (error) {
      toast.error("Erro ao salvar informações");
      setSavingSiteInfo(false);
      return;
    }
    
    toast.success("Informações do site salvas!");
    setEditingSiteInfo(false);
    setSavingSiteInfo(false);
    fetchClients();
    setSelectedClient(null);
  };

  // Calculate days remaining
  const getDaysRemaining = (endDate: string | null) => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  // Statistics
  const totalClients = clients.length;
  const paidClients = clients.filter(c => c.is_paid).length;
  const pendingClients = clients.filter(c => !c.is_paid).length;
  const blockedClients = clients.filter(c => c.site_blocked).length;
  const annualClients = clients.filter(c => c.plan_type === 'annual').length;
  const monthlyClients = clients.filter(c => c.plan_type === 'trial' || c.plan_type === 'monthly').length;
  const clientsWithSiteRequest = clients.filter(c => c.product_name).length;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('pt-BR');
  };

  const getStatusBadge = (client: PlatformClient) => {
    if (client.site_blocked) {
      return <Badge variant="destructive">Bloqueado</Badge>;
    }
    if (client.is_paid) {
      const days = getDaysRemaining(client.subscription_ends_at);
      if (days !== null && days <= 7 && days > 0) {
        return <Badge className="bg-amber-500">Expira em {days}d</Badge>;
      }
      if (days !== null && days <= 0) {
        return <Badge variant="destructive">Expirado</Badge>;
      }
      return <Badge className="bg-green-500">Ativo</Badge>;
    }
    return <Badge variant="secondary">Pendente</Badge>;
  };

  const getSiteStatusBadge = (status: string | null) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-500">Aguardando</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500">Em Produção</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Concluído</Badge>;
      default:
        return <Badge variant="secondary">Não solicitado</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-green-400 animate-spin mx-auto mb-4" />
          <div className="text-green-400 font-bold">Carregando dados da nuvem...</div>
        </div>
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
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={refreshing}
              className="border-green-500/50 text-green-400 hover:bg-green-500/20"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
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
            <TabsTrigger value="requests" className="data-[state=active]:bg-green-500 data-[state=active]:text-black">
              <FileText className="w-4 h-4 mr-2" />
              Solicitações
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
                      <p className="text-sm text-white/60">Solicitações de Site</p>
                      <p className="text-3xl font-black text-purple-400">{clientsWithSiteRequest}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-purple-400" />
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
                    Planos Ativos
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
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white/80">Pendentes</span>
                    <span className="text-xl font-bold text-zinc-400">{pendingClients}</span>
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
                  <div className="flex justify-between items-center p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-xl font-bold text-green-400">R$ {((annualClients * 797) + (monthlyClients * 247)).toLocaleString('pt-BR')}</span>
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
                    <div 
                      key={client.id} 
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                      onClick={() => setSelectedClient(client)}
                    >
                      <div>
                        <p className="font-medium text-white">{client.full_name}</p>
                        <p className="text-sm text-white/60">{client.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(client)}
                        <span className="text-xs text-white/40">{formatDate(client.created_at)}</span>
                        <Eye className="w-4 h-4 text-white/40" />
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
                        <TableHead className="text-white/60">Contato</TableHead>
                        <TableHead className="text-white/60">Plano</TableHead>
                        <TableHead className="text-white/60">Status</TableHead>
                        <TableHead className="text-white/60">Dias Restantes</TableHead>
                        <TableHead className="text-white/60">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clients.map((client) => {
                        const daysRemaining = getDaysRemaining(client.subscription_ends_at);
                        return (
                          <TableRow key={client.id} className="border-white/10">
                            <TableCell>
                              <div>
                                <p className="text-white font-medium">{client.full_name}</p>
                                <p className="text-xs text-white/50">{client.email}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <p className="text-white/80 text-sm">{client.whatsapp}</p>
                                {client.phone_number && (
                                  <p className="text-white/50 text-xs">{client.phone_number}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="border-white/20 text-white/80">
                                {client.plan_type === 'annual' ? 'Anual' : client.plan_type === 'trial' ? 'Mensal' : 'Pendente'}
                              </Badge>
                            </TableCell>
                            <TableCell>{getStatusBadge(client)}</TableCell>
                            <TableCell>
                              {daysRemaining !== null ? (
                                <span className={`font-bold ${daysRemaining <= 7 ? 'text-red-400' : daysRemaining <= 30 ? 'text-amber-400' : 'text-green-400'}`}>
                                  {daysRemaining > 0 ? `${daysRemaining} dias` : 'Expirado'}
                                </span>
                              ) : (
                                <span className="text-white/40">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedClient(client)}
                                  className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
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
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Site Requests Tab */}
          <TabsContent value="requests">
            <Card className="bg-zinc-900 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Solicitações de Site ({clientsWithSiteRequest})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clients.filter(c => c.product_name).map((client) => (
                    <div 
                      key={client.id} 
                      className="bg-white/5 rounded-lg p-4 hover:bg-white/10 cursor-pointer transition-colors border border-white/10"
                      onClick={() => setSelectedClient(client)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-white font-bold text-lg">{client.product_name}</h3>
                          <p className="text-white/60 text-sm">Por: {client.full_name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getSiteStatusBadge(client.site_status)}
                          <Button size="sm" variant="outline" className="border-white/20">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-white/50">Tipo de Produto</p>
                          <p className="text-white">{client.product_type || '-'}</p>
                        </div>
                        <div>
                          <p className="text-white/50">Preço</p>
                          <p className="text-white">{client.product_price ? `R$ ${client.product_price}` : '-'}</p>
                        </div>
                        <div>
                          <p className="text-white/50">Edições</p>
                          <p className="text-white">{client.site_description_count || 0}/2 usadas</p>
                        </div>
                      </div>
                      {client.product_description && (
                        <div className="mt-3 p-3 bg-black/30 rounded border border-white/5">
                          <p className="text-white/50 text-xs mb-1">Descrição:</p>
                          <p className="text-white/80 text-sm line-clamp-2">{client.product_description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  {clientsWithSiteRequest === 0 && (
                    <div className="text-center py-12 text-white/40">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhuma solicitação de site ainda</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-6">
              {/* InfinitePay Config */}
              <Card className="bg-zinc-900 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-green-400" />
                    Configuração InfinitePay
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-2">
                      <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <p className="text-blue-200 text-sm">
                        Cole qualquer link do InfinitePay abaixo. O sistema extrai automaticamente o <strong>username</strong> e gera os links de pagamento.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="infinitepayLink" className="text-white">Link do InfinitePay (cole qualquer link)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="infinitepayLink"
                        placeholder="https://checkout.infinitepay.io/paguemro?items=..."
                        value={settings.infinitepay_link || ''}
                        onChange={(e) => {
                          const fullUrl = e.target.value;
                          let baseUrl = fullUrl;
                          if (fullUrl.includes('?')) {
                            baseUrl = fullUrl.split('?')[0];
                          }
                          setSettings({...settings, infinitepay_link: baseUrl});
                        }}
                        className="bg-black border-white/20 text-white flex-1 font-mono text-sm"
                      />
                      <Button 
                        onClick={handleSaveSettings}
                        disabled={savingSettings}
                        className="bg-green-500 hover:bg-green-400 text-black font-bold"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Salvar
                      </Button>
                    </div>
                    <p className="text-xs text-white/40">
                      Exemplo: https://checkout.infinitepay.io/paguemro?items=[...]
                    </p>
                  </div>

                  {settings.infinitepay_link && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 font-bold">Links Gerados Automaticamente</span>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white text-sm">Link Plano Mensal (R$247)</Label>
                        <div className="flex gap-2">
                          <Input
                            readOnly
                            value={`${settings.infinitepay_link}?items=[{"name":"Mensal","price":24700,"quantity":1}]&redirect_url=${window.location.origin}/cliente/obrigado`}
                            className="bg-black/50 border-white/10 text-white/80 font-mono text-xs flex-1"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              navigator.clipboard.writeText(`${settings.infinitepay_link}?items=[{"name":"Mensal","price":24700,"quantity":1}]&redirect_url=${window.location.origin}/cliente/obrigado`);
                              toast.success("Link copiado!");
                            }}
                            className="border-green-500/50 text-green-400 hover:bg-green-500/20"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white text-sm">Link Plano Anual (R$797)</Label>
                        <div className="flex gap-2">
                          <Input
                            readOnly
                            value={`${settings.infinitepay_link}?items=[{"name":"Anual","price":79700,"quantity":1}]&redirect_url=${window.location.origin}/cliente/obrigado`}
                            className="bg-black/50 border-white/10 text-white/80 font-mono text-xs flex-1"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              navigator.clipboard.writeText(`${settings.infinitepay_link}?items=[{"name":"Anual","price":79700,"quantity":1}]&redirect_url=${window.location.origin}/cliente/obrigado`);
                              toast.success("Link copiado!");
                            }}
                            className="border-green-500/50 text-green-400 hover:bg-green-500/20"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-white/50 text-xs mt-2">
                        URL única de obrigado: <code className="bg-black/30 px-1 rounded">/cliente/obrigado</code> - O sistema identifica o plano pelo valor pago.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Facebook Pixel */}
              <Card className="bg-zinc-900 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-green-400" />
                    Facebook Pixel
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pixelCode" className="text-white">Código do Facebook Pixel</Label>
                    <Textarea
                      id="pixelCode"
                      placeholder="Cole aqui o código completo do seu Facebook Pixel..."
                      value={settings.facebook_pixel_code || ''}
                      onChange={(e) => setSettings({...settings, facebook_pixel_code: e.target.value})}
                      className="bg-black border-white/20 text-white min-h-[150px] font-mono text-sm"
                    />
                  </div>

                  <Button 
                    onClick={handleSaveSettings}
                    disabled={savingSettings}
                    className="bg-green-500 hover:bg-green-400 text-black font-bold"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {savingSettings ? 'Salvando...' : 'Salvar Pixel'}
                  </Button>
                </CardContent>
              </Card>

              {/* URL Única */}
              <Card className="bg-zinc-900 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Link2 className="w-5 h-5 text-green-400" />
                    URL de Obrigado (única)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
                    <p className="text-green-200 text-sm">
                      O sistema identifica <strong>automaticamente</strong> o plano do cliente internamente. Use apenas esta URL única em todas as configurações.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">URL Única de Obrigado</Label>
                    <div className="flex gap-2">
                      <Input
                        readOnly
                        value={`${window.location.origin}/cliente/obrigado`}
                        className="bg-black/50 border-white/10 text-white font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/cliente/obrigado`);
                          toast.success("URL copiada!");
                        }}
                        className="border-green-500/50 text-green-400 hover:bg-green-500/20"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Client Detail Modal */}
      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <DialogContent className="bg-zinc-900 border-white/10 text-white max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-black flex items-center gap-2">
              <Users className="w-5 h-5 text-green-400" />
              Detalhes do Cliente
            </DialogTitle>
          </DialogHeader>
          
          {selectedClient && (
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-400" />
                    Informações Básicas
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-white/50 text-xs">Nome Completo</p>
                      <p className="text-white font-medium">{selectedClient.full_name}</p>
                    </div>
                    <div>
                      <p className="text-white/50 text-xs">Email</p>
                      <p className="text-white font-medium">{selectedClient.email}</p>
                    </div>
                    <div>
                      <p className="text-white/50 text-xs">WhatsApp</p>
                      <p className="text-white font-medium">{selectedClient.whatsapp}</p>
                    </div>
                    <div>
                      <p className="text-white/50 text-xs">Telefone</p>
                      <p className="text-white font-medium">{selectedClient.phone_number || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Subscription Info */}
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-green-400" />
                    Assinatura
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-white/50 text-xs">Status</p>
                      <div className="mt-1">{getStatusBadge(selectedClient)}</div>
                    </div>
                    <div>
                      <p className="text-white/50 text-xs">Plano</p>
                      <p className="text-white font-medium">
                        {selectedClient.plan_type === 'annual' ? 'Anual (R$797)' : 
                         selectedClient.plan_type === 'trial' ? 'Mensal (R$247)' : 'Não definido'}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/50 text-xs">Data do Pagamento</p>
                      <p className="text-white font-medium">{formatDateTime(selectedClient.paid_at)}</p>
                    </div>
                    <div>
                      <p className="text-white/50 text-xs">Expira em</p>
                      <p className="text-white font-medium">{formatDate(selectedClient.subscription_ends_at)}</p>
                    </div>
                    <div>
                      <p className="text-white/50 text-xs">Dias Restantes</p>
                      {(() => {
                        const days = getDaysRemaining(selectedClient.subscription_ends_at);
                        return days !== null ? (
                          <p className={`font-bold text-lg ${days <= 7 ? 'text-red-400' : days <= 30 ? 'text-amber-400' : 'text-green-400'}`}>
                            {days > 0 ? `${days} dias` : 'Expirado'}
                          </p>
                        ) : <p className="text-white/40">-</p>;
                      })()}
                    </div>
                    <div>
                      <p className="text-white/50 text-xs">Cadastro</p>
                      <p className="text-white font-medium">{formatDateTime(selectedClient.created_at)}</p>
                    </div>
                  </div>
                </div>

                {/* Site Request Info */}
                {selectedClient.product_name && (
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-green-400" />
                      Solicitação do Site
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-white/50 text-xs">Nome do Produto</p>
                          <p className="text-white font-medium">{selectedClient.product_name}</p>
                        </div>
                        <div>
                          <p className="text-white/50 text-xs">Tipo</p>
                          <p className="text-white font-medium">{selectedClient.product_type || '-'}</p>
                        </div>
                        <div>
                          <p className="text-white/50 text-xs">Preço do Produto</p>
                          <p className="text-white font-medium">
                            {selectedClient.product_price ? `R$ ${selectedClient.product_price}` : '-'}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/50 text-xs">Status do Site</p>
                          <div className="mt-1">{getSiteStatusBadge(selectedClient.site_status)}</div>
                        </div>
                        <div>
                          <p className="text-white/50 text-xs">Público-Alvo</p>
                          <p className="text-white font-medium">{selectedClient.target_audience || '-'}</p>
                        </div>
                        <div>
                          <p className="text-white/50 text-xs">Edições Usadas</p>
                          <p className="text-white font-medium">{selectedClient.site_description_count || 0}/2</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-white/50 text-xs mb-1">Descrição do Produto</p>
                        <div className="bg-black/30 p-3 rounded border border-white/5">
                          <p className="text-white/80 text-sm whitespace-pre-wrap">
                            {selectedClient.product_description || 'Não informado'}
                          </p>
                        </div>
                      </div>

                      {selectedClient.additional_notes && (
                        <div>
                          <p className="text-white/50 text-xs mb-1">Observações Adicionais</p>
                          <div className="bg-black/30 p-3 rounded border border-white/5">
                            <p className="text-white/80 text-sm whitespace-pre-wrap">
                              {selectedClient.additional_notes}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Integration Info */}
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-green-400" />
                    Integrações
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-white/50 text-xs">Usuário InfinitePay</p>
                      <p className="text-white font-medium">{selectedClient.infinitepay_username || '-'}</p>
                    </div>
                    {selectedClient.payment_link && (
                      <div>
                        <p className="text-white/50 text-xs">Link de Pagamento</p>
                        <a 
                          href={selectedClient.payment_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-green-400 hover:underline flex items-center gap-1 text-sm"
                        >
                          {selectedClient.payment_link}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                    {selectedClient.existing_site_url && (
                      <div>
                        <p className="text-white/50 text-xs">Site Existente</p>
                        <a 
                          href={selectedClient.existing_site_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-green-400 hover:underline flex items-center gap-1 text-sm"
                        >
                          {selectedClient.existing_site_url}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Site Pronto - Admin pode editar */}
                <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-bold flex items-center gap-2">
                      <Globe className="w-4 h-4 text-green-400" />
                      Site Pronto (Informações para o Cliente)
                    </h3>
                    {!editingSiteInfo && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingSiteInfo(true)}
                        className="border-green-500/50 text-green-400 hover:bg-green-500/20"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                    )}
                  </div>
                  
                  {editingSiteInfo ? (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-white text-sm">URL do Site Pronto</Label>
                        <Input
                          placeholder="https://exemplo.acessar.click"
                          value={siteUrl}
                          onChange={(e) => setSiteUrl(e.target.value)}
                          className="bg-black/50 border-white/20 text-white mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-white text-sm">Instruções para o Cliente</Label>
                        <Textarea
                          placeholder="Explique como o cliente deve acessar, usar a área de membros, onde encontrar os links, etc..."
                          value={adminInstructions}
                          onChange={(e) => setAdminInstructions(e.target.value)}
                          className="bg-black/50 border-white/20 text-white mt-1 min-h-[120px]"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveSiteInfo}
                          disabled={savingSiteInfo}
                          className="bg-green-500 hover:bg-green-400 text-black font-bold"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {savingSiteInfo ? 'Salvando...' : 'Salvar'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingSiteInfo(false);
                            setSiteUrl(selectedClient.site_url || "");
                            setAdminInstructions(selectedClient.admin_instructions || "");
                          }}
                          className="border-white/20 text-white"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <p className="text-white/50 text-xs">URL do Site</p>
                        {selectedClient.site_url ? (
                          <a 
                            href={selectedClient.site_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-green-400 hover:underline flex items-center gap-1"
                          >
                            {selectedClient.site_url}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <p className="text-white/40 italic">Ainda não configurado</p>
                        )}
                      </div>
                      <div>
                        <p className="text-white/50 text-xs">Instruções</p>
                        {selectedClient.admin_instructions ? (
                          <p className="text-white/80 text-sm whitespace-pre-wrap">{selectedClient.admin_instructions}</p>
                        ) : (
                          <p className="text-white/40 italic">Nenhuma instrução adicionada</p>
                        )}
                      </div>
                      {selectedClient.site_completed_at && (
                        <div>
                          <p className="text-white/50 text-xs">Site Concluído em</p>
                          <p className="text-green-400 font-medium">{formatDateTime(selectedClient.site_completed_at)}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-white/10">
                  {!selectedClient.is_paid && (
                    <>
                      <Button
                        onClick={() => {
                          markAsPaid(selectedClient.id, 'trial');
                          setSelectedClient(null);
                        }}
                        className="bg-amber-500 hover:bg-amber-400 text-black font-bold"
                      >
                        Ativar Mensal
                      </Button>
                      <Button
                        onClick={() => {
                          markAsPaid(selectedClient.id, 'annual');
                          setSelectedClient(null);
                        }}
                        className="bg-green-500 hover:bg-green-400 text-black font-bold"
                      >
                        Ativar Anual
                      </Button>
                    </>
                  )}
                  <Button
                    onClick={() => {
                      toggleClientBlock(selectedClient.id, selectedClient.site_blocked || false);
                      setSelectedClient(null);
                    }}
                    variant="outline"
                    className={selectedClient.site_blocked 
                      ? "border-green-500/50 text-green-400" 
                      : "border-red-500/50 text-red-400"
                    }
                  >
                    {selectedClient.site_blocked ? 'Desbloquear' : 'Bloquear'}
                  </Button>
                  <a 
                    href={`https://wa.me/${selectedClient.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="border-green-500/50 text-green-400">
                      <Phone className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientAdmin;
