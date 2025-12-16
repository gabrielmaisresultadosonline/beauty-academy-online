import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Play, Clock, Settings, ChevronDown, ChevronUp, 
  Bell, CheckCircle, Crown, Sparkles, LogOut
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
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [dismissedNotices, setDismissedNotices] = useState<string[]>([]);
  const [showPopupNotices, setShowPopupNotices] = useState<DemoNotice[]>([]);

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
    if (modulesToUse.length > 0) {
      setExpandedModules([modulesToUse[0].id]);
    }
    
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

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleSelectLesson = (module: DemoModule, lesson: DemoLesson) => {
    setSelectedModule(module);
    setSelectedLesson(lesson);
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
          <div>
            <button
              onClick={() => setSelectedLesson(null)}
              className="flex items-center gap-2 hover:opacity-80 mb-6 font-medium"
              style={{ color: settings.primaryColor }}
            >
              <ChevronDown className="w-4 h-4 rotate-90" />
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
          </div>
        ) : (
          // Modules View
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Sidebar - Lista de Módulos */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-gray-900 font-bold text-lg">Conteúdo do Curso</h2>
              <div className="space-y-2">
                {modules.map((module) => (
                  <Card key={module.id} className="bg-white border-pink-100 overflow-hidden shadow-sm">
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-pink-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: settings.primaryColor + "15" }}
                        >
                          <Play className="w-5 h-5" style={{ color: settings.primaryColor }} />
                        </div>
                        <div>
                          <h3 className="text-gray-900 font-bold text-sm">{module.title}</h3>
                          <p className="text-gray-500 text-xs">{module.lessons.length} aulas</p>
                        </div>
                      </div>
                      {expandedModules.includes(module.id) ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    
                    {expandedModules.includes(module.id) && module.lessons.length > 0 && (
                      <div className="border-t border-pink-100">
                        {module.lessons.map((lesson, index) => (
                          <button
                            key={lesson.id}
                            onClick={() => handleSelectLesson(module, lesson)}
                            className={`w-full p-3 pl-6 flex items-center gap-3 text-left hover:bg-pink-50/50 transition-colors ${
                              selectedLesson?.id === lesson.id ? "bg-pink-50" : ""
                            }`}
                          >
                            <span 
                              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                              style={{ 
                                backgroundColor: selectedLesson?.id === lesson.id ? settings.primaryColor : "transparent",
                                color: selectedLesson?.id === lesson.id ? "white" : settings.primaryColor,
                                border: `2px solid ${settings.primaryColor}`
                              }}
                            >
                              {index + 1}
                            </span>
                            <div className="flex-1">
                              <p className="text-gray-700 text-sm font-medium">{lesson.title}</p>
                              <p className="text-gray-400 text-xs flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {lesson.duration}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            {/* Main Content - Modules Grid */}
            <div className="lg:col-span-2">
              <h2 className="text-gray-900 font-bold text-lg mb-4">Módulos Disponíveis</h2>
              <div className="space-y-4">
                {modules.map((module) => (
                  <div key={module.id}>
                    {/* Buttons BEFORE module */}
                    {getButtonsForModule(module.id, "before").map((button) => (
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

                    {/* Module Card */}
                    <Card 
                      className="bg-white border-pink-100 overflow-hidden cursor-pointer hover:shadow-xl transition-all shadow-lg group"
                      style={{ borderColor: settings.primaryColor + "30" }}
                      onClick={() => {
                        if (!expandedModules.includes(module.id)) {
                          toggleModule(module.id);
                        }
                        if (module.lessons.length > 0) {
                          handleSelectLesson(module, module.lessons[0]);
                        }
                      }}
                    >
                      <div className="aspect-video relative bg-gradient-to-br from-pink-200 to-rose-300">
                        {module.coverUrl && (
                          <img 
                            src={module.coverUrl} 
                            alt={module.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                        {module.showPlayButton && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div 
                              className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform"
                              style={{ backgroundColor: settings.primaryColor }}
                            >
                              <Play className="w-7 h-7 text-white ml-1" />
                            </div>
                          </div>
                        )}
                        <div 
                          className="absolute top-3 right-3 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-bold shadow-lg text-white"
                          style={{ backgroundColor: settings.primaryColor }}
                        >
                          <Play className="w-4 h-4 fill-white" />
                          <span className="hidden sm:inline">Assistir</span>
                        </div>
                      </div>
                      <CardContent className="p-5">
                        <h3 className="text-gray-900 font-bold text-lg">{module.title}</h3>
                        {module.showDescription && module.description && (
                          <p className="text-gray-500 text-sm mt-1">{module.description}</p>
                        )}
                        <p className="text-sm mt-2 font-medium" style={{ color: settings.primaryColor }}>
                          {module.lessons.length} aulas disponíveis
                        </p>
                      </CardContent>
                    </Card>

                    {/* Buttons AFTER module */}
                    {getButtonsForModule(module.id, "after").map((button) => (
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
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoMembro;
