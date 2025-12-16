import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Plus
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

export default function SpotMusicAdmin() {
  const { user, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [albums, setAlbums] = useState<Album[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Album form
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumArtist, setAlbumArtist] = useState('');
  const [albumCoverUrl, setAlbumCoverUrl] = useState('');
  const [albumGenre, setAlbumGenre] = useState('');
  const [albumYear, setAlbumYear] = useState('');

  // Track form
  const [trackTitle, setTrackTitle] = useState('');
  const [trackArtist, setTrackArtist] = useState('');
  const [trackAudioUrl, setTrackAudioUrl] = useState('');
  const [trackAlbumId, setTrackAlbumId] = useState('');
  const [trackDuration, setTrackDuration] = useState('');

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
      fetchAlbums();
    }
    setIsSubmitting(false);
  };

  const handleAddTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackTitle || !trackArtist || !trackAudioUrl) {
      toast({ title: 'Preencha título, artista e URL do áudio', variant: 'destructive' });
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
            <p className="text-spotmusic-muted">Gerencie álbuns e músicas</p>
          </div>
        </header>

        <Tabs defaultValue="albums" className="space-y-6">
          <TabsList className="bg-spotmusic-card border-spotmusic-border">
            <TabsTrigger value="albums" className="data-[state=active]:bg-spotmusic-green data-[state=active]:text-spotmusic-dark">
              <Disc className="w-4 h-4 mr-2" />
              Álbuns
            </TabsTrigger>
            <TabsTrigger value="tracks" className="data-[state=active]:bg-spotmusic-green data-[state=active]:text-spotmusic-dark">
              <Music className="w-4 h-4 mr-2" />
              Músicas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="albums" className="space-y-6">
            {/* Add Album Form */}
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
                  <div className="space-y-2">
                    <Label className="text-spotmusic-foreground">URL da Capa (VPS)</Label>
                    <Input
                      value={albumCoverUrl}
                      onChange={(e) => setAlbumCoverUrl(e.target.value)}
                      placeholder="https://seu-vps.com/capas/album.jpg"
                      className="bg-spotmusic-dark border-spotmusic-border text-spotmusic-foreground"
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
                  <div className="flex items-end">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-spotmusic-green hover:bg-spotmusic-green/90 text-spotmusic-dark"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                      Adicionar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Albums List */}
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

          <TabsContent value="tracks" className="space-y-6">
            {/* Add Track Form */}
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
                    <Label className="text-spotmusic-foreground">URL do Áudio (VPS) *</Label>
                    <Input
                      value={trackAudioUrl}
                      onChange={(e) => setTrackAudioUrl(e.target.value)}
                      placeholder="https://seu-vps.com/musicas/track.mp3"
                      className="bg-spotmusic-dark border-spotmusic-border text-spotmusic-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-spotmusic-foreground">Álbum</Label>
                    <select
                      value={trackAlbumId}
                      onChange={(e) => setTrackAlbumId(e.target.value)}
                      className="w-full h-10 px-3 rounded-md bg-spotmusic-dark border border-spotmusic-border text-spotmusic-foreground"
                    >
                      <option value="">Selecione um álbum (opcional)</option>
                      {albums.map((album) => (
                        <option key={album.id} value={album.id}>{album.title} - {album.artist}</option>
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
                      disabled={isSubmitting}
                      className="bg-spotmusic-green hover:bg-spotmusic-green/90 text-spotmusic-dark"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                      Adicionar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Tracks List */}
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
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-spotmusic-foreground truncate">{track.title}</h4>
                        <p className="text-sm text-spotmusic-muted truncate">{track.artist}</p>
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
        </Tabs>
      </div>
    </div>
  );
}
