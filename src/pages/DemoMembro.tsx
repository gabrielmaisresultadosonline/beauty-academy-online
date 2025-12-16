import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Play, Clock, Settings, ChevronDown, ChevronLeft, ChevronRight,
  Bell, CheckCircle, Crown, Sparkles, LogOut, BookOpen, ArrowLeft, X
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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

const DemoMembro = () => {
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
  const [selectedModule, setSelectedModule] = useState<DemoModule | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<DemoLesson | null>(null);
  const [dismissedNotices, setDismissedNotices] = useState<string[]>([]);
  const [showPopupNotices, setShowPopupNotices] = useState<DemoNotice[]>([]);
  const [viewingModuleDetail, setViewingModuleDetail] = useState<DemoModule | null>(null);

  // Default demo modules
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
    const savedDismissed = localStorage.getItem("demo_dismissed_notices");
    
    // Load modules or use defaults
    let modulesToUse: DemoModule[];
    if (savedModules) {
      modulesToUse = JSON.parse(savedModules);
    } else {
      modulesToUse = defaultDemoModules;
      localStorage.setItem("demo_modules", JSON.stringify(defaultDemoModules));
    }
    setModules(modulesToUse);
    
    if (savedSettings) setSettings({ ...settings, ...JSON.parse(savedSettings) });
    
    // Load buttons or use defaults
    if (savedButtons) {
      setButtons(JSON.parse(savedButtons));
    } else {
      setButtons(defaultDemoButtons);
      localStorage.setItem("demo_buttons", JSON.stringify(defaultDemoButtons));
    }
    
    if (savedNotices) {
      const parsedNotices: DemoNotice[] = JSON.parse(savedNotices);
      setNotices(parsedNotices);
      
      const dismissed = savedDismissed ? JSON.parse(savedDismissed) : [];
      setDismissedNotices(dismissed);
      
      const activeNotices = parsedNotices.filter(n => n.active);
      const popupNotices = activeNotices.filter(n => {
        if (n.type === "once") return !dismissed.includes(n.id);
        if (n.type === "per_access") return true;
        return false;
      });
      
      setShowPopupNotices(popupNotices);
    }
  }, [navigate]);

  const handleSelectLesson = (module: DemoModule, lesson: DemoLesson) => {
    setSelectedModule(module);
    setSelectedLesson(lesson);
    setViewingModuleDetail(null);
  };

  const handleOpenModuleDetail = (module: DemoModule) => {
    setViewingModuleDetail(module);
  };

  const handleBackToModules = () => {
    setViewingModuleDetail(null);
    setSelectedLesson(null);
    setSelectedModule(null);
  };

  const handleBackToAdmin = () => {
    navigate("/demonstracao/admin");
  };

  const handleDismissNotice = (noticeId: string, noticeType: string) => {
    if (noticeType === "once") {
      const newDismissed = [...dismissedNotices, noticeId];
      setDismissedNotices(newDismissed);
      localStorage.setItem("demo_dismissed_notices", JSON.stringify(newDismissed));
    }
    setShowPopupNotices(prev => prev.filter(n => n.id !== noticeId));
  };

  const handleLogout = () => {
    localStorage.removeItem("demo_authenticated");
    navigate("/demonstracao");
  };

  const alwaysNotices = notices.filter(n => n.active && n.type === "always");

  const getButtonsForModule = (moduleId: string, position: "before" | "after") => {
    return buttons.filter(b => b.moduleId === moduleId && b.position === position);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Popup Notices */}
      {showPopupNotices.length > 0 && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="bg-white border-pink-200 max-w-md w-full shadow-2xl animate-scale-in">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: settings.primaryColor + "20" }}>
                    <Bell className="w-5 h-5" style={{ color: settings.primaryColor }} />
                  </div>
                  <h3 className="text-gray-900 font-bold">{showPopupNotices[0].title}</h3>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  showPopupNotices[0].type === "once" ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600"
                }`}>
                  {showPopupNotices[0].type === "once" ? "Novo" : "Lembrete"}
                </span>
              </div>
              <p className="text-gray-600 mb-6">{showPopupNotices[0].message}</p>
              <Button 
                onClick={() => handleDismissNotice(showPopupNotices[0].id, showPopupNotices[0].type)}
                className="w-full text-white font-bold"
                style={{ backgroundColor: settings.primaryColor }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {showPopupNotices[0].type === "once" ? "Entendi, não mostrar novamente" : "OK, entendi"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-pink-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="h-10 object-contain" />
            ) : (
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black"
                style={{ backgroundColor: settings.primaryColor }}
              >
                {settings.siteName.charAt(0)}
              </div>
            )}
            <div>
              <span className="font-bold text-gray-900">{settings.siteName}</span>
              <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full" style={{ backgroundColor: settings.secondaryColor + "20", color: settings.secondaryColor }}>
                PREMIUM
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleBackToAdmin} 
              variant="outline" 
              className="border-pink-200 text-gray-600 hover:bg-pink-50"
            >
              <Settings className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Admin</span>
            </Button>
            <Button onClick={handleLogout} variant="ghost" className="text-gray-600">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Always visible notices (banner) */}
      {alwaysNotices.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          {alwaysNotices.map((notice) => (
            <div 
              key={notice.id}
              className="rounded-2xl p-4 mb-3 border flex items-start gap-3 shadow-sm"
              style={{ 
                backgroundColor: settings.primaryColor + "10",
                borderColor: settings.primaryColor + "30"
              }}
            >
              <Bell className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: settings.primaryColor }} />
              <div>
                <h4 className="text-gray-900 font-bold text-sm">{notice.title}</h4>
                <p className="text-gray-600 text-sm">{notice.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Info Banner */}
        <div 
          className="rounded-2xl p-4 mb-6 border shadow-sm"
          style={{ 
            backgroundColor: settings.primaryColor + "08",
            borderColor: settings.primaryColor + "20"
          }}
        >
          <p className="text-sm font-medium" style={{ color: settings.primaryColor }}>
            <strong>Visualização do Membro:</strong> Esta é a visão do seu cliente ao acessar a área de membros.
          </p>
        </div>

        {/* Welcome Section */}
        {settings.showWelcomeSection && (
          <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 mb-8 border border-pink-100">
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: settings.secondaryColor + "20" }}
              >
                <Crown className="w-6 h-6" style={{ color: settings.secondaryColor }} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{settings.welcomeTitle}</h1>
                <p className="text-gray-600">{settings.welcomeText}</p>
              </div>
            </div>
            
            {settings.welcomeVideoType !== "none" && settings.welcomeVideoUrl && (
              <div className="aspect-video bg-black rounded-2xl overflow-hidden mt-4">
                {settings.welcomeVideoType === "youtube" ? (
                  <iframe
                    src={settings.welcomeVideoUrl}
                    className="w-full h-full"
                    allowFullScreen
                    allow="autoplay; fullscreen"
                  />
                ) : (
                  <video
                    src={settings.welcomeVideoUrl}
                    controls
                    className="w-full h-full"
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* New content banner */}
        <div 
          className="rounded-2xl p-4 mb-8 flex items-center gap-4 border shadow-sm"
          style={{ 
            backgroundColor: settings.secondaryColor + "10",
            borderColor: settings.secondaryColor + "30"
          }}
        >
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: settings.secondaryColor + "20" }}
          >
            <Sparkles className="w-6 h-6" style={{ color: settings.secondaryColor }} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Estamos incluindo novos conteúdos</h3>
            <p className="text-sm text-gray-600">Aguarde por favor, em breve teremos mais módulos e aulas!</p>
          </div>
        </div>

        {modules.length === 0 ? (
          <Card className="bg-white border-pink-100 p-12 text-center shadow-lg">
            <Crown className="w-16 h-16 mx-auto mb-4" style={{ color: settings.primaryColor }} />
            <p className="text-gray-500 text-lg mb-4">Nenhum conteúdo disponível ainda.</p>
            <Button onClick={handleBackToAdmin} style={{ backgroundColor: settings.primaryColor }} className="text-white font-bold">
              Adicionar Conteúdo
            </Button>
          </Card>
        ) : selectedLesson ? (
          // Video Player View
          <div className="animate-fade-in">
            <button
              onClick={handleBackToModules}
              className="flex items-center gap-2 hover:opacity-80 mb-6 font-medium"
              style={{ color: settings.primaryColor }}
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar aos módulos
            </button>
            
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-pink-100">
              <div className="aspect-video bg-black">
                {selectedLesson.videoType === "youtube" || selectedLesson.videoUrl.includes("youtube") || selectedLesson.videoUrl.includes("embed") ? (
                  <iframe
                    src={selectedLesson.videoUrl}
                    className="w-full h-full"
                    allowFullScreen
                    allow="autoplay; fullscreen"
                  />
                ) : (
                  <video
                    src={selectedLesson.videoUrl}
                    controls
                    className="w-full h-full"
                  />
                )}
              </div>
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900">{selectedLesson.title}</h1>
                {selectedLesson.showDescription && selectedLesson.description && (
                  <p className="text-gray-600 mt-2">{selectedLesson.description}</p>
                )}
                <p className="text-gray-500 text-sm mt-2">{selectedModule?.title}</p>
              </div>
            </div>

            {/* Lista de aulas do módulo atual */}
            {selectedModule && (
              <div className="mt-8">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" style={{ color: settings.primaryColor }} />
                  Outras aulas deste módulo
                </h3>
                <div className="grid gap-3">
                  {selectedModule.lessons.map((lesson, index) => (
                    <button
                      key={lesson.id}
                      onClick={() => handleSelectLesson(selectedModule, lesson)}
                      className={`w-full p-4 rounded-2xl flex items-center gap-4 text-left transition-all ${
                        selectedLesson?.id === lesson.id 
                          ? "bg-pink-100 border-2 shadow-md" 
                          : "bg-white border border-pink-100 hover:bg-pink-50 hover:shadow-md"
                      }`}
                      style={{ borderColor: selectedLesson?.id === lesson.id ? settings.primaryColor : undefined }}
                    >
                      <span 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{ 
                          backgroundColor: selectedLesson?.id === lesson.id ? settings.primaryColor : settings.primaryColor + "15",
                          color: selectedLesson?.id === lesson.id ? "white" : settings.primaryColor,
                        }}
                      >
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium">{lesson.title}</p>
                        <p className="text-gray-400 text-xs flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {lesson.duration}
                        </p>
                      </div>
                      {selectedLesson?.id === lesson.id && (
                        <Play className="w-5 h-5 flex-shrink-0" style={{ color: settings.primaryColor }} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : viewingModuleDetail ? (
          // Module Detail View - Lista de Aulas
          <div className="animate-fade-in">
            <button
              onClick={handleBackToModules}
              className="flex items-center gap-2 hover:opacity-80 mb-6 font-medium"
              style={{ color: settings.primaryColor }}
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar aos módulos
            </button>

            {/* Module Header */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-pink-100 mb-8">
              <div className="aspect-[21/9] relative bg-gradient-to-br from-pink-200 to-rose-300">
                {viewingModuleDetail.coverUrl && (
                  <img 
                    src={viewingModuleDetail.coverUrl} 
                    alt={viewingModuleDetail.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-white">{viewingModuleDetail.title}</h1>
                  {viewingModuleDetail.showDescription && viewingModuleDetail.description && (
                    <p className="text-white/80 mt-2 text-sm md:text-base">{viewingModuleDetail.description}</p>
                  )}
                  <p className="text-white/60 text-sm mt-2">
                    {viewingModuleDetail.lessons.length} aulas disponíveis
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons for this module */}
            {getButtonsForModule(viewingModuleDetail.id, "before").map((button) => (
              <a
                key={button.id}
                href={button.url || "#"}
                target={button.url ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="block mb-4"
              >
                <Button 
                  className="w-full py-6 text-white font-bold text-lg rounded-2xl shadow-lg hover:opacity-90 transition-all"
                  style={{ backgroundColor: button.color }}
                >
                  {button.text}
                </Button>
              </a>
            ))}

            {/* Lessons List */}
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" style={{ color: settings.primaryColor }} />
              Conteúdo do Módulo
            </h3>
            <div className="grid gap-4">
              {viewingModuleDetail.lessons.map((lesson, index) => (
                <Card 
                  key={lesson.id}
                  className="bg-white border-pink-100 overflow-hidden cursor-pointer hover:shadow-xl transition-all shadow-md group"
                  onClick={() => handleSelectLesson(viewingModuleDetail, lesson)}
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Lesson Cover/Number */}
                    <div className="sm:w-48 h-32 relative bg-gradient-to-br from-pink-200 to-rose-300 flex-shrink-0">
                      {lesson.showCover && lesson.coverUrl ? (
                        <img src={lesson.coverUrl} alt={lesson.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span 
                            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg"
                            style={{ backgroundColor: settings.primaryColor }}
                          >
                            {index + 1}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center shadow-xl"
                          style={{ backgroundColor: settings.primaryColor }}
                        >
                          <Play className="w-5 h-5 text-white ml-0.5" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Lesson Info */}
                    <CardContent className="p-4 flex-1 flex flex-col justify-center">
                      <h4 className="text-gray-900 font-bold text-lg group-hover:text-pink-600 transition-colors">
                        {lesson.title}
                      </h4>
                      {lesson.showDescription && lesson.description && (
                        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{lesson.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {lesson.duration}
                        </span>
                        <span 
                          className="text-xs font-medium px-2 py-1 rounded-full"
                          style={{ backgroundColor: settings.primaryColor + "15", color: settings.primaryColor }}
                        >
                          Aula {index + 1}
                        </span>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>

            {/* Buttons after module */}
            {getButtonsForModule(viewingModuleDetail.id, "after").map((button) => (
              <a
                key={button.id}
                href={button.url || "#"}
                target={button.url ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="block mt-4"
              >
                <Button 
                  className="w-full py-6 text-white font-bold text-lg rounded-2xl shadow-lg hover:opacity-90 transition-all"
                  style={{ backgroundColor: button.color }}
                >
                  {button.text}
                </Button>
              </a>
            ))}
          </div>
        ) : (
          // Modules Carousel View
          <div className="animate-fade-in">
            {/* Welcome Banner Image */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-pink-100 mb-8">
              <div className="aspect-video relative bg-gradient-to-br from-pink-300 via-rose-200 to-amber-200">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80" 
                  alt="Bem-vindo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center shadow-2xl bg-white/90 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Play className="w-8 h-8 ml-1" style={{ color: settings.primaryColor }} />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-bold text-white mb-3 inline-block"
                    style={{ backgroundColor: settings.primaryColor }}
                  >
                    VÍDEO DE BOAS-VINDAS
                  </span>
                  <h1 className="text-2xl md:text-4xl font-bold text-white">{settings.welcomeTitle}</h1>
                  <p className="text-white/80 mt-2 text-sm md:text-base max-w-2xl">{settings.welcomeText}</p>
                </div>
              </div>
            </div>

            <h2 className="text-gray-900 font-bold text-xl mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6" style={{ color: settings.primaryColor }} />
              Módulos do Curso
            </h2>

            {/* Modules Carousel */}
            <Carousel
              opts={{
                align: "start",
                loop: modules.length > 3,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {modules.map((module, index) => (
                  <CarouselItem key={module.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                    <Card 
                      className="bg-white border-pink-100 overflow-hidden cursor-pointer hover:shadow-2xl transition-all shadow-lg group h-full"
                      style={{ borderColor: settings.primaryColor + "30" }}
                      onClick={() => handleOpenModuleDetail(module)}
                    >
                      <div className="aspect-[4/3] relative bg-gradient-to-br from-pink-200 to-rose-300 overflow-hidden">
                        {module.coverUrl && (
                          <img 
                            src={module.coverUrl} 
                            alt={module.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                        {module.showPlayButton && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div 
                              className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform bg-white/90"
                            >
                              <Play className="w-6 h-6 ml-0.5" style={{ color: settings.primaryColor }} />
                            </div>
                          </div>
                        )}
                        <div 
                          className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-sm font-bold shadow-lg text-white"
                          style={{ backgroundColor: settings.primaryColor }}
                        >
                          Módulo {index + 1}
                        </div>
                        <div 
                          className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-medium shadow-lg"
                          style={{ backgroundColor: "white", color: settings.primaryColor }}
                        >
                          <BookOpen className="w-3 h-3" />
                          {module.lessons.length} aulas
                        </div>
                      </div>
                      <CardContent className="p-5">
                        <h3 className="text-gray-900 font-bold text-lg line-clamp-2 group-hover:text-pink-600 transition-colors">
                          {module.title}
                        </h3>
                        {module.showDescription && module.description && (
                          <p className="text-gray-500 text-sm mt-2 line-clamp-2">{module.description}</p>
                        )}
                        <Button 
                          className="w-full mt-4 text-white font-bold"
                          style={{ backgroundColor: settings.primaryColor }}
                        >
                          Ver Conteúdo
                        </Button>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-4 bg-white border-pink-200 hover:bg-pink-50" />
              <CarouselNext className="hidden md:flex -right-4 bg-white border-pink-200 hover:bg-pink-50" />
            </Carousel>

            {/* Mobile scroll indicator */}
            <div className="flex justify-center gap-2 mt-6 md:hidden">
              {modules.map((_, index) => (
                <div 
                  key={index}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: settings.primaryColor + (index === 0 ? "" : "40") }}
                />
              ))}
            </div>

            {/* All Buttons below modules */}
            <div className="mt-10 space-y-4">
              {buttons.map((button) => (
                <a
                  key={button.id}
                  href={button.url || "#"}
                  target={button.url ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button 
                    className="w-full py-6 text-white font-bold text-lg rounded-2xl shadow-lg hover:opacity-90 hover:scale-[1.02] transition-all"
                    style={{ backgroundColor: button.color }}
                  >
                    {button.text}
                  </Button>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoMembro;
