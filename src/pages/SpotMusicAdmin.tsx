import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Music, 
  Disc, 
  Upload, 
  Trash2, 
  ArrowLeft,
  Loader2,
  Plus,
  Image as ImageIcon,
  FileAudio,
  BarChart3,
  Users,
  Settings,
  Save,
  CreditCard
} from 'lucide-react';

interface Album {
  id: string;
  title: string;
  artist: string;
  cover_url: string | null;
  genre: string | null;
  release_year: number | null;
}

interface Track {
  id: string;
  title: string;
  artist: string;
  audio_url: string;
  album_id: string | null;
}

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  is_premium: boolean;
  created_at: string;
}

export default function SpotMusicAdmin() {
  const { user, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [albums, setAlbums] = useState<Album[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);

  // Settings
  const [pixelCode, setPixelCode] = useState('');
  const [paymentLink, setPaymentLink] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  // Album form
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumArtist, setAlbumArtist] = useState('');
  const [albumCoverUrl, setAlbumCoverUrl] = useState('');
  const [albumGenre, setAlbumGenre] = useState('');
  const [albumYear, setAlbumYear] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);

  // Track form
  const [trackTitle, setTrackTitle] = useState('');
  const [trackArtist, setTrackArtist] = useState('');
  const [trackAudioUrl, setTrackAudioUrl] = useState('');
  const [trackAlbumId, setTrackAlbumId] = useState('');
  const [trackDuration, setTrackDuration] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/comunidademusica/login');
    } else if (!isLoading && !isAdmin) {
      navigate('/comunidademusica/dashboard');
    }
  }, [user, isLoading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchAlbums();
      fetchTracks();
      fetchProfiles();
      loadSettings();
    }
  }, [isAdmin]);

  const fetchAlbums = async () => {
    const { data } = await supabase
      .from('albums')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setAlbums(data);
  };

  const fetchTracks = async () => {
    const { data } = await supabase
      .from('tracks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setTracks(data);
  };

  const fetchProfiles = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setProfiles(data);
  };

  const loadSettings = async () => {
    const { data } = await supabase
      .from('platform_settings')
      .select('facebook_pixel_code, infinitepay_link')
      .eq('product_slug', 'comunidademusica')
      .maybeSingle();
    
    if (data) {
      setPixelCode(data.facebook_pixel_code || '');
      setPaymentLink(data.infinitepay_link || '');
    }
  };

  const saveSettings = async () => {
    setSavingSettings(true);
    const { error } = await supabase
      .from('platform_settings')
      .update({ 
        facebook_pixel_code: pixelCode,
        infinitepay_link: paymentLink
      })
      .eq('product_slug', 'comunidademusica');

    if (error) {
      toast({ title: "Erro ao salvar configurações", variant: "destructive" });
    } else {
      toast({ title: "Configurações salvas com sucesso!" });
    }
    setSavingSettings(false);
  };

  const uploadCoverImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('album-covers')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading cover:', error);
      toast({ title: 'Erro ao fazer upload da capa', description: error.message, variant: 'destructive' });
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('album-covers')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const uploadAudioFile = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('music-files')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading audio:', error);
      toast({ title: 'Erro ao fazer upload do áudio', description: error.message, variant: 'destructive' });
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('music-files')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleCoverFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverFile(file);
    setUploadingCover(true);
    
    const url = await uploadCoverImage(file);
    if (url) {
      setAlbumCoverUrl(url);
      toast({ title: 'Capa carregada com sucesso!' });
    }
    
    setUploadingCover(false);
  };

  const handleAudioFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioFile(file);
    setUploadingAudio(true);
    
    const url = await uploadAudioFile(file);
    if (url) {
      setTrackAudioUrl(url);
      toast({ title: 'Áudio carregado com sucesso!' });
    }
    
    setUploadingAudio(false);
  };

  const handleAddAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumTitle || !albumArtist) {
      toast({ title: 'Preencha título e artista', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from('albums').insert({
      title: albumTitle,
      artist: albumArtist,
      cover_url: albumCoverUrl || null,
      genre: albumGenre || null,
      release_year: albumYear ? parseInt(albumYear) : null,
      created_by: user?.id
    });

    if (error) {
      toast({ title: 'Erro ao adicionar álbum', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Álbum adicionado com sucesso!' });
      setAlbumTitle('');
      setAlbumArtist('');
      setAlbumCoverUrl('');
      setAlbumGenre('');
      setAlbumYear('');
      setCoverFile(null);
      if (coverInputRef.current) coverInputRef.current.value = '';
      fetchAlbums();
    }
    setIsSubmitting(false);
  };

  const handleAddTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackTitle || !trackArtist || !trackAudioUrl) {
      toast({ title: 'Preencha título, artista e áudio', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from('tracks').insert({
      title: trackTitle,
      artist: trackArtist,
      audio_url: trackAudioUrl,
      album_id: trackAlbumId || null,
      duration_seconds: trackDuration ? parseInt(trackDuration) : null
    });

    if (error) {
      toast({ title: 'Erro ao adicionar música', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Música adicionada com sucesso!' });
      setTrackTitle('');
      setTrackArtist('');
      setTrackAudioUrl('');
      setTrackAlbumId('');
      setTrackDuration('');
      setAudioFile(null);
      if (audioInputRef.current) audioInputRef.current.value = '';
      fetchTracks();
    }
    setIsSubmitting(false);
  };

  const handleDeleteAlbum = async (id: string) => {
    const { error } = await supabase.from('albums').delete().eq('id', id);
    if (error) {
      toast({ title: 'Erro ao deletar', variant: 'destructive' });
    } else {
      toast({ title: 'Álbum deletado' });
      fetchAlbums();
      fetchTracks();
    }
  };

  const handleDeleteTrack = async (id: string) => {
    const { error } = await supabase.from('tracks').delete().eq('id', id);
    if (error) {
      toast({ title: 'Erro ao deletar', variant: 'destructive' });
    } else {
      toast({ title: 'Música deletada' });
      fetchTracks();
    }
  };

  // Stats
  const totalUsers = profiles.length;
  const premiumUsers = profiles.filter(p => p.is_premium).length;
  const pendingUsers = totalUsers - premiumUsers;

  if (isLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-spotmusic-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-spotmusic-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-spotmusic-dark p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/comunidademusica/dashboard')}
            className="text-spotmusic-muted hover:text-spotmusic-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-spotmusic-foreground">Painel Admin</h1>
            <p className="text-spotmusic-muted">Gerencie álbuns, músicas e configurações</p>
          </div>
        </header>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-spotmusic-card border-spotmusic-border">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-spotmusic-green data-[state=active]:text-spotmusic-dark">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="albums" className="data-[state=active]:bg-spotmusic-green data-[state=active]:text-spotmusic-dark">
              <Disc className="w-4 h-4 mr-2" />
              Álbuns
            </TabsTrigger>
            <TabsTrigger value="tracks" className="data-[state=active]:bg-spotmusic-green data-[state=active]:text-spotmusic-dark">
              <Music className="w-4 h-4 mr-2" />
              Músicas
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-spotmusic-green data-[state=active]:text-spotmusic-dark">
              <Users className="w-4 h-4 mr-2" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-spotmusic-green data-[state=active]:text-spotmusic-dark">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <h2 className="text-xl font-bold text-spotmusic-foreground">Dashboard de Vendas</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-spotmusic-card border-spotmusic-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-spotmusic-muted">Total de Usuários</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-spotmusic-foreground">{totalUsers}</div>
                  <p className="text-xs text-spotmusic-muted mt-1">cadastrados na plataforma</p>
                </CardContent>
              </Card>

              <Card className="bg-spotmusic-card border-spotmusic-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-spotmusic-green">Compras Aprovadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-spotmusic-green">{premiumUsers}</div>
                  <p className="text-xs text-spotmusic-muted mt-1">usuários premium ativos</p>
                </CardContent>
              </Card>

              <Card className="bg-spotmusic-card border-spotmusic-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-amber-500">Pendentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-500">{pendingUsers}</div>
                  <p className="text-xs text-spotmusic-muted mt-1">aguardando pagamento</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-spotmusic-card border-spotmusic-border">
              <CardHeader>
                <CardTitle className="text-spotmusic-foreground">Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {profiles.slice(0, 10).map((profile) => (
                    <div key={profile.id} className="flex items-center justify-between p-3 bg-spotmusic-dark rounded-lg">
                      <div>
                        <p className="font-medium text-spotmusic-foreground">{profile.full_name || 'Usuário'}</p>
                        <p className="text-sm text-spotmusic-muted">{profile.email}</p>
                      </div>
                      <div className="text-right">
                        {profile.is_premium ? (
                          <span className="px-2 py-1 bg-spotmusic-green/20 text-spotmusic-green text-xs rounded-full">Pago</span>
                        ) : (
                          <span className="px-2 py-1 bg-amber-500/20 text-amber-500 text-xs rounded-full">Pendente</span>
                        )}
                        <p className="text-xs text-spotmusic-muted mt-1">
                          {new Date(profile.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Albums Tab */}
          <TabsContent value="albums" className="space-y-6">
            <Card className="bg-spotmusic-card border-spotmusic-border">
              <CardHeader>
                <CardTitle className="text-spotmusic-foreground flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Adicionar Álbum
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddAlbum} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-spotmusic-foreground">Título *</Label>
                    <Input
                      value={albumTitle}
                      onChange={(e) => setAlbumTitle(e.target.value)}
                      placeholder="Nome do álbum"
                      className="bg-spotmusic-dark border-spotmusic-border text-spotmusic-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-spotmusic-foreground">Artista *</Label>
                    <Input
                      value={albumArtist}
                      onChange={(e) => setAlbumArtist(e.target.value)}
                      placeholder="Nome do artista"
                      className="bg-spotmusic-dark border-spotmusic-border text-spotmusic-foreground"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-spotmusic-foreground">Capa do Álbum</Label>
                    <div className="flex gap-4 items-center">
                      <input
                        ref={coverInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleCoverFileChange}
                        className="hidden"
                        id="cover-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => coverInputRef.current?.click()}
                        disabled={uploadingCover}
                        className="border-spotmusic-border text-spotmusic-foreground hover:bg-spotmusic-dark"
                      >
                        {uploadingCover ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <ImageIcon className="w-4 h-4 mr-2" />
                        )}
                        {uploadingCover ? 'Enviando...' : 'Selecionar Imagem'}
                      </Button>
                      {coverFile && (
                        <span className="text-sm text-spotmusic-muted truncate max-w-[200px]">
                          {coverFile.name}
                        </span>
                      )}
                      {albumCoverUrl && !coverFile && (
                        <span className="text-sm text-spotmusic-green">✓ Imagem carregada</span>
                      )}
                    </div>
                    <Input
                      value={albumCoverUrl}
                      onChange={(e) => setAlbumCoverUrl(e.target.value)}
                      placeholder="Ou cole uma URL externa"
                      className="bg-spotmusic-dark border-spotmusic-border text-spotmusic-foreground mt-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-spotmusic-foreground">Gênero</Label>
                    <Input
                      value={albumGenre}
                      onChange={(e) => setAlbumGenre(e.target.value)}
                      placeholder="Pop, Rock, Eletrônico..."
                      className="bg-spotmusic-dark border-spotmusic-border text-spotmusic-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-spotmusic-foreground">Ano</Label>
                    <Input
                      value={albumYear}
                      onChange={(e) => setAlbumYear(e.target.value)}
                      placeholder="2024"
                      type="number"
                      className="bg-spotmusic-dark border-spotmusic-border text-spotmusic-foreground"
                    />
                  </div>
                  <div className="flex items-end md:col-span-2">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || uploadingCover}
                      className="bg-spotmusic-green hover:bg-spotmusic-green/90 text-spotmusic-dark"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                      Adicionar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-spotmusic-card border-spotmusic-border">
              <CardHeader>
                <CardTitle className="text-spotmusic-foreground">Álbuns ({albums.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {albums.map((album) => (
                    <div 
                      key={album.id}
                      className="flex items-center gap-4 p-3 bg-spotmusic-dark rounded-lg"
                    >
                      <div className="w-12 h-12 bg-spotmusic-card rounded overflow-hidden">
                        {album.cover_url ? (
                          <img src={album.cover_url} alt={album.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Disc className="w-6 h-6 text-spotmusic-muted" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-spotmusic-foreground">{album.title}</h4>
                        <p className="text-sm text-spotmusic-muted">{album.artist}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteAlbum(album.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {albums.length === 0 && (
                    <p className="text-center text-spotmusic-muted py-8">Nenhum álbum cadastrado</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tracks Tab */}
          <TabsContent value="tracks" className="space-y-6">
            <Card className="bg-spotmusic-card border-spotmusic-border">
              <CardHeader>
                <CardTitle className="text-spotmusic-foreground flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Adicionar Música
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddTrack} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-spotmusic-foreground">Título *</Label>
                    <Input
                      value={trackTitle}
                      onChange={(e) => setTrackTitle(e.target.value)}
                      placeholder="Nome da música"
                      className="bg-spotmusic-dark border-spotmusic-border text-spotmusic-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-spotmusic-foreground">Artista *</Label>
                    <Input
                      value={trackArtist}
                      onChange={(e) => setTrackArtist(e.target.value)}
                      placeholder="Nome do artista"
                      className="bg-spotmusic-dark border-spotmusic-border text-spotmusic-foreground"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-spotmusic-foreground">Arquivo de Áudio *</Label>
                    <div className="flex gap-4 items-center">
                      <input
                        ref={audioInputRef}
                        type="file"
                        accept="audio/mpeg,audio/ogg,audio/wav"
                        onChange={handleAudioFileChange}
                        className="hidden"
                        id="audio-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => audioInputRef.current?.click()}
                        disabled={uploadingAudio}
                        className="border-spotmusic-border text-spotmusic-foreground hover:bg-spotmusic-dark"
                      >
                        {uploadingAudio ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <FileAudio className="w-4 h-4 mr-2" />
                        )}
                        {uploadingAudio ? 'Enviando...' : 'Selecionar Áudio'}
                      </Button>
                      {audioFile && (
                        <span className="text-sm text-spotmusic-muted truncate max-w-[200px]">
                          {audioFile.name}
                        </span>
                      )}
                      {trackAudioUrl && !audioFile && (
                        <span className="text-sm text-spotmusic-green">✓ Áudio carregado</span>
                      )}
                    </div>
                    <Input
                      value={trackAudioUrl}
                      onChange={(e) => setTrackAudioUrl(e.target.value)}
                      placeholder="Ou cole uma URL externa"
                      className="bg-spotmusic-dark border-spotmusic-border text-spotmusic-foreground mt-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-spotmusic-foreground">Álbum</Label>
                    <select
                      value={trackAlbumId}
                      onChange={(e) => setTrackAlbumId(e.target.value)}
                      className="w-full p-2 rounded-md bg-spotmusic-dark border border-spotmusic-border text-spotmusic-foreground"
                    >
                      <option value="">Sem álbum</option>
                      {albums.map((album) => (
                        <option key={album.id} value={album.id}>
                          {album.title} - {album.artist}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-spotmusic-foreground">Duração (segundos)</Label>
                    <Input
                      value={trackDuration}
                      onChange={(e) => setTrackDuration(e.target.value)}
                      placeholder="180"
                      type="number"
                      className="bg-spotmusic-dark border-spotmusic-border text-spotmusic-foreground"
                    />
                  </div>
                  <div className="flex items-end md:col-span-2">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || uploadingAudio}
                      className="bg-spotmusic-green hover:bg-spotmusic-green/90 text-spotmusic-dark"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                      Adicionar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-spotmusic-card border-spotmusic-border">
              <CardHeader>
                <CardTitle className="text-spotmusic-foreground">Músicas ({tracks.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tracks.map((track) => (
                    <div 
                      key={track.id}
                      className="flex items-center gap-4 p-3 bg-spotmusic-dark rounded-lg"
                    >
                      <div className="w-10 h-10 bg-spotmusic-card rounded flex items-center justify-center">
                        <Music className="w-5 h-5 text-spotmusic-muted" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-spotmusic-foreground">{track.title}</h4>
                        <p className="text-sm text-spotmusic-muted">{track.artist}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteTrack(track.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {tracks.length === 0 && (
                    <p className="text-center text-spotmusic-muted py-8">Nenhuma música cadastrada</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <h2 className="text-xl font-bold text-spotmusic-foreground">Usuários Cadastrados</h2>
            
            <Card className="bg-spotmusic-card border-spotmusic-border">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-spotmusic-dark">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-spotmusic-muted uppercase">Nome</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-spotmusic-muted uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-spotmusic-muted uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-spotmusic-muted uppercase">Data</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-spotmusic-border">
                      {profiles.map((profile) => (
                        <tr key={profile.id}>
                          <td className="px-6 py-4 text-sm text-spotmusic-foreground">
                            {profile.full_name || '-'}
                          </td>
                          <td className="px-6 py-4 text-sm text-spotmusic-muted">
                            {profile.email}
                          </td>
                          <td className="px-6 py-4">
                            {profile.is_premium ? (
                              <span className="px-2 py-1 bg-spotmusic-green/20 text-spotmusic-green text-xs rounded-full">Premium</span>
                            ) : (
                              <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">Grátis</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-spotmusic-muted">
                            {new Date(profile.created_at).toLocaleDateString('pt-BR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-xl font-bold text-spotmusic-foreground">Configurações</h2>
            
            {/* Payment Link */}
            <Card className="bg-spotmusic-card border-spotmusic-border">
              <CardHeader>
                <CardTitle className="text-spotmusic-foreground flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Link de Pagamento InfinitePay
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-spotmusic-muted">
                  Cole o link completo do InfinitePay para receber pagamentos. Gere o link no painel do InfinitePay.
                </p>
                <Input
                  value={paymentLink}
                  onChange={(e) => setPaymentLink(e.target.value)}
                  placeholder="https://checkout.infinitepay.io/seuusuario?items=[...]"
                  className="font-mono text-xs bg-spotmusic-dark border-spotmusic-border text-spotmusic-foreground"
                />
                <div className="bg-spotmusic-green/10 border border-spotmusic-green/30 rounded-lg p-4">
                  <p className="text-sm font-medium text-spotmusic-green mb-2">URL de Redirecionamento (Obrigado)</p>
                  <p className="text-xs text-spotmusic-foreground font-mono bg-spotmusic-dark p-2 rounded border border-spotmusic-border">
                    https://acessar.click/comunidademusica/obrigado
                  </p>
                  <p className="text-xs text-spotmusic-muted mt-2">
                    Configure esta URL no campo "redirect_url" do seu link InfinitePay.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Facebook Pixel */}
            <Card className="bg-spotmusic-card border-spotmusic-border">
              <CardHeader>
                <CardTitle className="text-spotmusic-foreground flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Facebook Pixel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-spotmusic-muted">
                  Cole o código completo do seu Facebook Pixel abaixo. O pixel será carregado automaticamente em todas as páginas do SpotMusic.
                </p>
                <Textarea
                  value={pixelCode}
                  onChange={(e) => setPixelCode(e.target.value)}
                  placeholder={`<!-- Meta Pixel Code -->\n<script>...</script>\n<noscript>...</noscript>\n<!-- End Meta Pixel Code -->`}
                  className="font-mono text-xs min-h-[200px] bg-spotmusic-dark border-spotmusic-border text-spotmusic-foreground"
                />
              </CardContent>
            </Card>

            <Button onClick={saveSettings} disabled={savingSettings} className="bg-spotmusic-green hover:bg-spotmusic-green/90 text-spotmusic-dark">
              {savingSettings ? (
                <>Salvando...</>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Configurações
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
