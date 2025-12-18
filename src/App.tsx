import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import PlatformAuth from "./pages/PlatformAuth";
import ClientDashboard from "./pages/ClientDashboard";
import ClientAdmin from "./pages/ClientAdmin";
import ClientObrigado from "./pages/ClientObrigado";
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
import DemoLogin from "./pages/DemoLogin";
import DemoAdmin from "./pages/DemoAdmin";
import DemoMembro from "./pages/DemoMembro";
import CRMWhatsApp from "./pages/CRMWhatsApp";
import WhatsAppCRM from "./pages/WhatsAppCRM";
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
            <Route path="/cliente/auth" element={<PlatformAuth />} />
            <Route path="/cliente/dashboard" element={<ClientDashboard />} />
            <Route path="/cliente/admin" element={<ClientAdmin />} />
            <Route path="/cliente/obrigado" element={<ClientObrigado />} />
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
            <Route path="/demonstracao" element={<DemoLogin />} />
            <Route path="/demonstracao/admin" element={<DemoAdmin />} />
            <Route path="/demonstracao/membro" element={<DemoMembro />} />
            <Route path="/crmwhats" element={<CRMWhatsApp />} />
            <Route path="/whatsppcrm" element={<WhatsAppCRM />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
