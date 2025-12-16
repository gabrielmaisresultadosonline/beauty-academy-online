import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Music, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2,
  Home,
  Search,
  Library,
  Crown,
  LogOut,
  Settings,
  Loader2
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface Album {
  id: string;
  title: string;
  artist: string;
  cover_url: string | null;
  genre: string | null;
}

interface Track {
  id: string;
  title: string;
  artist: string;
  audio_url: string;
  duration_seconds: number | null;
  album_id: string | null;
}

export default function SpotMusicDashboard() {
  const { user, isLoading, isPremium, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([80]);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/comunidademusica/login');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (isPremium || isAdmin) {
      fetchAlbums();
      fetchTracks();
    }
  }, [isPremium, isAdmin]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

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

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setProgress(value[0]);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/comunidademusica');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-spotmusic-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-spotmusic-green animate-spin" />
      </div>
    );
  }

  // Show upgrade prompt if not premium
  if (!isPremium && !isAdmin) {
    return (
      <div className="min-h-screen bg-spotmusic-dark flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-spotmusic-card border-spotmusic-border text-center">
          <CardContent className="p-8 space-y-6">
            <Crown className="w-16 h-16 text-spotmusic-amber mx-auto" />
            <h2 className="text-2xl font-bold text-spotmusic-foreground">Acesso Premium Necessário</h2>
            <p className="text-spotmusic-muted">
              Para acessar todo o conteúdo do SpotMusic, você precisa ativar seu acesso premium.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => {
                  const link = `https://checkout.infinitepay.io/paguemro?items=[{"name":"SPOTMUSIC","price":4700,"quantity":1}]&redirect_url=${encodeURIComponent(window.location.origin + '/comunidademusica/obrigado')}`;
                  window.location.href = link;
                }}
                className="w-full bg-spotmusic-green hover:bg-spotmusic-green/90 text-spotmusic-dark font-semibold"
              >
                Ativar Premium - R$47,00
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleSignOut}
                className="w-full text-spotmusic-muted hover:text-spotmusic-foreground"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-spotmusic-dark flex">
      {/* Audio Element */}
      {currentTrack && (
        <audio
          ref={audioRef}
          src={currentTrack.audio_url}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          autoPlay
        />
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-spotmusic-darker p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <Music className="w-8 h-8 text-spotmusic-green" />
          <span className="text-xl font-bold text-spotmusic-foreground">
            Spot<span className="text-spotmusic-green">Music</span>
          </span>
        </div>
        
        <nav className="space-y-2">
          <button className="flex items-center gap-3 text-spotmusic-foreground hover:text-spotmusic-green transition-colors w-full p-2 rounded-lg hover:bg-spotmusic-card">
            <Home className="w-5 h-5" />
            Início
          </button>
          <button className="flex items-center gap-3 text-spotmusic-muted hover:text-spotmusic-green transition-colors w-full p-2 rounded-lg hover:bg-spotmusic-card">
            <Search className="w-5 h-5" />
            Buscar
          </button>
          <button className="flex items-center gap-3 text-spotmusic-muted hover:text-spotmusic-green transition-colors w-full p-2 rounded-lg hover:bg-spotmusic-card">
            <Library className="w-5 h-5" />
            Biblioteca
          </button>
        </nav>

        <div className="mt-auto space-y-2">
          {isAdmin && (
            <Button 
              variant="ghost" 
              onClick={() => navigate('/comunidademusica/admin')}
              className="w-full justify-start text-spotmusic-muted hover:text-spotmusic-foreground"
            >
              <Settings className="w-4 h-4 mr-2" />
              Admin
            </Button>
          )}
          <Button 
            variant="ghost" 
            onClick={handleSignOut}
            className="w-full justify-start text-spotmusic-muted hover:text-spotmusic-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-spotmusic-foreground mb-2">
              Olá, {user?.user_metadata?.full_name || 'Usuário'}!
            </h1>
            <p className="text-spotmusic-muted">
              {isPremium && <span className="text-spotmusic-amber flex items-center gap-1"><Crown className="w-4 h-4" /> Premium</span>}
            </p>
          </header>

          {/* Albums Section */}
          {albums.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-spotmusic-foreground mb-4">Álbuns</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {albums.map((album) => (
                  <Card 
                    key={album.id} 
                    className="bg-spotmusic-card border-spotmusic-border hover:bg-spotmusic-card/80 transition-colors cursor-pointer group"
                  >
                    <CardContent className="p-4">
                      <div className="aspect-square bg-spotmusic-darker rounded-md mb-3 overflow-hidden relative">
                        {album.cover_url ? (
                          <img 
                            src={album.cover_url} 
                            alt={album.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Music className="w-12 h-12 text-spotmusic-muted" />
                          </div>
                        )}
                        <button className="absolute bottom-2 right-2 w-10 h-10 bg-spotmusic-green rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                          <Play className="w-5 h-5 text-spotmusic-dark ml-0.5" />
                        </button>
                      </div>
                      <h3 className="font-semibold text-spotmusic-foreground truncate">{album.title}</h3>
                      <p className="text-sm text-spotmusic-muted truncate">{album.artist}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Tracks Section */}
          {tracks.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-spotmusic-foreground mb-4">Músicas</h2>
              <div className="space-y-2">
                {tracks.map((track, index) => (
                  <div 
                    key={track.id}
                    onClick={() => playTrack(track)}
                    className={`flex items-center gap-4 p-3 rounded-lg hover:bg-spotmusic-card cursor-pointer transition-colors ${
                      currentTrack?.id === track.id ? 'bg-spotmusic-card' : ''
                    }`}
                  >
                    <span className="w-6 text-spotmusic-muted text-sm">{index + 1}</span>
                    <div className="w-10 h-10 bg-spotmusic-card rounded flex items-center justify-center">
                      <Music className="w-5 h-5 text-spotmusic-muted" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium truncate ${
                        currentTrack?.id === track.id ? 'text-spotmusic-green' : 'text-spotmusic-foreground'
                      }`}>
                        {track.title}
                      </h4>
                      <p className="text-sm text-spotmusic-muted truncate">{track.artist}</p>
                    </div>
                    <span className="text-spotmusic-muted text-sm">
                      {track.duration_seconds ? formatTime(track.duration_seconds) : '--:--'}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Empty State */}
          {albums.length === 0 && tracks.length === 0 && (
            <div className="text-center py-20">
              <Music className="w-16 h-16 text-spotmusic-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-spotmusic-foreground mb-2">Nenhum conteúdo ainda</h3>
              <p className="text-spotmusic-muted">O catálogo está sendo preparado. Volte em breve!</p>
            </div>
          )}
        </div>
      </main>

      {/* Player Bar */}
      {currentTrack && (
        <footer className="fixed bottom-0 left-0 right-0 bg-spotmusic-darker border-t border-spotmusic-border p-4">
          <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
            {/* Current Track Info */}
            <div className="flex items-center gap-3 w-1/4">
              <div className="w-14 h-14 bg-spotmusic-card rounded flex items-center justify-center">
                <Music className="w-6 h-6 text-spotmusic-muted" />
              </div>
              <div className="min-w-0">
                <h4 className="font-medium text-spotmusic-foreground truncate">{currentTrack.title}</h4>
                <p className="text-sm text-spotmusic-muted truncate">{currentTrack.artist}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center w-2/4">
              <div className="flex items-center gap-4 mb-2">
                <button className="text-spotmusic-muted hover:text-spotmusic-foreground">
                  <SkipBack className="w-5 h-5" />
                </button>
                <button 
                  onClick={togglePlay}
                  className="w-10 h-10 bg-spotmusic-foreground rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-spotmusic-dark" />
                  ) : (
                    <Play className="w-5 h-5 text-spotmusic-dark ml-0.5" />
                  )}
                </button>
                <button className="text-spotmusic-muted hover:text-spotmusic-foreground">
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-2 w-full max-w-md">
                <span className="text-xs text-spotmusic-muted w-10 text-right">{formatTime(progress)}</span>
                <Slider
                  value={[progress]}
                  max={duration || 100}
                  step={1}
                  onValueChange={handleSeek}
                  className="flex-1"
                />
                <span className="text-xs text-spotmusic-muted w-10">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2 w-1/4 justify-end">
              <Volume2 className="w-5 h-5 text-spotmusic-muted" />
              <Slider
                value={volume}
                max={100}
                step={1}
                onValueChange={setVolume}
                className="w-24"
              />
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
