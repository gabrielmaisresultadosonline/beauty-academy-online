import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Scissors, Plus, Trash2, Edit, Upload, Save, X, 
  FolderOpen, Video, LogOut, Users, Settings, BarChart3
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Module {
  id: string;
  title: string;
  description: string;
  cover_url: string;
  order_index: number;
}

interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string;
  video_url: string;
  video_file_url: string;
  duration_minutes: number;
  order_index: number;
}

interface Enrollment {
  id: string;
  user_id: string;
  is_premium: boolean;
  created_at: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

export default function BelezaAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  
  // Pixel settings
  const [pixelCode, setPixelCode] = useState('');
  const [savingPixel, setSavingPixel] = useState(false);
  
  // Forms
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [selectedModuleForLesson, setSelectedModuleForLesson] = useState<string>('');
  
  // Module form
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');
  const [moduleCover, setModuleCover] = useState<File | null>(null);
  
  // Lesson form
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDescription, setLessonDescription] = useState('');
  const [lessonVideoUrl, setLessonVideoUrl] = useState('');
  const [lessonVideoFile, setLessonVideoFile] = useState<File | null>(null);
  const [lessonDuration, setLessonDuration] = useState('');
  
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/belezalisoperfeito/login');
      return;
    }

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!roleData) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão de administrador",
        variant: "destructive"
      });
      navigate('/belezalisoperfeito/dashboard');
      return;
    }

    setIsAdmin(true);
    loadData();
    loadPixelSettings();
  };

  const loadData = async () => {
    const [modulesRes, lessonsRes, enrollmentsRes] = await Promise.all([
      supabase.from('course_modules').select('*').order('order_index'),
      supabase.from('course_lessons').select('*').order('order_index'),
      supabase.from('course_enrollments').select(`
        *,
        profiles:user_id (full_name, email)
      `).order('created_at', { ascending: false })
    ]);

    setModules(modulesRes.data || []);
    setLessons(lessonsRes.data || []);
    setEnrollments(enrollmentsRes.data as any || []);
    setIsLoading(false);
  };

  const loadPixelSettings = async () => {
    const { data } = await supabase
      .from('platform_settings')
      .select('facebook_pixel_code')
      .eq('product_slug', 'belezalisoperfeito')
      .maybeSingle();
    
    if (data?.facebook_pixel_code) {
      setPixelCode(data.facebook_pixel_code);
    }
  };

  const savePixelSettings = async () => {
    setSavingPixel(true);
    const { error } = await supabase
      .from('platform_settings')
      .update({ facebook_pixel_code: pixelCode })
      .eq('product_slug', 'belezalisoperfeito');

    if (error) {
      toast({ title: "Erro ao salvar pixel", variant: "destructive" });
    } else {
      toast({ title: "Pixel salvo com sucesso!" });
    }
    setSavingPixel(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/belezalisoperfeito');
  };

  const uploadFile = async (file: File, bucket: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) {
      toast({
        title: "Erro no upload",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSaveModule = async () => {
    if (!moduleTitle.trim()) {
      toast({ title: "Preencha o título", variant: "destructive" });
      return;
    }

    setUploading(true);
    let coverUrl = editingModule?.cover_url || '';

    if (moduleCover) {
      const url = await uploadFile(moduleCover, 'course-covers');
      if (url) coverUrl = url;
    }

    const moduleData = {
      title: moduleTitle,
      description: moduleDescription,
      cover_url: coverUrl,
      order_index: editingModule?.order_index ?? modules.length
    };

    if (editingModule) {
      await supabase
        .from('course_modules')
        .update(moduleData)
        .eq('id', editingModule.id);
    } else {
      await supabase.from('course_modules').insert(moduleData);
    }

    toast({ title: editingModule ? "Módulo atualizado!" : "Módulo criado!" });
    resetModuleForm();
    loadData();
  };

  const handleSaveLesson = async () => {
    if (!lessonTitle.trim() || !selectedModuleForLesson) {
      toast({ title: "Preencha os campos obrigatórios", variant: "destructive" });
      return;
    }

    setUploading(true);
    let videoFileUrl = editingLesson?.video_file_url || '';

    if (lessonVideoFile) {
      const url = await uploadFile(lessonVideoFile, 'course-videos');
      if (url) videoFileUrl = url;
    }

    const lessonData = {
      module_id: selectedModuleForLesson,
      title: lessonTitle,
      description: lessonDescription,
      video_url: lessonVideoUrl,
      video_file_url: videoFileUrl,
      duration_minutes: lessonDuration ? parseInt(lessonDuration) : null,
      order_index: editingLesson?.order_index ?? lessons.filter(l => l.module_id === selectedModuleForLesson).length
    };

    if (editingLesson) {
      await supabase
        .from('course_lessons')
        .update(lessonData)
        .eq('id', editingLesson.id);
    } else {
      await supabase.from('course_lessons').insert(lessonData);
    }

    toast({ title: editingLesson ? "Aula atualizada!" : "Aula criada!" });
    resetLessonForm();
    loadData();
  };

  const deleteModule = async (id: string) => {
    if (!confirm('Excluir este módulo e todas as suas aulas?')) return;
    await supabase.from('course_modules').delete().eq('id', id);
    toast({ title: "Módulo excluído" });
    loadData();
  };

  const deleteLesson = async (id: string) => {
    if (!confirm('Excluir esta aula?')) return;
    await supabase.from('course_lessons').delete().eq('id', id);
    toast({ title: "Aula excluída" });
    loadData();
  };

  const resetModuleForm = () => {
    setShowModuleForm(false);
    setEditingModule(null);
    setModuleTitle('');
    setModuleDescription('');
    setModuleCover(null);
    setUploading(false);
  };

  const resetLessonForm = () => {
    setShowLessonForm(false);
    setEditingLesson(null);
    setLessonTitle('');
    setLessonDescription('');
    setLessonVideoUrl('');
    setLessonVideoFile(null);
    setLessonDuration('');
    setSelectedModuleForLesson('');
    setUploading(false);
  };

  const editModule = (module: Module) => {
    setEditingModule(module);
    setModuleTitle(module.title);
    setModuleDescription(module.description || '');
    setShowModuleForm(true);
  };

  const editLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setLessonTitle(lesson.title);
    setLessonDescription(lesson.description || '');
    setLessonVideoUrl(lesson.video_url || '');
    setLessonDuration(lesson.duration_minutes?.toString() || '');
    setSelectedModuleForLesson(lesson.module_id);
    setShowLessonForm(true);
  };

  // Stats
  const totalUsers = enrollments.length;
  const premiumUsers = enrollments.filter(e => e.is_premium).length;
  const pendingUsers = totalUsers - premiumUsers;

  if (isLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Header */}
      <header className="bg-white border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900">Admin - Beleza Liso Perfeito</span>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-gray-600">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard">
          <TabsList className="mb-8">
            <TabsTrigger value="dashboard" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="modules" className="gap-2">
              <FolderOpen className="w-4 h-4" />
              Módulos
            </TabsTrigger>
            <TabsTrigger value="lessons" className="gap-2">
              <Video className="w-4 h-4" />
              Aulas
            </TabsTrigger>
            <TabsTrigger value="students" className="gap-2">
              <Users className="w-4 h-4" />
              Alunos
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard de Vendas</h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-white border-pink-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total de Usuários</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{totalUsers}</div>
                  <p className="text-xs text-gray-500 mt-1">cadastrados na plataforma</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-green-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-green-600">Compras Aprovadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{premiumUsers}</div>
                  <p className="text-xs text-gray-500 mt-1">usuários premium ativos</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-orange-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-orange-600">Pendentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">{pendingUsers}</div>
                  <p className="text-xs text-gray-500 mt-1">aguardando pagamento</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {enrollments.slice(0, 10).map((enrollment) => (
                    <div key={enrollment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {(enrollment.profiles as any)?.full_name || 'Usuário'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {(enrollment.profiles as any)?.email || '-'}
                        </p>
                      </div>
                      <div className="text-right">
                        {enrollment.is_premium ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Pago</span>
                        ) : (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">Pendente</span>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(enrollment.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Modules Tab */}
          <TabsContent value="modules">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Módulos do Curso</h2>
              <Button onClick={() => setShowModuleForm(true)} className="bg-pink-500 hover:bg-pink-600">
                <Plus className="w-4 h-4 mr-2" />
                Novo Módulo
              </Button>
            </div>

            {modules.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <FolderOpen className="w-16 h-16 text-pink-200 mx-auto mb-4" />
                <p className="text-gray-600">Nenhum módulo criado ainda</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((module) => (
                  <div key={module.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="aspect-video bg-gradient-to-br from-pink-200 to-rose-300">
                      {module.cover_url && (
                        <img src={module.cover_url} alt={module.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900">{module.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{module.description}</p>
                      <p className="text-xs text-pink-600 mt-2">
                        {lessons.filter(l => l.module_id === module.id).length} aulas
                      </p>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" onClick={() => editModule(module)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-500" onClick={() => deleteModule(module.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Lessons Tab */}
          <TabsContent value="lessons">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Aulas</h2>
              <Button 
                onClick={() => setShowLessonForm(true)} 
                className="bg-pink-500 hover:bg-pink-600"
                disabled={modules.length === 0}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Aula
              </Button>
            </div>

            {modules.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <Video className="w-16 h-16 text-pink-200 mx-auto mb-4" />
                <p className="text-gray-600">Crie um módulo primeiro</p>
              </div>
            ) : (
              <div className="space-y-8">
                {modules.map((module) => {
                  const moduleLessons = lessons.filter(l => l.module_id === module.id);
                  return (
                    <div key={module.id} className="bg-white rounded-xl shadow-md p-6">
                      <h3 className="font-bold text-lg text-gray-900 mb-4">{module.title}</h3>
                      {moduleLessons.length === 0 ? (
                        <p className="text-gray-500 text-sm">Nenhuma aula neste módulo</p>
                      ) : (
                        <div className="space-y-3">
                          {moduleLessons.map((lesson, index) => (
                            <div key={lesson.id} className="flex items-center gap-4 p-4 bg-pink-50 rounded-lg">
                              <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                                {lesson.duration_minutes && (
                                  <p className="text-xs text-gray-500">{lesson.duration_minutes} min</p>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="ghost" onClick={() => editLesson(lesson)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-red-500" onClick={() => deleteLesson(lesson.id)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Alunos Inscritos</h2>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-pink-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {enrollments.map((enrollment) => (
                      <tr key={enrollment.id}>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {(enrollment.profiles as any)?.full_name || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {(enrollment.profiles as any)?.email || '-'}
                        </td>
                        <td className="px-6 py-4">
                          {enrollment.is_premium ? (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Premium</span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Grátis</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(enrollment.created_at).toLocaleDateString('pt-BR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Configurações</h2>
            
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Facebook Pixel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Cole o código completo do seu Facebook Pixel abaixo. O pixel será carregado automaticamente em todas as páginas do curso.
                </p>
                <Textarea
                  value={pixelCode}
                  onChange={(e) => setPixelCode(e.target.value)}
                  placeholder={`<!-- Meta Pixel Code -->\n<script>...</script>\n<noscript>...</noscript>\n<!-- End Meta Pixel Code -->`}
                  className="font-mono text-xs min-h-[200px]"
                />
                <Button onClick={savePixelSettings} disabled={savingPixel} className="bg-pink-500 hover:bg-pink-600">
                  {savingPixel ? (
                    <>Salvando...</>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Pixel
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Module Form Modal */}
      {showModuleForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{editingModule ? 'Editar Módulo' : 'Novo Módulo'}</h3>
              <Button variant="ghost" size="icon" onClick={resetModuleForm}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Título *</Label>
                <Input value={moduleTitle} onChange={(e) => setModuleTitle(e.target.value)} />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea value={moduleDescription} onChange={(e) => setModuleDescription(e.target.value)} />
              </div>
              <div>
                <Label>Capa</Label>
                <Input type="file" accept="image/*" onChange={(e) => setModuleCover(e.target.files?.[0] || null)} />
              </div>
              <Button onClick={handleSaveModule} disabled={uploading} className="w-full bg-pink-500 hover:bg-pink-600">
                {uploading ? 'Salvando...' : <><Save className="w-4 h-4 mr-2" />Salvar</>}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Form Modal */}
      {showLessonForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{editingLesson ? 'Editar Aula' : 'Nova Aula'}</h3>
              <Button variant="ghost" size="icon" onClick={resetLessonForm}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Módulo *</Label>
                <select
                  value={selectedModuleForLesson}
                  onChange={(e) => setSelectedModuleForLesson(e.target.value)}
                  className="w-full border rounded-md p-2"
                >
                  <option value="">Selecione um módulo</option>
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Título *</Label>
                <Input value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea value={lessonDescription} onChange={(e) => setLessonDescription(e.target.value)} />
              </div>
              <div>
                <Label>URL do Vídeo (YouTube, Vimeo, etc)</Label>
                <Input value={lessonVideoUrl} onChange={(e) => setLessonVideoUrl(e.target.value)} placeholder="https://..." />
              </div>
              <div>
                <Label>Ou fazer upload do vídeo</Label>
                <Input type="file" accept="video/*" onChange={(e) => setLessonVideoFile(e.target.files?.[0] || null)} />
              </div>
              <div>
                <Label>Duração (minutos)</Label>
                <Input type="number" value={lessonDuration} onChange={(e) => setLessonDuration(e.target.value)} />
              </div>
              <Button onClick={handleSaveLesson} disabled={uploading} className="w-full bg-pink-500 hover:bg-pink-600">
                {uploading ? 'Salvando...' : <><Save className="w-4 h-4 mr-2" />Salvar</>}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
