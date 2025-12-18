import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  QrCode,
  Plus,
  Smartphone,
  Wifi,
  WifiOff,
  Trash2,
  RefreshCw,
  X,
} from "lucide-react";

interface Connection {
  id: string;
  name: string;
  phone_number: string | null;
  status: string;
  qr_code: string | null;
  created_at: string;
}

export const WhatsAppConnections = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newConnectionName, setNewConnectionName] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchConnections = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("whatsapp_connections")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setConnections(data || []);
    } catch (error) {
      console.error("Error fetching connections:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, [user]);

  const createConnection = async () => {
    if (!user || !newConnectionName.trim()) return;
    setCreating(true);

    try {
      // Generate a fake QR code for demo purposes
      const fakeQR = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=whatsapp-crm-${Date.now()}`;
      
      const { error } = await supabase.from("whatsapp_connections").insert({
        user_id: user.id,
        name: newConnectionName,
        status: "waiting_qr",
        qr_code: fakeQR,
      });

      if (error) throw error;
      toast.success("Conexão criada! Escaneie o QR Code.");
      setShowModal(false);
      setNewConnectionName("");
      fetchConnections();
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar conexão");
    } finally {
      setCreating(false);
    }
  };

  const deleteConnection = async (id: string) => {
    try {
      const { error } = await supabase
        .from("whatsapp_connections")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Conexão removida!");
      fetchConnections();
    } catch (error: any) {
      toast.error(error.message || "Erro ao remover conexão");
    }
  };

  const simulateConnect = async (id: string) => {
    try {
      const { error } = await supabase
        .from("whatsapp_connections")
        .update({ status: "connected", phone_number: "+55 11 99999-9999" })
        .eq("id", id);

      if (error) throw error;
      toast.success("WhatsApp conectado!");
      fetchConnections();
    } catch (error: any) {
      toast.error(error.message || "Erro ao conectar");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; icon: typeof Wifi }> = {
      connected: { label: "Conectado", color: "bg-[#25D366]/20 text-[#25D366]", icon: Wifi },
      disconnected: { label: "Desconectado", color: "bg-red-500/20 text-red-400", icon: WifiOff },
      waiting_qr: { label: "Aguardando QR", color: "bg-yellow-500/20 text-yellow-400", icon: QrCode },
    };
    const config = statusMap[status] || statusMap.disconnected;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Conexões WhatsApp</h1>
          <p className="text-gray-400">Gerencie suas sessões do WhatsApp</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#22c55e] hover:to-[#0f766e] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Conexão
        </Button>
      </div>

      {/* Connections Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#111814]/80 rounded-2xl p-6 animate-pulse">
              <div className="h-40 bg-gray-700 rounded-xl mb-4" />
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : connections.length === 0 ? (
        <div className="bg-[#111814]/80 backdrop-blur-xl border border-[#25D366]/10 rounded-2xl p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#25D366]/10 flex items-center justify-center">
            <QrCode className="w-10 h-10 text-[#25D366]" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Nenhuma conexão</h3>
          <p className="text-gray-400 mb-6">Crie sua primeira conexão para começar a usar o CRM</p>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#22c55e] hover:to-[#0f766e] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Conexão
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connections.map((connection) => (
            <div
              key={connection.id}
              className="bg-[#111814]/80 backdrop-blur-xl border border-[#25D366]/10 rounded-2xl p-6 hover:border-[#25D366]/30 transition-all duration-300"
            >
              {/* QR Code Area */}
              {connection.status === "waiting_qr" && connection.qr_code ? (
                <div className="bg-white rounded-xl p-4 mb-4">
                  <img
                    src={connection.qr_code}
                    alt="QR Code"
                    className="w-full h-40 object-contain"
                  />
                </div>
              ) : (
                <div className="bg-[#0a0f0d] rounded-xl p-4 mb-4 h-48 flex items-center justify-center">
                  <Smartphone className={`w-16 h-16 ${connection.status === "connected" ? "text-[#25D366]" : "text-gray-600"}`} />
                </div>
              )}

              {/* Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{connection.name}</h3>
                  {getStatusBadge(connection.status)}
                </div>
                {connection.phone_number && (
                  <p className="text-gray-400 text-sm">{connection.phone_number}</p>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {connection.status === "waiting_qr" && (
                    <Button
                      onClick={() => simulateConnect(connection.id)}
                      size="sm"
                      className="flex-1 bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/30"
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Simular Conexão
                    </Button>
                  )}
                  <Button
                    onClick={() => deleteConnection(connection.id)}
                    size="sm"
                    variant="ghost"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111814] border border-[#25D366]/20 rounded-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Nova Conexão</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="connectionName" className="text-gray-300">
                  Nome da conexão
                </Label>
                <Input
                  id="connectionName"
                  placeholder="Ex: WhatsApp Principal"
                  value={newConnectionName}
                  onChange={(e) => setNewConnectionName(e.target.value)}
                  className="mt-2 bg-[#0a0f0d] border-[#25D366]/20 text-white"
                />
              </div>

              <Button
                onClick={createConnection}
                disabled={creating || !newConnectionName.trim()}
                className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#22c55e] hover:to-[#0f766e] text-white"
              >
                {creating ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <QrCode className="w-4 h-4 mr-2" />
                    Gerar QR Code
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
