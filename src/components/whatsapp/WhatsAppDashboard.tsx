import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  MessageCircle,
  Users,
  QrCode,
  GitBranch,
  TrendingUp,
  Clock,
  CheckCircle2,
  Send,
} from "lucide-react";

interface Stats {
  totalConversations: number;
  totalContacts: number;
  totalConnections: number;
  totalFlows: number;
  messagesTotal: number;
  messagesSent: number;
  messagesReceived: number;
}

export const WhatsAppDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalConversations: 0,
    totalContacts: 0,
    totalConnections: 0,
    totalFlows: 0,
    messagesTotal: 0,
    messagesSent: 0,
    messagesReceived: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        const [conversations, contacts, connections, flows, messages] = await Promise.all([
          supabase.from("whatsapp_conversations").select("id", { count: "exact" }).eq("user_id", user.id),
          supabase.from("whatsapp_contacts").select("id", { count: "exact" }).eq("user_id", user.id),
          supabase.from("whatsapp_connections").select("id", { count: "exact" }).eq("user_id", user.id),
          supabase.from("whatsapp_flows").select("id", { count: "exact" }).eq("user_id", user.id),
          supabase.from("whatsapp_messages").select("direction", { count: "exact" }).eq("user_id", user.id),
        ]);

        const sentMessages = messages.data?.filter((m) => m.direction === "outgoing").length || 0;
        const receivedMessages = messages.data?.filter((m) => m.direction === "incoming").length || 0;

        setStats({
          totalConversations: conversations.count || 0,
          totalContacts: contacts.count || 0,
          totalConnections: connections.count || 0,
          totalFlows: flows.count || 0,
          messagesTotal: messages.count || 0,
          messagesSent: sentMessages,
          messagesReceived: receivedMessages,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const statCards = [
    {
      label: "Conversas",
      value: stats.totalConversations,
      icon: MessageCircle,
      color: "from-[#25D366] to-[#128C7E]",
      bgColor: "bg-[#25D366]/10",
    },
    {
      label: "Contatos",
      value: stats.totalContacts,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Conexões",
      value: stats.totalConnections,
      icon: QrCode,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Automações",
      value: stats.totalFlows,
      icon: GitBranch,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-500/10",
    },
  ];

  const messageStats = [
    {
      label: "Mensagens Enviadas",
      value: stats.messagesSent,
      icon: Send,
      color: "text-[#25D366]",
    },
    {
      label: "Mensagens Recebidas",
      value: stats.messagesReceived,
      icon: MessageCircle,
      color: "text-blue-400",
    },
    {
      label: "Total de Mensagens",
      value: stats.messagesTotal,
      icon: CheckCircle2,
      color: "text-purple-400",
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Visão geral das suas atividades no WhatsApp CRM</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-[#111814]/80 backdrop-blur-xl border border-[#25D366]/10 rounded-2xl p-6 hover:border-[#25D366]/30 transition-all duration-300 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} style={{ color: stat.color.includes("25D366") ? "#25D366" : undefined }} />
                </div>
                <TrendingUp className="w-5 h-5 text-[#25D366] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white">
                {loading ? (
                  <span className="inline-block w-16 h-8 bg-gray-700 rounded animate-pulse" />
                ) : (
                  stat.value
                )}
              </p>
            </div>
          );
        })}
      </div>

      {/* Message Stats */}
      <div className="bg-[#111814]/80 backdrop-blur-xl border border-[#25D366]/10 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#25D366]" />
          Estatísticas de Mensagens
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {messageStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex items-center gap-4 p-4 bg-[#0a0f0d] rounded-xl"
              >
                <div className="p-3 rounded-lg bg-[#111814]">
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">
                    {loading ? (
                      <span className="inline-block w-12 h-6 bg-gray-700 rounded animate-pulse" />
                    ) : (
                      stat.value
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#111814]/80 backdrop-blur-xl border border-[#25D366]/10 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Ações Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Nova Conexão", icon: QrCode, color: "hover:bg-[#25D366]/20 hover:border-[#25D366]/50" },
            { label: "Nova Conversa", icon: MessageCircle, color: "hover:bg-blue-500/20 hover:border-blue-500/50" },
            { label: "Novo Fluxo", icon: GitBranch, color: "hover:bg-purple-500/20 hover:border-purple-500/50" },
            { label: "Novo Contato", icon: Users, color: "hover:bg-orange-500/20 hover:border-orange-500/50" },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                className={`flex flex-col items-center gap-3 p-6 rounded-xl border border-[#25D366]/10 bg-[#0a0f0d] transition-all duration-300 ${action.color}`}
              >
                <Icon className="w-8 h-8 text-gray-400" />
                <span className="text-gray-300 text-sm font-medium">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
