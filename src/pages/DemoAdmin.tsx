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
  BookOpen, Upload, Link as LinkIcon, Image, Sparkles,
  Type, MousePointer, Crown, Palette
} from "lucide-react";

interface DemoModule {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  showPlayButton: boolean;
  showDescription: boolean;
  lessons: DemoLesson[];
}

interface DemoLesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  videoType: "youtube" | "file";
  coverUrl: string;
  showCover: boolean;
  showDescription: boolean;
  duration: string;
}

interface DemoButton {
  id: string;
  text: string;
  url: string;
  color: string;
  position: "before" | "after";
  moduleId: string;
}

interface DemoSettings {
  siteName: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  welcomeVideoUrl: string;
  welcomeVideoType: "youtube" | "file" | "none";
  welcomeTitle: string;
  welcomeText: string;
  showWelcomeSection: boolean;
  facebookPixelCode: string;
  infinitepayLink: string;
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
  const [buttons, setButtons] = useState<DemoButton[]>([]);
  const [settings, setSettings] = useState<DemoSettings>({
    siteName: "Minha Área de Membros",
    primaryColor: "#EC4899",
    secondaryColor: "#F59E0B",
    logoUrl: "",
    welcomeVideoUrl: "",
    welcomeVideoType: "none",
    welcomeTitle: "Bem-vindo(a) ao Curso!",
    welcomeText: "Estamos muito felizes em ter você aqui.",
    showWelcomeSection: true,
    facebookPixelCode: "",
    infinitepayLink: ""
  });
  const [notices, setNotices] = useState<DemoNotice[]>([]);
  const [clients] = useState<DemoClient[]>([
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
  const [newModuleShowPlay, setNewModuleShowPlay] = useState(true);
  const [newModuleShowDesc, setNewModuleShowDesc] = useState(true);
  
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonDescription, setNewLessonDescription] = useState("");
  const [newLessonVideo, setNewLessonVideo] = useState("");
  const [newLessonVideoType, setNewLessonVideoType] = useState<"youtube" | "file">("youtube");
  const [newLessonCover, setNewLessonCover] = useState("");
  const [newLessonShowCover, setNewLessonShowCover] = useState(true);
  const [newLessonShowDesc, setNewLessonShowDesc] = useState(true);
  const [newLessonDuration, setNewLessonDuration] = useState("");
  
  // Button form
  const [newButtonText, setNewButtonText] = useState("");
  const [newButtonUrl, setNewButtonUrl] = useState("");
  const [newButtonColor, setNewButtonColor] = useState("#EC4899");
  const [newButtonPosition, setNewButtonPosition] = useState<"before" | "after">("after");
  const [newButtonModuleId, setNewButtonModuleId] = useState("");
  
  // Notice form
  const [newNoticeTitle, setNewNoticeTitle] = useState("");
  const [newNoticeMessage, setNewNoticeMessage] = useState("");
  const [newNoticeType, setNewNoticeType] = useState<"once" | "always" | "per_access">("once");
  const [isUploading, setIsUploading] = useState(false);

  // File upload handler - converts to base64 for localStorage storage
  const handleFileUpload = (file: File, onSuccess: (dataUrl: string) => void, maxSizeMB: number = 50) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`Arquivo muito grande! Máximo ${maxSizeMB}MB`);
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onSuccess(result);
      setIsUploading(false);
      toast.success("Arquivo carregado com sucesso!");
    };
    reader.onerror = () => {
      toast.error("Erro ao carregar arquivo");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Default demo modules with marketing content
  const defaultDemoModules: DemoModule[] = [
    {
      id: "demo1",
      title: "Módulo 1 - Introdução ao Marketing Digital",
      description: "📌 DEMONSTRAÇÃO - Aqui você vai colocar seu conteúdo! Neste módulo você aprenderá os fundamentos do marketing.",
      coverUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      showPlayButton: true,
      showDescription: true,
      lessons: [
        { id: "l1-1", title: "Aula 1 - Bem-vindo ao Curso", description: "Conteúdo de teste - substitua pelo seu vídeo", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", videoType: "youtube", coverUrl: "", showCover: false, showDescription: true, duration: "10:00" },
        { id: "l1-2", title: "Aula 2 - O que é Marketing Digital", description: "Conteúdo de teste - substitua pelo seu vídeo", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", videoType: "youtube", coverUrl: "", showCover: false, showDescription: true, duration: "15:00" },
        { id: "l1-3", title: "Aula 3 - Primeiros Passos", description: "Conteúdo de teste - substitua pelo seu vídeo", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", videoType: "youtube", coverUrl: "", showCover: false, showDescription: true, duration: "12:00" },
      ]
    },
    {
      id: "demo2",
      title: "Módulo 2 - Redes Sociais",
      description: "📌 DEMONSTRAÇÃO - Este é um conteúdo de teste! Aprenda a dominar Instagram, Facebook, TikTok e mais.",
      coverUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
      showPlayButton: true,
      showDescription: true,
      lessons: [
        { id: "l2-1", title: "Aula 1 - Instagram para Negócios", description: "Conteúdo de teste", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", videoType: "youtube", coverUrl: "", showCover: false, showDescription: true, duration: "20:00" },
        { id: "l2-2", title: "Aula 2 - Facebook Ads", description: "Conteúdo de teste", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", videoType: "youtube", coverUrl: "", showCover: false, showDescription: true, duration: "25:00" },
      ]
    },
    {
      id: "demo3",
      title: "Módulo 3 - Copywriting",
      description: "📌 DEMONSTRAÇÃO - Substitua este texto pelo seu! Domine a arte de escrever textos que vendem.",
      coverUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
      showPlayButton: true,
      showDescription: true,
      lessons: [
        { id: "l3-1", title: "Aula 1 - Fundamentos do Copy", description: "Conteúdo de teste", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", videoType: "youtube", coverUrl: "", showCover: false, showDescription: true, duration: "18:00" },
        { id: "l3-2", title: "Aula 2 - Headlines que Convertem", description: "Conteúdo de teste", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", videoType: "youtube", coverUrl: "", showCover: false, showDescription: true, duration: "22:00" },
        { id: "l3-3", title: "Aula 3 - Gatilhos Mentais", description: "Conteúdo de teste", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", videoType: "youtube", coverUrl: "", showCover: false, showDescription: true, duration: "30:00" },
      ]
    },
    {
      id: "demo4",
      title: "Módulo 4 - Tráfego Pago",
      description: "📌 DEMONSTRAÇÃO - Coloque seu conteúdo aqui! Aprenda a criar anúncios que geram resultados.",
      coverUrl: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
      showPlayButton: true,
      showDescription: true,
      lessons: [
        { id: "l4-1", title: "Aula 1 - Google Ads Básico", description: "Conteúdo de teste", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", videoType: "youtube", coverUrl: "", showCover: false, showDescription: true, duration: "35:00" },
        { id: "l4-2", title: "Aula 2 - Meta Ads Avançado", description: "Conteúdo de teste", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", videoType: "youtube", coverUrl: "", showCover: false, showDescription: true, duration: "40:00" },
      ]
    },
    {
      id: "demo5",
      title: "Módulo 5 - Funis de Vendas",
      description: "📌 DEMONSTRAÇÃO - Este módulo é apenas exemplo! Construa funis que convertem visitantes em clientes.",
      coverUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      showPlayButton: true,
      showDescription: true,
      lessons: [
        { id: "l5-1", title: "Aula 1 - O que é um Funil", description: "Conteúdo de teste", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", videoType: "youtube", coverUrl: "", showCover: false, showDescription: true, duration: "15:00" },
        { id: "l5-2", title: "Aula 2 - Páginas de Captura", description: "Conteúdo de teste", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", videoType: "youtube", coverUrl: "", showCover: false, showDescription: true, duration: "28:00" },
        { id: "l5-3", title: "Aula 3 - Email Marketing", description: "Conteúdo de teste", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", videoType: "youtube", coverUrl: "", showCover: false, showDescription: true, duration: "25:00" },
      ]
    },
    {
      id: "demo6",
      title: "Módulo 6 - Bônus Exclusivos",
      description: "📌 DEMONSTRAÇÃO - Personalize com seu conteúdo! Material extra e recursos especiais para alunos.",
      coverUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80",
      showPlayButton: true,
      showDescription: true,
      lessons: [
        { id: "l6-1", title: "Bônus 1 - Templates Prontos", description: "Conteúdo de teste", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", videoType: "youtube", coverUrl: "", showCover: false, showDescription: true, duration: "10:00" },
        { id: "l6-2", title: "Bônus 2 - Ferramentas Gratuitas", description: "Conteúdo de teste", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", videoType: "youtube", coverUrl: "", showCover: false, showDescription: true, duration: "12:00" },
      ]
    },
  ];

  const defaultDemoButtons: DemoButton[] = [
    { id: "btn1", text: "📥 BAIXAR MATERIAL DE APOIO", url: "#", color: "#F59E0B", position: "after", moduleId: "demo1" },
    { id: "btn2", text: "💬 ENTRAR NO GRUPO VIP", url: "#", color: "#10B981", position: "after", moduleId: "demo3" },
  ];

  const defaultDemoNotices: DemoNotice[] = [
    { id: "notice1", title: "🎉 Bem-vindo à Demonstração!", message: "Esta é uma área de membros de exemplo. Você pode adicionar seus próprios módulos, aulas, botões e muito mais!", type: "once", active: true },
  ];

  useEffect(() => {
    const isAuth = localStorage.getItem("demo_authenticated");
    if (!isAuth) {
      navigate("/demonstracao");
      return;
    }

    const savedModules = localStorage.getItem("demo_modules");
    const savedSettings = localStorage.getItem("demo_settings");
    const savedNotices = localStorage.getItem("demo_notices");
    const savedButtons = localStorage.getItem("demo_buttons");
    
    // Load saved data or use defaults
    if (savedModules) {
      setModules(JSON.parse(savedModules));
    } else {
      setModules(defaultDemoModules);
      localStorage.setItem("demo_modules", JSON.stringify(defaultDemoModules));
    }
    
    if (savedSettings) {
      setSettings({ ...settings, ...JSON.parse(savedSettings) });
    }
    
    if (savedNotices) {
      setNotices(JSON.parse(savedNotices));
    } else {
      setNotices(defaultDemoNotices);
      localStorage.setItem("demo_notices", JSON.stringify(defaultDemoNotices));
    }
    
    if (savedButtons) {
      setButtons(JSON.parse(savedButtons));
    } else {
      setButtons(defaultDemoButtons);
      localStorage.setItem("demo_buttons", JSON.stringify(defaultDemoButtons));
    }
  }, [navigate]);

  const saveModules = (newModules: DemoModule[]) => {
    localStorage.setItem("demo_modules", JSON.stringify(newModules));
    setModules(newModules);
  };

  const saveSettings = (newSettings: DemoSettings) => {
    localStorage.setItem("demo_settings", JSON.stringify(newSettings));
    setSettings(newSettings);
  };

  const saveNotices = (newNotices: DemoNotice[]) => {
    localStorage.setItem("demo_notices", JSON.stringify(newNotices));
    setNotices(newNotices);
  };

  const saveButtons = (newButtons: DemoButton[]) => {
    localStorage.setItem("demo_buttons", JSON.stringify(newButtons));
    setButtons(newButtons);
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
      showPlayButton: newModuleShowPlay,
      showDescription: newModuleShowDesc,
      lessons: []
    };

    saveModules([...modules, newModule]);
    setNewModuleTitle("");
    setNewModuleDescription("");
    setNewModuleCover("");
    toast.success("Módulo adicionado!");
  };

  const handleDeleteModule = (moduleId: string) => {
    saveModules(modules.filter(m => m.id !== moduleId));
    saveButtons(buttons.filter(b => b.moduleId !== moduleId));
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
      description: newLessonDescription,
      videoUrl: newLessonVideo || "https://www.youtube.com/embed/dQw4w9WgXcQ",
      videoType: newLessonVideoType,
      coverUrl: newLessonCover,
      showCover: newLessonShowCover,
      showDescription: newLessonShowDesc,
      duration: newLessonDuration || "10:00"
    };

    const updatedModules = modules.map(m => {
      if (m.id === selectedModuleId) {
        return { ...m, lessons: [...m.lessons, newLesson] };
      }
      return m;
    });

    saveModules(updatedModules);
    setNewLessonTitle("");
    setNewLessonDescription("");
    setNewLessonVideo("");
    setNewLessonCover("");
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
    saveModules(updatedModules);
    toast.success("Aula removida!");
  };

  const handleAddButton = () => {
    if (!newButtonText.trim() || !newButtonModuleId) {
      toast.error("Preencha o texto e selecione o módulo");
      return;
    }

    const newButton: DemoButton = {
      id: Date.now().toString(),
      text: newButtonText,
      url: newButtonUrl,
      color: newButtonColor,
      position: newButtonPosition,
      moduleId: newButtonModuleId
    };

    saveButtons([...buttons, newButton]);
    setNewButtonText("");
    setNewButtonUrl("");
    toast.success("Botão adicionado!");
  };

  const handleDeleteButton = (buttonId: string) => {
    saveButtons(buttons.filter(b => b.id !== buttonId));
    toast.success("Botão removido!");
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
    saveSettings(settings);
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Header */}
      <header className="bg-white border-b border-pink-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900">Painel Admin</span>
              <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                DEMONSTRAÇÃO
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button onClick={handlePreview} className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-sm">
              <Eye className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Visualizar</span>
            </Button>
            <Button onClick={handleLogout} variant="ghost" className="text-gray-600">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Info Banner */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="font-bold text-amber-800">Modo Demonstração</h3>
            <p className="text-sm text-amber-700">Os dados são salvos no seu navegador. Explore todas as funcionalidades!</p>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-white border border-pink-100 shadow-sm flex-wrap h-auto p-1 gap-1">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white">
              <LayoutDashboard className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="modules" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white">
              <Video className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Módulos</span>
            </TabsTrigger>
            <TabsTrigger value="lessons" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white">
              <Play className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Aulas</span>
            </TabsTrigger>
            <TabsTrigger value="buttons" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white">
              <MousePointer className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Botões</span>
            </TabsTrigger>
            <TabsTrigger value="notices" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white">
              <Bell className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Avisos</span>
            </TabsTrigger>
            <TabsTrigger value="clients" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Clientes</span>
            </TabsTrigger>
            <TabsTrigger value="tutorial" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white">
              <HelpCircle className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Tutorial</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Config</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-white border-pink-100 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Clientes Aprovados</p>
                      <p className="text-3xl font-black text-pink-500">{approvedCount}</p>
                    </div>
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-pink-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-amber-100 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Aguardando Pagamento</p>
                      <p className="text-3xl font-black text-amber-500">{waitingPaymentCount}</p>
                    </div>
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-amber-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-orange-100 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Pendentes</p>
                      <p className="text-3xl font-black text-orange-500">{pendingCount}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-orange-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-green-100 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Receita Total</p>
                      <p className="text-3xl font-black text-green-500">R$ {(approvedCount * 97).toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-white border-pink-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Últimos Clientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {clients.slice(0, 5).map((client) => (
                      <div key={client.id} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                        <div>
                          <p className="text-gray-900 font-medium">{client.name}</p>
                          <p className="text-gray-500 text-sm">{client.email}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          client.status === "approved" ? "bg-pink-100 text-pink-600" :
                          client.status === "waiting_payment" ? "bg-amber-100 text-amber-600" :
                          "bg-orange-100 text-orange-600"
                        }`}>
                          {client.status === "approved" ? "Aprovado" :
                           client.status === "waiting_payment" ? "Aguardando" : "Pendente"}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-pink-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Resumo do Conteúdo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-pink-50 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <Video className="w-6 h-6 text-pink-500" />
                        <span className="text-gray-700">Módulos</span>
                      </div>
                      <span className="text-2xl font-black text-pink-500">{modules.length}</span>
                    </div>
                    <div className="flex items-center justify-between bg-rose-50 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <Play className="w-6 h-6 text-rose-500" />
                        <span className="text-gray-700">Total de Aulas</span>
                      </div>
                      <span className="text-2xl font-black text-rose-500">
                        {modules.reduce((acc, m) => acc + m.lessons.length, 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-amber-50 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <MousePointer className="w-6 h-6 text-amber-500" />
                        <span className="text-gray-700">Botões</span>
                      </div>
                      <span className="text-2xl font-black text-amber-500">{buttons.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Módulos Tab */}
          <TabsContent value="modules" className="space-y-6">
            <Card className="bg-white border-pink-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-pink-500" />
                  Adicionar Módulo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Título do Módulo *</Label>
                    <Input
                      value={newModuleTitle}
                      onChange={(e) => setNewModuleTitle(e.target.value)}
                      placeholder="Ex: Módulo 1 - Introdução"
                      className="border-pink-200 focus:border-pink-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Capa do Módulo</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newModuleCover}
                        onChange={(e) => setNewModuleCover(e.target.value)}
                        placeholder="Cole um link ou faça upload..."
                        className="border-pink-200 focus:border-pink-400 flex-1"
                      />
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, setNewModuleCover, 10);
                          }}
                        />
                        <Button type="button" variant="outline" className="border-pink-200 hover:bg-pink-50" disabled={isUploading}>
                          <Upload className="w-4 h-4" />
                        </Button>
                      </label>
                    </div>
                    {newModuleCover && (
                      <div className="mt-2 relative w-20 h-14 rounded overflow-hidden">
                        <img src={newModuleCover} alt="Preview" className="w-full h-full object-cover" />
                        <button onClick={() => setNewModuleCover("")} className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Descrição (opcional)</Label>
                  <Textarea
                    value={newModuleDescription}
                    onChange={(e) => setNewModuleDescription(e.target.value)}
                    placeholder="Descrição do módulo..."
                    className="border-pink-200 focus:border-pink-400"
                  />
                </div>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <Switch checked={newModuleShowPlay} onCheckedChange={setNewModuleShowPlay} />
                    <Label className="text-gray-600">Mostrar botão Play</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={newModuleShowDesc} onCheckedChange={setNewModuleShowDesc} />
                    <Label className="text-gray-600">Mostrar descrição</Label>
                  </div>
                </div>
                <Button onClick={handleAddModule} className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Módulo
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-gray-900 font-bold text-lg">Módulos Criados ({modules.length})</h3>
              {modules.length === 0 ? (
                <Card className="bg-white border-pink-100 p-8 text-center">
                  <Video className="w-12 h-12 text-pink-300 mx-auto mb-3" />
                  <p className="text-gray-500">Nenhum módulo criado ainda.</p>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {modules.map((module) => (
                    <Card key={module.id} className="bg-white border-pink-100 shadow-sm overflow-hidden group">
                      <div className="aspect-video bg-gradient-to-br from-pink-200 to-rose-300 relative">
                        {module.coverUrl && (
                          <img 
                            src={module.coverUrl} 
                            alt={module.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400";
                            }}
                          />
                        )}
                        {module.showPlayButton && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                              <Play className="w-6 h-6 text-pink-500 ml-1" />
                            </div>
                          </div>
                        )}
                        <Button 
                          onClick={() => handleDeleteModule(module.id)}
                          size="icon" 
                          variant="destructive"
                          className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="text-gray-900 font-bold">{module.title}</h4>
                        {module.showDescription && module.description && (
                          <p className="text-gray-500 text-sm mt-1">{module.description}</p>
                        )}
                        <p className="text-pink-500 text-sm mt-2 font-medium">{module.lessons.length} aula(s)</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Aulas Tab */}
          <TabsContent value="lessons" className="space-y-6">
            <Card className="bg-white border-pink-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-pink-500" />
                  Adicionar Aula
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Selecione o Módulo *</Label>
                    <select
                      value={selectedModuleId || ""}
                      onChange={(e) => setSelectedModuleId(e.target.value)}
                      className="w-full border border-pink-200 rounded-md p-2 focus:border-pink-400 focus:outline-none"
                    >
                      <option value="">Selecione um módulo...</option>
                      {modules.map((m) => (
                        <option key={m.id} value={m.id}>{m.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Título da Aula *</Label>
                    <Input
                      value={newLessonTitle}
                      onChange={(e) => setNewLessonTitle(e.target.value)}
                      placeholder="Ex: Aula 1 - Bem-vindo"
                      className="border-pink-200 focus:border-pink-400"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Tipo de Vídeo</Label>
                    <select
                      value={newLessonVideoType}
                      onChange={(e) => setNewLessonVideoType(e.target.value as "youtube" | "file")}
                      className="w-full border border-pink-200 rounded-md p-2 focus:border-pink-400 focus:outline-none"
                    >
                      <option value="youtube">Link do YouTube</option>
                      <option value="file">Upload de Arquivo (até 50MB)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">
                      {newLessonVideoType === "youtube" ? "URL do Vídeo (YouTube Embed)" : "Vídeo"}
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={newLessonVideo}
                        onChange={(e) => setNewLessonVideo(e.target.value)}
                        placeholder={newLessonVideoType === "youtube" ? "https://youtube.com/embed/..." : "Cole link ou faça upload"}
                        className="border-pink-200 focus:border-pink-400 flex-1"
                      />
                      {newLessonVideoType === "file" && (
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(file, setNewLessonVideo, 50);
                            }}
                          />
                          <Button type="button" variant="outline" className="border-pink-200 hover:bg-pink-50" disabled={isUploading}>
                            <Upload className="w-4 h-4" />
                          </Button>
                        </label>
                      )}
                    </div>
                    {newLessonVideo && newLessonVideoType === "file" && newLessonVideo.startsWith("data:") && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Vídeo carregado
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Capa da Aula (opcional)</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newLessonCover}
                        onChange={(e) => setNewLessonCover(e.target.value)}
                        placeholder="Link ou upload..."
                        className="border-pink-200 focus:border-pink-400 flex-1"
                      />
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, setNewLessonCover, 10);
                          }}
                        />
                        <Button type="button" variant="outline" className="border-pink-200 hover:bg-pink-50" disabled={isUploading}>
                          <Upload className="w-4 h-4" />
                        </Button>
                      </label>
                    </div>
                    {newLessonCover && (
                      <div className="mt-1 relative w-16 h-10 rounded overflow-hidden">
                        <img src={newLessonCover} alt="Preview" className="w-full h-full object-cover" />
                        <button onClick={() => setNewLessonCover("")} className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl">
                          <Trash2 className="w-2 h-2" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Duração</Label>
                    <Input
                      value={newLessonDuration}
                      onChange={(e) => setNewLessonDuration(e.target.value)}
                      placeholder="10:00"
                      className="border-pink-200 focus:border-pink-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Descrição</Label>
                    <Input
                      value={newLessonDescription}
                      onChange={(e) => setNewLessonDescription(e.target.value)}
                      placeholder="Descrição da aula..."
                      className="border-pink-200 focus:border-pink-400"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <Switch checked={newLessonShowCover} onCheckedChange={setNewLessonShowCover} />
                    <Label className="text-gray-600">Mostrar capa</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={newLessonShowDesc} onCheckedChange={setNewLessonShowDesc} />
                    <Label className="text-gray-600">Mostrar descrição</Label>
                  </div>
                </div>

                <Button 
                  onClick={handleAddLesson} 
                  disabled={!selectedModuleId}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold disabled:opacity-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Aula
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-gray-900 font-bold text-lg">Aulas por Módulo</h3>
              {modules.length === 0 ? (
                <Card className="bg-white border-pink-100 p-8 text-center">
                  <p className="text-gray-500">Crie um módulo primeiro para adicionar aulas.</p>
                </Card>
              ) : (
                modules.map((module) => (
                  <Card key={module.id} className="bg-white border-pink-100 shadow-sm">
                    <CardHeader className="border-b border-pink-50">
                      <CardTitle className="text-gray-900 text-lg">{module.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      {module.lessons.length === 0 ? (
                        <p className="text-gray-400 text-sm">Nenhuma aula neste módulo.</p>
                      ) : (
                        <div className="space-y-2">
                          {module.lessons.map((lesson, index) => (
                            <div key={lesson.id} className="flex items-center justify-between bg-pink-50 rounded-xl p-3">
                              <div className="flex items-center gap-3">
                                <span className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold">{index + 1}</span>
                                <div>
                                  <p className="text-gray-900 font-medium">{lesson.title}</p>
                                  <p className="text-gray-500 text-sm">{lesson.duration} • {lesson.videoType === "youtube" ? "YouTube" : "Arquivo"}</p>
                                </div>
                              </div>
                              <Button 
                                onClick={() => handleDeleteLesson(module.id, lesson.id)}
                                size="icon" 
                                variant="ghost"
                                className="text-red-400 hover:text-red-500 hover:bg-red-50"
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

          {/* Botões Tab */}
          <TabsContent value="buttons" className="space-y-6">
            <Card className="bg-white border-pink-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <MousePointer className="w-5 h-5 text-pink-500" />
                  Adicionar Botão entre Módulos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Texto do Botão *</Label>
                    <Input
                      value={newButtonText}
                      onChange={(e) => setNewButtonText(e.target.value)}
                      placeholder="Ex: Acessar Material Extra"
                      className="border-pink-200 focus:border-pink-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">URL do Link (opcional)</Label>
                    <Input
                      value={newButtonUrl}
                      onChange={(e) => setNewButtonUrl(e.target.value)}
                      placeholder="https://exemplo.com"
                      className="border-pink-200 focus:border-pink-400"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Módulo de Referência</Label>
                    <select
                      value={newButtonModuleId}
                      onChange={(e) => setNewButtonModuleId(e.target.value)}
                      className="w-full border border-pink-200 rounded-md p-2 focus:border-pink-400 focus:outline-none"
                    >
                      <option value="">Selecione...</option>
                      {modules.map((m) => (
                        <option key={m.id} value={m.id}>{m.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Posição</Label>
                    <select
                      value={newButtonPosition}
                      onChange={(e) => setNewButtonPosition(e.target.value as "before" | "after")}
                      className="w-full border border-pink-200 rounded-md p-2 focus:border-pink-400 focus:outline-none"
                    >
                      <option value="before">Antes do módulo</option>
                      <option value="after">Depois do módulo</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Cor do Botão</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={newButtonColor}
                        onChange={(e) => setNewButtonColor(e.target.value)}
                        className="w-14 h-10 p-1 border-pink-200"
                      />
                      <Input
                        value={newButtonColor}
                        onChange={(e) => setNewButtonColor(e.target.value)}
                        className="border-pink-200"
                      />
                    </div>
                  </div>
                </div>
                <Button onClick={handleAddButton} className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Botão
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-gray-900 font-bold text-lg">Botões Criados ({buttons.length})</h3>
              {buttons.length === 0 ? (
                <Card className="bg-white border-pink-100 p-8 text-center">
                  <MousePointer className="w-12 h-12 text-pink-300 mx-auto mb-3" />
                  <p className="text-gray-500">Nenhum botão criado ainda.</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {buttons.map((button) => {
                    const module = modules.find(m => m.id === button.moduleId);
                    return (
                      <Card key={button.id} className="bg-white border-pink-100 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div 
                              className="px-4 py-2 rounded-lg text-white font-bold text-sm"
                              style={{ backgroundColor: button.color }}
                            >
                              {button.text}
                            </div>
                            <div className="text-sm text-gray-500">
                              {button.position === "before" ? "Antes de" : "Depois de"}: {module?.title || "Módulo removido"}
                            </div>
                          </div>
                          <Button 
                            onClick={() => handleDeleteButton(button.id)}
                            size="icon" 
                            variant="ghost"
                            className="text-red-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Avisos Tab */}
          <TabsContent value="notices" className="space-y-6">
            <Card className="bg-white border-pink-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-pink-500" />
                  Criar Aviso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Título do Aviso</Label>
                    <Input
                      value={newNoticeTitle}
                      onChange={(e) => setNewNoticeTitle(e.target.value)}
                      placeholder="Ex: Novidade importante!"
                      className="border-pink-200 focus:border-pink-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Tipo de Exibição</Label>
                    <select
                      value={newNoticeType}
                      onChange={(e) => setNewNoticeType(e.target.value as "once" | "always" | "per_access")}
                      className="w-full border border-pink-200 rounded-md p-2 focus:border-pink-400 focus:outline-none"
                    >
                      <option value="once">Exibir uma vez (usuário confirma e não aparece mais)</option>
                      <option value="always">Sempre visível (fixo no topo)</option>
                      <option value="per_access">A cada acesso (aparece toda vez)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Mensagem</Label>
                  <Textarea
                    value={newNoticeMessage}
                    onChange={(e) => setNewNoticeMessage(e.target.value)}
                    placeholder="Digite a mensagem do aviso..."
                    className="border-pink-200 focus:border-pink-400 min-h-[100px]"
                  />
                </div>
                <Button onClick={handleAddNotice} className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Aviso
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-gray-900 font-bold text-lg">Avisos Criados ({notices.length})</h3>
              {notices.length === 0 ? (
                <Card className="bg-white border-pink-100 p-8 text-center">
                  <Bell className="w-12 h-12 text-pink-300 mx-auto mb-3" />
                  <p className="text-gray-500">Nenhum aviso criado ainda.</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {notices.map((notice) => (
                    <Card key={notice.id} className={`bg-white border-pink-100 ${!notice.active ? "opacity-50" : ""}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-gray-900 font-bold">{notice.title}</h4>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                notice.type === "once" ? "bg-blue-100 text-blue-600" :
                                notice.type === "always" ? "bg-purple-100 text-purple-600" :
                                "bg-orange-100 text-orange-600"
                              }`}>
                                {notice.type === "once" ? "Uma vez" :
                                 notice.type === "always" ? "Sempre" : "Cada acesso"}
                              </span>
                            </div>
                            <p className="text-gray-500 text-sm">{notice.message}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch checked={notice.active} onCheckedChange={() => handleToggleNotice(notice.id)} />
                            <Button 
                              onClick={() => handleDeleteNotice(notice.id)}
                              size="icon" 
                              variant="ghost"
                              className="text-red-400 hover:text-red-500"
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
              <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
                <CardContent className="p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                  <p className="text-2xl font-black text-pink-500">{approvedCount}</p>
                  <p className="text-gray-600 text-sm">Aprovados</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
                <CardContent className="p-4 text-center">
                  <Clock className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <p className="text-2xl font-black text-amber-500">{waitingPaymentCount}</p>
                  <p className="text-gray-600 text-sm">Aguardando Pagamento</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                <CardContent className="p-4 text-center">
                  <AlertCircle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-2xl font-black text-orange-500">{pendingCount}</p>
                  <p className="text-gray-600 text-sm">Pendentes</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border-pink-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Lista de Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-pink-100">
                        <th className="text-left text-gray-500 text-sm p-3">Nome</th>
                        <th className="text-left text-gray-500 text-sm p-3">Email</th>
                        <th className="text-left text-gray-500 text-sm p-3">Status</th>
                        <th className="text-left text-gray-500 text-sm p-3">Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.map((client) => (
                        <tr key={client.id} className="border-b border-pink-50 hover:bg-pink-50/50">
                          <td className="p-3 text-gray-900">{client.name}</td>
                          <td className="p-3 text-gray-600">{client.email}</td>
                          <td className="p-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              client.status === "approved" ? "bg-pink-100 text-pink-600" :
                              client.status === "waiting_payment" ? "bg-amber-100 text-amber-600" :
                              "bg-orange-100 text-orange-600"
                            }`}>
                              {client.status === "approved" ? "Aprovado" :
                               client.status === "waiting_payment" ? "Aguardando" : "Pendente"}
                            </span>
                          </td>
                          <td className="p-3 text-gray-500">{client.createdAt}</td>
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
            <Card className="bg-gradient-to-r from-pink-500 to-rose-500 border-0 text-white">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BookOpen className="w-6 h-6" />
                  Como usar sua Área de Membros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-pink-100">
                  Aprenda a configurar e gerenciar todo o conteúdo da sua área de membros de forma simples e rápida.
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white border-pink-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900 text-lg flex items-center gap-2">
                    <Upload className="w-5 h-5 text-pink-500" />
                    Como Adicionar Vídeos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3 bg-pink-50 rounded-xl p-3">
                    <span className="w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                    <div>
                      <p className="text-gray-900 font-medium">Via Link (YouTube)</p>
                      <p className="text-gray-500 text-sm">Cole o link embed do YouTube. Ex: https://youtube.com/embed/VIDEO_ID</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-pink-50 rounded-xl p-3">
                    <span className="w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                    <div>
                      <p className="text-gray-900 font-medium">Upload de Arquivo</p>
                      <p className="text-gray-500 text-sm">Faça upload de vídeos MP4 de até 50MB diretamente.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-pink-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900 text-lg flex items-center gap-2">
                    <Image className="w-5 h-5 text-pink-500" />
                    Como Adicionar Capas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3 bg-pink-50 rounded-xl p-3">
                    <span className="w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                    <div>
                      <p className="text-gray-900 font-medium">Via URL</p>
                      <p className="text-gray-500 text-sm">Cole a URL da imagem de qualquer hospedagem.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-pink-50 rounded-xl p-3">
                    <span className="w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                    <div>
                      <p className="text-gray-900 font-medium">Upload Direto</p>
                      <p className="text-gray-500 text-sm">Upload de imagens JPG/PNG até 50MB.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-pink-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900 text-lg flex items-center gap-2">
                    <Video className="w-5 h-5 text-pink-500" />
                    Estrutura de Módulos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="w-4 h-4 text-pink-500" />
                      <span><strong>Módulos:</strong> Grupos de aulas relacionadas</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="w-4 h-4 text-pink-500" />
                      <span><strong>Aulas:</strong> Vídeos individuais</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="w-4 h-4 text-pink-500" />
                      <span><strong>Botões:</strong> Links entre módulos</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="w-4 h-4 text-pink-500" />
                      <span><strong>Sem limite:</strong> Adicione quantos quiser</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white border-pink-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900 text-lg flex items-center gap-2">
                    <LayoutDashboard className="w-5 h-5 text-pink-500" />
                    Dashboard de Vendas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="w-4 h-4 text-pink-500" />
                      <span><strong>Aprovados:</strong> Pagamento confirmado</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span><strong>Aguardando:</strong> Não pagou ainda</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      <span><strong>Pendentes:</strong> Aguardando análise</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Configurações Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white border-pink-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-pink-500" />
                  Aparência
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Nome do Site</Label>
                    <Input
                      value={settings.siteName}
                      onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                      className="border-pink-200 focus:border-pink-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Logo</Label>
                    <div className="flex gap-2">
                      <Input
                        value={settings.logoUrl}
                        onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                        placeholder="Link ou upload..."
                        className="border-pink-200 focus:border-pink-400 flex-1"
                      />
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, (url) => setSettings({ ...settings, logoUrl: url }), 5);
                          }}
                        />
                        <Button type="button" variant="outline" className="border-pink-200 hover:bg-pink-50" disabled={isUploading}>
                          <Upload className="w-4 h-4" />
                        </Button>
                      </label>
                    </div>
                    {settings.logoUrl && (
                      <div className="mt-2 relative w-16 h-10 rounded overflow-hidden bg-gray-100 p-1">
                        <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                        <button onClick={() => setSettings({ ...settings, logoUrl: "" })} className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl">
                          <Trash2 className="w-2 h-2" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Cor Principal</Label>
                    <div className="flex gap-2">
                      <Input type="color" value={settings.primaryColor} onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })} className="w-14 h-10 p-1" />
                      <Input value={settings.primaryColor} onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })} className="border-pink-200" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Cor Secundária</Label>
                    <div className="flex gap-2">
                      <Input type="color" value={settings.secondaryColor} onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })} className="w-14 h-10 p-1" />
                      <Input value={settings.secondaryColor} onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })} className="border-pink-200" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-pink-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Play className="w-5 h-5 text-pink-500" />
                  Vídeo de Boas-Vindas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Switch checked={settings.showWelcomeSection} onCheckedChange={(v) => setSettings({ ...settings, showWelcomeSection: v })} />
                  <Label className="text-gray-600">Exibir seção de boas-vindas</Label>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Título de Boas-Vindas</Label>
                    <Input
                      value={settings.welcomeTitle}
                      onChange={(e) => setSettings({ ...settings, welcomeTitle: e.target.value })}
                      className="border-pink-200 focus:border-pink-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Tipo de Vídeo</Label>
                    <select
                      value={settings.welcomeVideoType}
                      onChange={(e) => setSettings({ ...settings, welcomeVideoType: e.target.value as "youtube" | "file" | "none" })}
                      className="w-full border border-pink-200 rounded-md p-2"
                    >
                      <option value="none">Sem vídeo</option>
                      <option value="youtube">Link YouTube</option>
                      <option value="file">Upload de Arquivo</option>
                    </select>
                  </div>
                </div>
                {settings.welcomeVideoType !== "none" && (
                  <div className="space-y-2">
                    <Label className="text-gray-700">
                      {settings.welcomeVideoType === "youtube" ? "URL do Vídeo (YouTube Embed)" : "Vídeo"}
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={settings.welcomeVideoUrl}
                        onChange={(e) => setSettings({ ...settings, welcomeVideoUrl: e.target.value })}
                        placeholder={settings.welcomeVideoType === "youtube" ? "https://youtube.com/embed/..." : "Cole link ou faça upload"}
                        className="border-pink-200 focus:border-pink-400 flex-1"
                      />
                      {settings.welcomeVideoType === "file" && (
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(file, (url) => setSettings({ ...settings, welcomeVideoUrl: url }), 50);
                            }}
                          />
                          <Button type="button" variant="outline" className="border-pink-200 hover:bg-pink-50" disabled={isUploading}>
                            <Upload className="w-4 h-4" />
                          </Button>
                        </label>
                      )}
                    </div>
                    {settings.welcomeVideoUrl && settings.welcomeVideoType === "file" && settings.welcomeVideoUrl.startsWith("data:") && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Vídeo carregado com sucesso
                      </p>
                    )}
                  </div>
                )}
                <div className="space-y-2">
                  <Label className="text-gray-700">Texto de Boas-Vindas</Label>
                  <Textarea
                    value={settings.welcomeText}
                    onChange={(e) => setSettings({ ...settings, welcomeText: e.target.value })}
                    className="border-pink-200 focus:border-pink-400"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-pink-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-pink-500" />
                  Integrações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-700">Link InfinitePay (Pagamento)</Label>
                  <Input
                    value={settings.infinitepayLink}
                    onChange={(e) => setSettings({ ...settings, infinitepayLink: e.target.value })}
                    placeholder="https://checkout.infinitepay.io/seu-link"
                    className="border-pink-200 focus:border-pink-400"
                  />
                  <p className="text-gray-500 text-xs">Cole o link completo de checkout do InfinitePay</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Código do Facebook Pixel</Label>
                  <Textarea
                    value={settings.facebookPixelCode}
                    onChange={(e) => setSettings({ ...settings, facebookPixelCode: e.target.value })}
                    placeholder="Cole aqui o código do seu Facebook Pixel..."
                    className="border-pink-200 focus:border-pink-400 font-mono text-sm"
                    rows={4}
                  />
                  <p className="text-gray-500 text-xs">Cole o código completo do pixel para rastreamento de conversões</p>
                </div>
                <Button onClick={handleSaveSettings} className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold">
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
