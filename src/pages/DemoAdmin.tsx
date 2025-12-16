import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { 
  Plus, Trash2, Eye, LogOut, Video, Bell, 
  Settings, LayoutDashboard, Play, HelpCircle,
  Users, CheckCircle, Clock, DollarSign, AlertCircle,
  BookOpen, Upload, Link as LinkIcon, Image
} from "lucide-react";

interface DemoModule {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  lessons: DemoLesson[];
}

interface DemoLesson {
  id: string;
  title: string;
  videoUrl: string;
  duration: string;
}

interface DemoSettings {
  siteName: string;
  primaryColor: string;
  logoUrl: string;
}

interface DemoNotice {
  id: string;
  title: string;
  message: string;
  type: "once" | "always" | "per_access";
  active: boolean;
}

interface DemoClient {
  id: string;
  name: string;
  email: string;
  status: "approved" | "pending" | "waiting_payment";
  createdAt: string;
}

const DemoAdmin = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState<DemoModule[]>([]);
  const [settings, setSettings] = useState<DemoSettings>({
    siteName: "Minha Área de Membros",
    primaryColor: "#00D26A",
    logoUrl: ""
  });
  const [notices, setNotices] = useState<DemoNotice[]>([]);
  const [clients, setClients] = useState<DemoClient[]>([
    { id: "1", name: "Maria Silva", email: "maria@email.com", status: "approved", createdAt: "2024-01-15" },
    { id: "2", name: "João Santos", email: "joao@email.com", status: "approved", createdAt: "2024-01-14" },
    { id: "3", name: "Ana Costa", email: "ana@email.com", status: "pending", createdAt: "2024-01-16" },
    { id: "4", name: "Pedro Lima", email: "pedro@email.com", status: "waiting_payment", createdAt: "2024-01-16" },
    { id: "5", name: "Carla Souza", email: "carla@email.com", status: "approved", createdAt: "2024-01-13" },
  ]);

  // Form states
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newModuleDescription, setNewModuleDescription] = useState("");
  const [newModuleCover, setNewModuleCover] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonVideo, setNewLessonVideo] = useState("");
  const [newLessonDuration, setNewLessonDuration] = useState("");
  
  // Notice form
  const [newNoticeTitle, setNewNoticeTitle] = useState("");
  const [newNoticeMessage, setNewNoticeMessage] = useState("");
  const [newNoticeType, setNewNoticeType] = useState<"once" | "always" | "per_access">("once");

  useEffect(() => {
    const isAuth = localStorage.getItem("demo_authenticated");
    if (!isAuth) {
      navigate("/demonstracao");
      return;
    }

    const savedModules = localStorage.getItem("demo_modules");
    const savedSettings = localStorage.getItem("demo_settings");
    const savedNotices = localStorage.getItem("demo_notices");
    
    if (savedModules) setModules(JSON.parse(savedModules));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedNotices) setNotices(JSON.parse(savedNotices));
  }, [navigate]);

  const saveToLocal = (newModules: DemoModule[], newSettings?: DemoSettings) => {
    localStorage.setItem("demo_modules", JSON.stringify(newModules));
    if (newSettings) {
      localStorage.setItem("demo_settings", JSON.stringify(newSettings));
    }
  };

  const saveNotices = (newNotices: DemoNotice[]) => {
    localStorage.setItem("demo_notices", JSON.stringify(newNotices));
    setNotices(newNotices);
  };

  const handleAddModule = () => {
    if (!newModuleTitle.trim()) {
      toast.error("Digite o título do módulo");
      return;
    }

    const newModule: DemoModule = {
      id: Date.now().toString(),
      title: newModuleTitle,
      description: newModuleDescription,
      coverUrl: newModuleCover || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
      lessons: []
    };

    const updatedModules = [...modules, newModule];
    setModules(updatedModules);
    saveToLocal(updatedModules);
    
    setNewModuleTitle("");
    setNewModuleDescription("");
    setNewModuleCover("");
    toast.success("Módulo adicionado!");
  };

  const handleDeleteModule = (moduleId: string) => {
    const updatedModules = modules.filter(m => m.id !== moduleId);
    setModules(updatedModules);
    saveToLocal(updatedModules);
    toast.success("Módulo removido!");
  };

  const handleAddLesson = () => {
    if (!selectedModuleId || !newLessonTitle.trim()) {
      toast.error("Selecione um módulo e digite o título da aula");
      return;
    }

    const newLesson: DemoLesson = {
      id: Date.now().toString(),
      title: newLessonTitle,
      videoUrl: newLessonVideo || "https://www.youtube.com/embed/dQw4w9WgXcQ",
      duration: newLessonDuration || "10:00"
    };

    const updatedModules = modules.map(m => {
      if (m.id === selectedModuleId) {
        return { ...m, lessons: [...m.lessons, newLesson] };
      }
      return m;
    });

    setModules(updatedModules);
    saveToLocal(updatedModules);
    
    setNewLessonTitle("");
    setNewLessonVideo("");
    setNewLessonDuration("");
    toast.success("Aula adicionada!");
  };

  const handleDeleteLesson = (moduleId: string, lessonId: string) => {
    const updatedModules = modules.map(m => {
      if (m.id === moduleId) {
        return { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) };
      }
      return m;
    });

    setModules(updatedModules);
    saveToLocal(updatedModules);
    toast.success("Aula removida!");
  };

  const handleAddNotice = () => {
    if (!newNoticeTitle.trim() || !newNoticeMessage.trim()) {
      toast.error("Preencha título e mensagem do aviso");
      return;
    }

    const newNotice: DemoNotice = {
      id: Date.now().toString(),
      title: newNoticeTitle,
      message: newNoticeMessage,
      type: newNoticeType,
      active: true
    };

    saveNotices([...notices, newNotice]);
    setNewNoticeTitle("");
    setNewNoticeMessage("");
    toast.success("Aviso criado!");
  };

  const handleToggleNotice = (noticeId: string) => {
    const updatedNotices = notices.map(n => 
      n.id === noticeId ? { ...n, active: !n.active } : n
    );
    saveNotices(updatedNotices);
  };

  const handleDeleteNotice = (noticeId: string) => {
    saveNotices(notices.filter(n => n.id !== noticeId));
    toast.success("Aviso removido!");
  };

  const handleSaveSettings = () => {
    saveToLocal(modules, settings);
    toast.success("Configurações salvas!");
  };

  const handleLogout = () => {
    localStorage.removeItem("demo_authenticated");
    navigate("/demonstracao");
  };

  const handlePreview = () => {
    navigate("/demonstracao/membro");
  };

  const approvedCount = clients.filter(c => c.status === "approved").length;
  const pendingCount = clients.filter(c => c.status === "pending").length;
  const waitingPaymentCount = clients.filter(c => c.status === "waiting_payment").length;

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-6 h-6 text-[#00D26A]" />
            <h1 className="text-xl font-black text-white">Painel Admin - Demonstração</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handlePreview} variant="outline" className="border-[#00D26A] text-[#00D26A] hover:bg-[#00D26A]/10">
              <Eye className="w-4 h-4 mr-2" />
              Visualizar
            </Button>
            <Button onClick={handleLogout} variant="ghost" className="text-zinc-400 hover:text-white">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
          <p className="text-yellow-400 text-sm">
            <strong>Modo Demonstração:</strong> Os dados são salvos apenas no seu navegador. 
            Explore todas as funcionalidades para ver como seria seu painel admin.
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-zinc-900 border border-zinc-800 flex-wrap h-auto p-1">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-[#00D26A] data-[state=active]:text-black">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="modules" className="data-[state=active]:bg-[#00D26A] data-[state=active]:text-black">
              <Video className="w-4 h-4 mr-2" />
              Módulos
            </TabsTrigger>
            <TabsTrigger value="lessons" className="data-[state=active]:bg-[#00D26A] data-[state=active]:text-black">
              <Play className="w-4 h-4 mr-2" />
              Aulas
            </TabsTrigger>
            <TabsTrigger value="notices" className="data-[state=active]:bg-[#00D26A] data-[state=active]:text-black">
              <Bell className="w-4 h-4 mr-2" />
              Avisos
            </TabsTrigger>
            <TabsTrigger value="clients" className="data-[state=active]:bg-[#00D26A] data-[state=active]:text-black">
              <Users className="w-4 h-4 mr-2" />
              Clientes
            </TabsTrigger>
            <TabsTrigger value="tutorial" className="data-[state=active]:bg-[#00D26A] data-[state=active]:text-black">
              <HelpCircle className="w-4 h-4 mr-2" />
              Tutorial
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-[#00D26A] data-[state=active]:text-black">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-zinc-500 text-sm">Clientes Aprovados</p>
                      <p className="text-3xl font-black text-[#00D26A]">{approvedCount}</p>
                    </div>
                    <CheckCircle className="w-10 h-10 text-[#00D26A]/30" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-zinc-500 text-sm">Aguardando Pagamento</p>
                      <p className="text-3xl font-black text-yellow-400">{waitingPaymentCount}</p>
                    </div>
                    <Clock className="w-10 h-10 text-yellow-400/30" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-zinc-500 text-sm">Pendentes</p>
                      <p className="text-3xl font-black text-orange-400">{pendingCount}</p>
                    </div>
                    <AlertCircle className="w-10 h-10 text-orange-400/30" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-zinc-500 text-sm">Receita Total</p>
                      <p className="text-3xl font-black text-white">R$ {(approvedCount * 97).toLocaleString()}</p>
                    </div>
                    <DollarSign className="w-10 h-10 text-white/30" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">Últimos Clientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {clients.slice(0, 5).map((client) => (
                      <div key={client.id} className="flex items-center justify-between bg-zinc-800 rounded-lg p-3">
                        <div>
                          <p className="text-white font-medium">{client.name}</p>
                          <p className="text-zinc-500 text-sm">{client.email}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          client.status === "approved" ? "bg-[#00D26A]/20 text-[#00D26A]" :
                          client.status === "waiting_payment" ? "bg-yellow-400/20 text-yellow-400" :
                          "bg-orange-400/20 text-orange-400"
                        }`}>
                          {client.status === "approved" ? "Aprovado" :
                           client.status === "waiting_payment" ? "Aguardando" : "Pendente"}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">Resumo do Conteúdo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-zinc-800 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <Video className="w-6 h-6 text-[#00D26A]" />
                        <span className="text-white">Módulos</span>
                      </div>
                      <span className="text-2xl font-black text-white">{modules.length}</span>
                    </div>
                    <div className="flex items-center justify-between bg-zinc-800 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <Play className="w-6 h-6 text-[#00D26A]" />
                        <span className="text-white">Total de Aulas</span>
                      </div>
                      <span className="text-2xl font-black text-white">
                        {modules.reduce((acc, m) => acc + m.lessons.length, 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-zinc-800 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <Bell className="w-6 h-6 text-[#00D26A]" />
                        <span className="text-white">Avisos Ativos</span>
                      </div>
                      <span className="text-2xl font-black text-white">
                        {notices.filter(n => n.active).length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Módulos Tab */}
          <TabsContent value="modules" className="space-y-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#00D26A]" />
                  Adicionar Módulo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-zinc-300">Título do Módulo</Label>
                    <Input
                      value={newModuleTitle}
                      onChange={(e) => setNewModuleTitle(e.target.value)}
                      placeholder="Ex: Módulo 1 - Introdução"
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-300">URL da Capa (opcional)</Label>
                    <Input
                      value={newModuleCover}
                      onChange={(e) => setNewModuleCover(e.target.value)}
                      placeholder="https://exemplo.com/imagem.jpg"
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Descrição (opcional)</Label>
                  <Input
                    value={newModuleDescription}
                    onChange={(e) => setNewModuleDescription(e.target.value)}
                    placeholder="Descrição do módulo..."
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <Button onClick={handleAddModule} className="bg-[#00D26A] hover:bg-[#00D26A]/90 text-black font-bold">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Módulo
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-white font-bold">Módulos Criados ({modules.length})</h3>
              {modules.length === 0 ? (
                <Card className="bg-zinc-900 border-zinc-800 p-8 text-center">
                  <p className="text-zinc-500">Nenhum módulo criado ainda. Adicione seu primeiro módulo acima.</p>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {modules.map((module) => (
                    <Card key={module.id} className="bg-zinc-900 border-zinc-800 overflow-hidden">
                      <div className="aspect-video bg-zinc-800 relative">
                        <img 
                          src={module.coverUrl} 
                          alt={module.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400";
                          }}
                        />
                        <div className="absolute top-2 right-2">
                          <Button 
                            onClick={() => handleDeleteModule(module.id)}
                            size="icon" 
                            variant="destructive"
                            className="h-8 w-8"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="text-white font-bold">{module.title}</h4>
                        <p className="text-zinc-500 text-sm">{module.description || "Sem descrição"}</p>
                        <p className="text-[#00D26A] text-sm mt-2">{module.lessons.length} aula(s)</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Aulas Tab */}
          <TabsContent value="lessons" className="space-y-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#00D26A]" />
                  Adicionar Aula
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Selecione o Módulo</Label>
                  <select
                    value={selectedModuleId || ""}
                    onChange={(e) => setSelectedModuleId(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-md p-2"
                  >
                    <option value="">Selecione um módulo...</option>
                    {modules.map((m) => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-zinc-300">Título da Aula</Label>
                    <Input
                      value={newLessonTitle}
                      onChange={(e) => setNewLessonTitle(e.target.value)}
                      placeholder="Ex: Aula 1 - Bem-vindo"
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-300">URL do Vídeo (YouTube Embed)</Label>
                    <Input
                      value={newLessonVideo}
                      onChange={(e) => setNewLessonVideo(e.target.value)}
                      placeholder="https://youtube.com/embed/..."
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-300">Duração</Label>
                    <Input
                      value={newLessonDuration}
                      onChange={(e) => setNewLessonDuration(e.target.value)}
                      placeholder="10:00"
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleAddLesson} 
                  disabled={!selectedModuleId}
                  className="bg-[#00D26A] hover:bg-[#00D26A]/90 text-black font-bold disabled:opacity-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Aula
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-white font-bold">Aulas por Módulo</h3>
              {modules.length === 0 ? (
                <Card className="bg-zinc-900 border-zinc-800 p-8 text-center">
                  <p className="text-zinc-500">Crie um módulo primeiro para adicionar aulas.</p>
                </Card>
              ) : (
                modules.map((module) => (
                  <Card key={module.id} className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">{module.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {module.lessons.length === 0 ? (
                        <p className="text-zinc-500 text-sm">Nenhuma aula neste módulo.</p>
                      ) : (
                        <div className="space-y-2">
                          {module.lessons.map((lesson, index) => (
                            <div key={lesson.id} className="flex items-center justify-between bg-zinc-800 rounded-lg p-3">
                              <div className="flex items-center gap-3">
                                <span className="text-[#00D26A] font-bold">{index + 1}</span>
                                <div>
                                  <p className="text-white">{lesson.title}</p>
                                  <p className="text-zinc-500 text-sm">{lesson.duration}</p>
                                </div>
                              </div>
                              <Button 
                                onClick={() => handleDeleteLesson(module.id, lesson.id)}
                                size="icon" 
                                variant="ghost"
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Avisos Tab */}
          <TabsContent value="notices" className="space-y-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#00D26A]" />
                  Criar Aviso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-zinc-300">Título do Aviso</Label>
                    <Input
                      value={newNoticeTitle}
                      onChange={(e) => setNewNoticeTitle(e.target.value)}
                      placeholder="Ex: Novidade importante!"
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-300">Tipo de Exibição</Label>
                    <select
                      value={newNoticeType}
                      onChange={(e) => setNewNoticeType(e.target.value as "once" | "always" | "per_access")}
                      className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-md p-2"
                    >
                      <option value="once">Exibir uma vez (usuário confirma e não aparece mais)</option>
                      <option value="always">Sempre visível (fixo no topo)</option>
                      <option value="per_access">A cada acesso (aparece toda vez que entrar)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Mensagem</Label>
                  <Textarea
                    value={newNoticeMessage}
                    onChange={(e) => setNewNoticeMessage(e.target.value)}
                    placeholder="Digite a mensagem do aviso..."
                    className="bg-zinc-800 border-zinc-700 text-white min-h-[100px]"
                  />
                </div>
                <Button onClick={handleAddNotice} className="bg-[#00D26A] hover:bg-[#00D26A]/90 text-black font-bold">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Aviso
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-white font-bold">Avisos Criados ({notices.length})</h3>
              {notices.length === 0 ? (
                <Card className="bg-zinc-900 border-zinc-800 p-8 text-center">
                  <p className="text-zinc-500">Nenhum aviso criado ainda.</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {notices.map((notice) => (
                    <Card key={notice.id} className={`bg-zinc-900 border-zinc-800 ${!notice.active ? "opacity-50" : ""}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-white font-bold">{notice.title}</h4>
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                notice.type === "once" ? "bg-blue-500/20 text-blue-400" :
                                notice.type === "always" ? "bg-purple-500/20 text-purple-400" :
                                "bg-orange-500/20 text-orange-400"
                              }`}>
                                {notice.type === "once" ? "Uma vez" :
                                 notice.type === "always" ? "Sempre" : "Cada acesso"}
                              </span>
                            </div>
                            <p className="text-zinc-400 text-sm">{notice.message}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                              <Label className="text-zinc-500 text-xs">Ativo</Label>
                              <Switch
                                checked={notice.active}
                                onCheckedChange={() => handleToggleNotice(notice.id)}
                              />
                            </div>
                            <Button 
                              onClick={() => handleDeleteNotice(notice.id)}
                              size="icon" 
                              variant="ghost"
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Clientes Tab */}
          <TabsContent value="clients" className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <Card className="bg-[#00D26A]/10 border-[#00D26A]/30">
                <CardContent className="p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-[#00D26A] mx-auto mb-2" />
                  <p className="text-2xl font-black text-[#00D26A]">{approvedCount}</p>
                  <p className="text-zinc-400 text-sm">Aprovados</p>
                </CardContent>
              </Card>
              <Card className="bg-yellow-400/10 border-yellow-400/30">
                <CardContent className="p-4 text-center">
                  <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-2xl font-black text-yellow-400">{waitingPaymentCount}</p>
                  <p className="text-zinc-400 text-sm">Aguardando Pagamento</p>
                </CardContent>
              </Card>
              <Card className="bg-orange-400/10 border-orange-400/30">
                <CardContent className="p-4 text-center">
                  <AlertCircle className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <p className="text-2xl font-black text-orange-400">{pendingCount}</p>
                  <p className="text-zinc-400 text-sm">Pendentes</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Lista de Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="text-left text-zinc-500 text-sm p-3">Nome</th>
                        <th className="text-left text-zinc-500 text-sm p-3">Email</th>
                        <th className="text-left text-zinc-500 text-sm p-3">Status</th>
                        <th className="text-left text-zinc-500 text-sm p-3">Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.map((client) => (
                        <tr key={client.id} className="border-b border-zinc-800/50">
                          <td className="p-3 text-white">{client.name}</td>
                          <td className="p-3 text-zinc-400">{client.email}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              client.status === "approved" ? "bg-[#00D26A]/20 text-[#00D26A]" :
                              client.status === "waiting_payment" ? "bg-yellow-400/20 text-yellow-400" :
                              "bg-orange-400/20 text-orange-400"
                            }`}>
                              {client.status === "approved" ? "Aprovado" :
                               client.status === "waiting_payment" ? "Aguardando" : "Pendente"}
                            </span>
                          </td>
                          <td className="p-3 text-zinc-500">{client.createdAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tutorial Tab */}
          <TabsContent value="tutorial" className="space-y-6">
            <Card className="bg-gradient-to-br from-[#00D26A]/20 to-zinc-900 border-[#00D26A]/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-[#00D26A]" />
                  Como usar sua Área de Membros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-300">
                  Aprenda a configurar e gerenciar todo o conteúdo da sua área de membros de forma simples e rápida.
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Como adicionar conteúdo */}
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Upload className="w-5 h-5 text-[#00D26A]" />
                    Como Adicionar Conteúdo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 bg-zinc-800 rounded-lg p-3">
                      <span className="w-6 h-6 rounded-full bg-[#00D26A] text-black flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                      <div>
                        <p className="text-white font-medium">Via Link (YouTube)</p>
                        <p className="text-zinc-400 text-sm">Cole o link embed do YouTube no campo de URL do vídeo. Ex: https://youtube.com/embed/VIDEO_ID</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-zinc-800 rounded-lg p-3">
                      <span className="w-6 h-6 rounded-full bg-[#00D26A] text-black flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                      <div>
                        <p className="text-white font-medium">Upload de Arquivo</p>
                        <p className="text-zinc-400 text-sm">Na versão completa, você pode fazer upload de vídeos MP4 diretamente para nossos servidores.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-zinc-800 rounded-lg p-3">
                      <span className="w-6 h-6 rounded-full bg-[#00D26A] text-black flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                      <div>
                        <p className="text-white font-medium">Vimeo/Outros</p>
                        <p className="text-zinc-400 text-sm">Use qualquer plataforma de vídeo que suporte embed (iframe).</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Como adicionar capas */}
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Image className="w-5 h-5 text-[#00D26A]" />
                    Como Adicionar Capas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 bg-zinc-800 rounded-lg p-3">
                      <span className="w-6 h-6 rounded-full bg-[#00D26A] text-black flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                      <div>
                        <p className="text-white font-medium">Via URL</p>
                        <p className="text-zinc-400 text-sm">Cole a URL da imagem de capa. Use Imgur, Cloudinary ou qualquer hospedagem de imagens.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-zinc-800 rounded-lg p-3">
                      <span className="w-6 h-6 rounded-full bg-[#00D26A] text-black flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                      <div>
                        <p className="text-white font-medium">Upload Direto</p>
                        <p className="text-zinc-400 text-sm">Na versão completa, faça upload de imagens JPG/PNG diretamente.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-zinc-800 rounded-lg p-3">
                      <span className="w-6 h-6 rounded-full bg-[#00D26A] text-black flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                      <div>
                        <p className="text-white font-medium">Tamanho Ideal</p>
                        <p className="text-zinc-400 text-sm">Use imagens 16:9 (1920x1080) para melhor visualização.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Estrutura de módulos */}
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Video className="w-5 h-5 text-[#00D26A]" />
                    Estrutura de Módulos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-zinc-800 rounded-lg p-4">
                    <p className="text-zinc-300 mb-3">Organize seu conteúdo em:</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2 text-zinc-400">
                        <CheckCircle className="w-4 h-4 text-[#00D26A]" />
                        <span><strong className="text-white">Módulos:</strong> Grupos de aulas relacionadas</span>
                      </li>
                      <li className="flex items-center gap-2 text-zinc-400">
                        <CheckCircle className="w-4 h-4 text-[#00D26A]" />
                        <span><strong className="text-white">Aulas:</strong> Vídeos individuais dentro dos módulos</span>
                      </li>
                      <li className="flex items-center gap-2 text-zinc-400">
                        <CheckCircle className="w-4 h-4 text-[#00D26A]" />
                        <span><strong className="text-white">Sem limite:</strong> Adicione quantos módulos e aulas quiser</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-[#00D26A]/10 border border-[#00D26A]/30 rounded-lg p-3">
                    <p className="text-[#00D26A] text-sm">
                      💡 <strong>Dica:</strong> Organize por níveis (Iniciante, Intermediário, Avançado) ou por temas específicos.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Dashboard de vendas */}
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <LayoutDashboard className="w-5 h-5 text-[#00D26A]" />
                    Dashboard de Vendas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-zinc-300 text-sm">No painel, você acompanha:</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 bg-zinc-800 rounded-lg p-3">
                      <CheckCircle className="w-5 h-5 text-[#00D26A]" />
                      <div>
                        <p className="text-white">Clientes Aprovados</p>
                        <p className="text-zinc-500 text-xs">Pagamento confirmado, acesso liberado</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-zinc-800 rounded-lg p-3">
                      <Clock className="w-5 h-5 text-yellow-400" />
                      <div>
                        <p className="text-white">Aguardando Pagamento</p>
                        <p className="text-zinc-500 text-xs">Cadastrou mas ainda não pagou</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-zinc-800 rounded-lg p-3">
                      <AlertCircle className="w-5 h-5 text-orange-400" />
                      <div>
                        <p className="text-white">Pendentes</p>
                        <p className="text-zinc-500 text-xs">Aguardando análise ou ação</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Avisos */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#00D26A]" />
                  Sistema de Avisos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <h4 className="text-blue-400 font-bold mb-2">Exibir Uma Vez</h4>
                    <p className="text-zinc-400 text-sm">O aviso aparece uma vez para cada usuário. Após confirmar a leitura, não aparece mais.</p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                    <h4 className="text-purple-400 font-bold mb-2">Sempre Visível</h4>
                    <p className="text-zinc-400 text-sm">Fica fixo no topo da área de membros, visível sempre para todos os usuários.</p>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                    <h4 className="text-orange-400 font-bold mb-2">A Cada Acesso</h4>
                    <p className="text-zinc-400 text-sm">Aparece toda vez que o usuário entra na área de membros, como um lembrete.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configurações Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#00D26A]" />
                  Configurações da Área de Membros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Nome do Site</Label>
                  <Input
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    placeholder="Minha Área de Membros"
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Cor Principal</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      className="w-16 h-10 p-1 bg-zinc-800 border-zinc-700"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      placeholder="#00D26A"
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">URL do Logo (opcional)</Label>
                  <Input
                    value={settings.logoUrl}
                    onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                    placeholder="https://exemplo.com/logo.png"
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <Button onClick={handleSaveSettings} className="bg-[#00D26A] hover:bg-[#00D26A]/90 text-black font-bold">
                  Salvar Configurações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DemoAdmin;
