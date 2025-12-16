import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Plus, Trash2, Eye, LogOut, Image, Video, Link, 
  GripVertical, Settings, Users, LayoutDashboard, Play
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

const DemoAdmin = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState<DemoModule[]>([]);
  const [settings, setSettings] = useState<DemoSettings>({
    siteName: "Minha Área de Membros",
    primaryColor: "#00D26A",
    logoUrl: ""
  });

  // Form states
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newModuleDescription, setNewModuleDescription] = useState("");
  const [newModuleCover, setNewModuleCover] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonVideo, setNewLessonVideo] = useState("");
  const [newLessonDuration, setNewLessonDuration] = useState("");

  useEffect(() => {
    const isAuth = localStorage.getItem("demo_authenticated");
    if (!isAuth) {
      navigate("/demonstracao");
      return;
    }

    // Load saved data from localStorage
    const savedModules = localStorage.getItem("demo_modules");
    const savedSettings = localStorage.getItem("demo_settings");
    
    if (savedModules) setModules(JSON.parse(savedModules));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, [navigate]);

  const saveToLocal = (newModules: DemoModule[], newSettings?: DemoSettings) => {
    localStorage.setItem("demo_modules", JSON.stringify(newModules));
    if (newSettings) {
      localStorage.setItem("demo_settings", JSON.stringify(newSettings));
    }
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
            Adicione módulos e aulas para ver como ficaria sua área de membros.
          </p>
        </div>

        <Tabs defaultValue="modules" className="space-y-6">
          <TabsList className="bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="modules" className="data-[state=active]:bg-[#00D26A] data-[state=active]:text-black">
              <Video className="w-4 h-4 mr-2" />
              Módulos
            </TabsTrigger>
            <TabsTrigger value="lessons" className="data-[state=active]:bg-[#00D26A] data-[state=active]:text-black">
              <Play className="w-4 h-4 mr-2" />
              Aulas
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-[#00D26A] data-[state=active]:text-black">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </TabsTrigger>
          </TabsList>

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

            {/* Lista de Módulos */}
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

            {/* Lista de Aulas por Módulo */}
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
