import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import BelezaLisoPerfeito from "./pages/BelezaLisoPerfeito";
import BelezaLogin from "./pages/BelezaLogin";
import BelezaDashboard from "./pages/BelezaDashboard";
import BelezaAdmin from "./pages/BelezaAdmin";
import BelezaObrigado from "./pages/BelezaObrigado";
import ComunidadeMusica from "./pages/ComunidadeMusica";
import SpotMusicLogin from "./pages/SpotMusicLogin";
import SpotMusicDashboard from "./pages/SpotMusicDashboard";
import SpotMusicAdmin from "./pages/SpotMusicAdmin";
import SpotMusicObrigado from "./pages/SpotMusicObrigado";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/belezalisoperfeito" element={<BelezaLisoPerfeito />} />
            <Route path="/belezalisoperfeito/login" element={<BelezaLogin />} />
            <Route path="/belezalisoperfeito/dashboard" element={<BelezaDashboard />} />
            <Route path="/belezalisoperfeito/admin" element={<BelezaAdmin />} />
            <Route path="/belezalisoperfeito/obrigado" element={<BelezaObrigado />} />
            <Route path="/comunidademusica" element={<ComunidadeMusica />} />
            <Route path="/comunidademusica/login" element={<SpotMusicLogin />} />
            <Route path="/comunidademusica/dashboard" element={<SpotMusicDashboard />} />
            <Route path="/comunidademusica/admin" element={<SpotMusicAdmin />} />
            <Route path="/comunidademusica/obrigado" element={<SpotMusicObrigado />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
