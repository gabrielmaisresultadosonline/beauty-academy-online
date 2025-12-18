import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  QrCode,
  MessageCircle,
  GitBranch,
  Calendar,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type ActiveView = "dashboard" | "connections" | "conversations" | "flows" | "scheduled" | "contacts" | "settings";

interface WhatsAppSidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "connections", label: "Conexões", icon: QrCode },
  { id: "conversations", label: "Conversas", icon: MessageCircle },
  { id: "flows", label: "Automações", icon: GitBranch },
  { id: "scheduled", label: "Agendamento", icon: Calendar },
  { id: "contacts", label: "Contatos", icon: Users },
  { id: "settings", label: "Configurações", icon: Settings },
] as const;

export const WhatsAppSidebar = ({ activeView, setActiveView }: WhatsAppSidebarProps) => {
  const { signOut, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Logout realizado com sucesso!");
  };

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } min-h-screen bg-[#111814]/90 backdrop-blur-xl border-r border-[#25D366]/10 flex flex-col transition-all duration-300`}
    >
      {/* Header */}
      <div className="p-4 border-b border-[#25D366]/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h2 className="font-bold text-white text-lg">WhatsApp CRM</h2>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ActiveView)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-[#25D366]/20 text-[#25D366] shadow-lg shadow-[#25D366]/10"
                  : "text-gray-400 hover:bg-[#25D366]/10 hover:text-white"
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-[#25D366]" : ""}`} />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-[#25D366]/10 space-y-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:text-white hover:bg-[#25D366]/10 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          {!collapsed && <span className="text-sm">Recolher menu</span>}
        </button>

        <Button
          onClick={handleSignOut}
          variant="ghost"
          className={`w-full ${collapsed ? "px-0 justify-center" : ""} text-red-400 hover:text-red-300 hover:bg-red-500/10`}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="ml-2">Sair</span>}
        </Button>
      </div>
    </aside>
  );
};
