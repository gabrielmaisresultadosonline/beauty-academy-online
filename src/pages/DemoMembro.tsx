import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  ArrowLeft, Play, Clock, CheckCircle, Lock, 
  ChevronDown, ChevronUp, Settings
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

const DemoMembro = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState<DemoModule[]>([]);
  const [settings, setSettings] = useState<DemoSettings>({
    siteName: "Minha Área de Membros",
    primaryColor: "#00D26A",
    logoUrl: ""
  });
  const [selectedModule, setSelectedModule] = useState<DemoModule | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<DemoLesson | null>(null);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);

  useEffect(() => {
    const isAuth = localStorage.getItem("demo_authenticated");
    if (!isAuth) {
      navigate("/demonstracao");
      return;
    }

    const savedModules = localStorage.getItem("demo_modules");
    const savedSettings = localStorage.getItem("demo_settings");
    
    if (savedModules) {
      const parsed = JSON.parse(savedModules);
      setModules(parsed);
      if (parsed.length > 0) {
        setExpandedModules([parsed[0].id]);
      }
    }
    if (savedSettings) setSettings(JSON.parse(savedSettings));
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

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header 
        className="border-b border-zinc-800 px-4 py-4"
        style={{ backgroundColor: settings.primaryColor + "10" }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="h-8" />
            ) : (
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-black font-black"
                style={{ backgroundColor: settings.primaryColor }}
              >
                {settings.siteName.charAt(0)}
              </div>
            )}
            <h1 className="text-xl font-black text-white">{settings.siteName}</h1>
          </div>
          <Button 
            onClick={handleBackToAdmin} 
            variant="outline" 
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            <Settings className="w-4 h-4 mr-2" />
            Voltar ao Admin
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Banner informativo */}
        <div 
          className="rounded-lg p-4 mb-6 border"
          style={{ 
            backgroundColor: settings.primaryColor + "10",
            borderColor: settings.primaryColor + "30"
          }}
        >
          <p style={{ color: settings.primaryColor }} className="text-sm font-medium">
            <strong>Visualização:</strong> Esta é a visão do membro/cliente da sua área de membros.
          </p>
        </div>

        {modules.length === 0 ? (
          <Card className="bg-zinc-900 border-zinc-800 p-12 text-center">
            <p className="text-zinc-400 text-lg mb-4">Nenhum conteúdo disponível ainda.</p>
            <Button onClick={handleBackToAdmin} style={{ backgroundColor: settings.primaryColor }} className="text-black font-bold">
              Adicionar Conteúdo
            </Button>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Sidebar - Lista de Módulos */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-white font-bold text-lg">Conteúdo do Curso</h2>
              <div className="space-y-2">
                {modules.map((module) => (
                  <Card key={module.id} className="bg-zinc-900 border-zinc-800 overflow-hidden">
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: settings.primaryColor + "20" }}
                        >
                          <Play className="w-5 h-5" style={{ color: settings.primaryColor }} />
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-sm">{module.title}</h3>
                          <p className="text-zinc-500 text-xs">{module.lessons.length} aulas</p>
                        </div>
                      </div>
                      {expandedModules.includes(module.id) ? (
                        <ChevronUp className="w-5 h-5 text-zinc-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-zinc-500" />
                      )}
                    </button>
                    
                    {expandedModules.includes(module.id) && module.lessons.length > 0 && (
                      <div className="border-t border-zinc-800">
                        {module.lessons.map((lesson, index) => (
                          <button
                            key={lesson.id}
                            onClick={() => handleSelectLesson(module, lesson)}
                            className={`w-full p-3 pl-6 flex items-center gap-3 text-left hover:bg-zinc-800/50 transition-colors ${
                              selectedLesson?.id === lesson.id ? "bg-zinc-800" : ""
                            }`}
                          >
                            <span 
                              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                              style={{ 
                                backgroundColor: selectedLesson?.id === lesson.id ? settings.primaryColor : "transparent",
                                color: selectedLesson?.id === lesson.id ? "black" : settings.primaryColor,
                                border: `1px solid ${settings.primaryColor}`
                              }}
                            >
                              {index + 1}
                            </span>
                            <div className="flex-1">
                              <p className="text-zinc-300 text-sm">{lesson.title}</p>
                              <p className="text-zinc-500 text-xs flex items-center gap-1">
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

            {/* Main Content - Player */}
            <div className="lg:col-span-2">
              {selectedLesson ? (
                <div className="space-y-4">
                  <div className="aspect-video bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
                    <iframe
                      src={selectedLesson.videoUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div>
                    <h2 className="text-white text-2xl font-bold">{selectedLesson.title}</h2>
                    <p className="text-zinc-500">{selectedModule?.title}</p>
                  </div>
                </div>
              ) : (
                <Card className="bg-zinc-900 border-zinc-800 aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-16 h-16 mx-auto mb-4" style={{ color: settings.primaryColor }} />
                    <p className="text-zinc-400">Selecione uma aula para começar</p>
                  </div>
                </Card>
              )}

              {/* Module Cards Grid */}
              {!selectedLesson && (
                <div className="mt-6">
                  <h2 className="text-white font-bold text-lg mb-4">Módulos Disponíveis</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {modules.map((module) => (
                      <Card 
                        key={module.id} 
                        className="bg-zinc-900 border-zinc-800 overflow-hidden cursor-pointer hover:border-zinc-700 transition-colors"
                        onClick={() => {
                          toggleModule(module.id);
                          if (module.lessons.length > 0) {
                            handleSelectLesson(module, module.lessons[0]);
                          }
                        }}
                      >
                        <div className="aspect-video relative">
                          <img 
                            src={module.coverUrl} 
                            alt={module.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <div 
                              className="w-14 h-14 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: settings.primaryColor }}
                            >
                              <Play className="w-6 h-6 text-black ml-1" />
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="text-white font-bold">{module.title}</h3>
                          <p className="text-zinc-500 text-sm">{module.lessons.length} aulas</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoMembro;
