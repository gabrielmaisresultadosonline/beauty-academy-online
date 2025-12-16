import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Scissors, Play, Lock, LogOut, Crown, ChevronRight, 
  BookOpen, Clock, Award, Sparkles, Camera, Upload, CheckCircle2, Loader2
} from 'lucide-react';

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

export default function BelezaDashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/belezalisoperfeito/login');
      return;
    }
    setUser(user);
    
    // Get profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    setProfile(profileData);

    // Get enrollment
    const { data: enrollmentData } = await supabase
      .from('course_enrollments')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (!enrollmentData) {
      // Create enrollment if doesn't exist
      const { data: newEnrollment } = await supabase
        .from('course_enrollments')
        .insert({ user_id: user.id, is_premium: false })
        .select()
        .single();
      setEnrollment(newEnrollment);
    } else {
      setEnrollment(enrollmentData);
    }

    // Load content if premium
    if (enrollmentData?.is_premium) {
      loadContent();
    }
    
    setIsLoading(false);
  };

  const loadContent = async () => {
    const { data: modulesData } = await supabase
      .from('course_modules')
      .select('*')
      .order('order_index');
    
    const { data: lessonsData } = await supabase
      .from('course_lessons')
      .select('*')
      .order('order_index');
    
    setModules(modulesData || []);
    setLessons(lessonsData || []);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/belezalisoperfeito');
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingPhoto(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('certificate-photos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('certificate-photos')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('course_enrollments')
        .update({ certificate_photo_url: publicUrl })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setEnrollment({ ...enrollment, certificate_photo_url: publicUrl });
      toast({ title: "Foto enviada com sucesso!", description: "Aguarde a emissão do seu certificado." });
    } catch (error: any) {
      toast({ title: "Erro ao enviar foto", description: error.message, variant: "destructive" });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const getPaymentLink = () => {
    const userName = profile?.full_name || 'Aluna';
    const itemName = encodeURIComponent(`CURSO BELEZA LISO PERFEITO - ${userName}`);
    return `https://checkout.infinitepay.io/paguemro?items=[{"name":"${itemName}","price":100,"quantity":1}]&redirect_url=${encodeURIComponent('https://acessar.click/belezalisoperfeito/obrigado')}`;
  };

  const moduleLessons = selectedModule 
    ? lessons.filter(l => l.module_id === selectedModule)
    : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Premium upgrade prompt
  if (!enrollment?.is_premium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 relative overflow-hidden">
        {/* Floating hair styling images background */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-pink-300 to-rose-400 rounded-lg shadow-lg flex items-center justify-center">
                <Scissors className="w-12 h-12 text-white" />
              </div>
            </div>
          ))}
        </div>

        {/* Header */}
        <header className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-pink-200">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                <Scissors className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">Beleza Liso Perfeito</span>
            </div>
            <Button variant="ghost" onClick={handleLogout} className="text-gray-600">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </header>

        {/* Premium Prompt */}
        <main className="relative z-10 max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Crown className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Olá, {profile?.full_name?.split(' ')[0] || 'Aluna'}! 👋
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Ative seu acesso premium para começar o curso completo de cabeleireira profissional
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-pink-50 rounded-xl p-6">
                <BookOpen className="w-8 h-8 text-pink-500 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900">160+ Aulas</h3>
                <p className="text-sm text-gray-600">Conteúdo completo em vídeo</p>
              </div>
              <div className="bg-pink-50 rounded-xl p-6">
                <Clock className="w-8 h-8 text-pink-500 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900">Acesso Vitalício</h3>
                <p className="text-sm text-gray-600">Sem mensalidades</p>
              </div>
              <div className="bg-pink-50 rounded-xl p-6">
                <Award className="w-8 h-8 text-pink-500 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900">Certificado</h3>
                <p className="text-sm text-gray-600">Reconhecido pelo MEC</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-8 text-white mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-6 h-6" />
                <span className="text-lg font-medium">Oferta Especial</span>
              </div>
              <div className="text-5xl font-bold mb-2">R$ 1,00</div>
              <p className="text-pink-100 line-through">De R$ 197,00</p>
              <p className="text-sm text-pink-100 mt-2">Pagamento único • Acesso vitalício</p>
            </div>

            <a
              href={getPaymentLink()}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-xl px-12 py-5 rounded-full shadow-lg transition-all transform hover:scale-105"
            >
              <Lock className="w-5 h-5" />
              ATIVAR ACESSO PREMIUM
            </a>

            {/* Preview Content */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-2">
                <Lock className="w-5 h-5 text-pink-500" />
                Prévia do Conteúdo
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {['Colorimetria', 'Corte Feminino', 'Penteados'].map((title, i) => (
                  <div key={i} className="relative group">
                    <div className="bg-gradient-to-br from-pink-200 to-rose-300 rounded-xl aspect-video flex items-center justify-center">
                      <Play className="w-12 h-12 text-white/80" />
                    </div>
                    <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Lock className="w-8 h-8 text-white" />
                    </div>
                    <p className="mt-2 font-medium text-gray-700">{title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          .animate-float {
            animation: float 15s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  // Premium Dashboard
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
              <span className="font-bold text-gray-900">Beleza Liso Perfeito</span>
              <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                PREMIUM
              </span>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-gray-600">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {selectedLesson ? (
          // Video Player View
          <div>
            <button
              onClick={() => setSelectedLesson(null)}
              className="flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-6"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Voltar aos módulos
            </button>
            
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="aspect-video bg-black">
                {selectedLesson.video_url ? (
                  <iframe
                    src={selectedLesson.video_url}
                    className="w-full h-full"
                    allowFullScreen
                    allow="autoplay; fullscreen"
                  />
                ) : selectedLesson.video_file_url ? (
                  <video
                    src={selectedLesson.video_file_url}
                    controls
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    Vídeo não disponível
                  </div>
                )}
              </div>
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900">{selectedLesson.title}</h1>
                {selectedLesson.description && (
                  <p className="text-gray-600 mt-2">{selectedLesson.description}</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Modules View
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Bem-vinda ao Curso, {profile?.full_name?.split(' ')[0]}! 🎉
            </h1>

            {/* Certificate Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-2 border-amber-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Seu Certificado</h2>
                  <p className="text-sm text-gray-600">Certificado de Conclusão incluso</p>
                </div>
              </div>

              {enrollment?.certificate_issued_at ? (
                // Certificate issued
                <div className="bg-green-50 rounded-xl p-6 text-center">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-700 mb-2">Certificado Emitido!</h3>
                  <p className="text-green-600 mb-4">
                    Emitido em {new Date(enrollment.certificate_issued_at).toLocaleDateString('pt-BR')}
                  </p>
                  {enrollment.certificate_url && (
                    <a
                      href={enrollment.certificate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-full transition-colors"
                    >
                      <Award className="w-5 h-5" />
                      Baixar Certificado
                    </a>
                  )}
                </div>
              ) : enrollment?.certificate_photo_url ? (
                // Photo uploaded, waiting for certificate
                <div className="bg-amber-50 rounded-xl p-6">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-amber-300">
                      <img 
                        src={enrollment.certificate_photo_url} 
                        alt="Sua foto" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-lg font-bold text-amber-700 mb-2">
                        Foto Enviada com Sucesso!
                      </h3>
                      <p className="text-amber-600">
                        Aguarde a emissão do seu certificado. Você será notificada quando estiver pronto.
                      </p>
                      <label className="mt-4 inline-flex items-center gap-2 text-sm text-amber-700 hover:text-amber-800 cursor-pointer">
                        <Camera className="w-4 h-4" />
                        Enviar outra foto
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          disabled={uploadingPhoto}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                // No photo yet
                <div className="bg-pink-50 rounded-xl p-6 text-center">
                  <Camera className="w-16 h-16 text-pink-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Envie sua foto para o certificado
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Para emitirmos seu certificado personalizado, precisamos de uma foto sua. 
                    Escolha uma foto profissional de boa qualidade.
                  </p>
                  <label className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold px-8 py-4 rounded-full cursor-pointer transition-all transform hover:scale-105">
                    {uploadingPhoto ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        Enviar Minha Foto
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={uploadingPhoto}
                    />
                  </label>
                </div>
              )}
            </div>

            {modules.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <BookOpen className="w-16 h-16 text-pink-300 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Conteúdo em Breve
                </h2>
                <p className="text-gray-600">
                  Os módulos do curso estão sendo preparados. Em breve você terá acesso a todo o conteúdo!
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((module) => {
                  const lessonCount = lessons.filter(l => l.module_id === module.id).length;
                  return (
                    <div
                      key={module.id}
                      onClick={() => setSelectedModule(module.id)}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow group"
                    >
                      <div className="aspect-video bg-gradient-to-br from-pink-200 to-rose-300 relative">
                        {module.cover_url && (
                          <img
                            src={module.cover_url}
                            alt={module.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900">{module.title}</h3>
                        {module.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{module.description}</p>
                        )}
                        <p className="text-xs text-pink-600 mt-2">{lessonCount} aulas</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Module Lessons Modal */}
            {selectedModule && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">
                      {modules.find(m => m.id === selectedModule)?.title}
                    </h2>
                    <button
                      onClick={() => setSelectedModule(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {moduleLessons.length === 0 ? (
                      <p className="text-gray-600 text-center py-8">
                        Nenhuma aula disponível ainda
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {moduleLessons.map((lesson, index) => (
                          <button
                            key={lesson.id}
                            onClick={() => {
                              setSelectedLesson(lesson);
                              setSelectedModule(null);
                            }}
                            className="w-full flex items-center gap-4 p-4 bg-pink-50 hover:bg-pink-100 rounded-xl transition-colors text-left"
                          >
                            <div className="w-10 h-10 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                              {lesson.duration_minutes && (
                                <p className="text-sm text-gray-500">{lesson.duration_minutes} min</p>
                              )}
                            </div>
                            <Play className="w-5 h-5 text-pink-500" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
