import { useEffect, useState, useRef } from "react";
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
  Loader2,
} from "lucide-react";

interface Connection {
  id: string;
  name: string;
  phone_number: string | null;
  status: string;
  qr_code: string | null;
  created_at: string;
  session_data: any;
}

export const WhatsAppConnections = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newConnectionName, setNewConnectionName] = useState("");
  const [creating, setCreating] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [currentInstanceId, setCurrentInstanceId] = useState<string | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

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
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [user]);

  const callEvolutionAPI = async (
    action: string,
    instanceName: string,
    data?: any
  ) => {
    const { data: response, error } = await supabase.functions.invoke(
      "evolution-api",
      {
        body: { action, instanceName, data },
      }
    );

    if (error) {
      const anyErr = error as any;
      let message = error.message || "Erro ao chamar o backend";

      // Tenta extrair o corpo JSON do erro para mostrar uma mensagem real (ex: Not Found, Unauthorized, etc.)
      try {
        const ctx = anyErr?.context;
        if (ctx && typeof ctx.text === "function") {
          const text = await ctx.text();
          try {
            const parsed = text ? JSON.parse(text) : null;
            message = parsed?.error || parsed?.message || message;
          } catch {
            message = text || message;
          }
        }
      } catch {
        // ignore
      }

      throw new Error(message);
    }

    if (response?.error) throw new Error(response.error);
    return response;
  };

  const createConnection = async () => {
    if (!user || !newConnectionName.trim()) return;
    setCreating(true);
    setQrCodeData(null);

    const instanceName = `${newConnectionName
      .trim()
      .replace(/[^a-zA-Z0-9_-]+/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "")}_${Date.now()}`;

    try {
      // 1. Create instance in Evolution API
      console.log("Creating instance:", instanceName);
      const createResponse = await callEvolutionAPI("create-instance", instanceName);
      console.log("Create response:", createResponse);

      // 2. Save to database
      const { data: dbConnection, error: dbError } = await supabase
        .from("whatsapp_connections")
        .insert({
          user_id: user.id,
          name: newConnectionName,
          status: "waiting_qr",
          qr_code: null,
          session_data: { instanceName },
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // 3. Get QR Code with polling/retry
      // (Na Evolution, é comum demorar 10-60s até o QR realmente aparecer)
      await new Promise((resolve) => setTimeout(resolve, 2500));

      const qrBase64 = await pollForQRCode(instanceName, 24);

      if (qrBase64) {
        setQrCodeData(qrBase64);
        await supabase
          .from("whatsapp_connections")
          .update({ qr_code: qrBase64 })
          .eq("id", dbConnection.id);

        toast.success("QR Code gerado! Escaneie com seu WhatsApp.");
      } else {
        // Importante: não travar o modal caso ainda não tenha QR.
        // Fecha o modal e deixa o usuário usar "Atualizar QR" no card.
        toast.warning("QR Code ainda não apareceu. Clique em 'Atualizar QR'.");
        setShowModal(false);
        setNewConnectionName("");
      }

      setCurrentInstanceId(dbConnection.id);

      // 4. Start polling for connection status
      startStatusPolling(dbConnection.id, instanceName);

      fetchConnections();
    } catch (error: any) {
      console.error("Error creating connection:", error);
      toast.error(error.message || "Erro ao criar conexão");
    } finally {
      setCreating(false);
    }
  };

  const startStatusPolling = (connectionId: string, instanceName: string) => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    pollingRef.current = setInterval(async () => {
      try {
        const statusResponse = await callEvolutionAPI("get-status", instanceName);
        console.log("Status response:", statusResponse);

        const state = statusResponse?.state || statusResponse?.instance?.state;

        if (state === "open" || state === "connected") {
          // Connected successfully
          await supabase
            .from("whatsapp_connections")
            .update({
              status: "connected",
              qr_code: null,
              phone_number: statusResponse?.instance?.owner || null,
            })
            .eq("id", connectionId);

          toast.success("WhatsApp conectado com sucesso!");
          clearInterval(pollingRef.current!);
          pollingRef.current = null;
          setShowModal(false);
          setCreating(false);
          setQrCodeData(null);
          setCurrentInstanceId(null);
          setNewConnectionName("");
          fetchConnections();
        }
      } catch (error) {
        console.error("Error polling status:", error);
      }
    }, 3000);

    // Stop polling after 2 minutes
    setTimeout(() => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
        setCreating(false);
      }
    }, 120000);
  };

  const pollForQRCode = async (
    instanceName: string,
    maxAttempts = 10
  ): Promise<string | null> => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`[QR Poll] Attempt ${attempt}/${maxAttempts} for ${instanceName}`);

      try {
        const qrResponse = await callEvolutionAPI("get-qrcode", instanceName);
        console.log(`[QR Poll] Response:`, qrResponse);

        // A Evolution pode retornar { count: 0 } enquanto ainda está gerando.
        const count =
          typeof qrResponse?.count === "number"
            ? qrResponse.count
            : typeof qrResponse?.qrcode?.count === "number"
              ? qrResponse.qrcode.count
              : undefined;

        if (count === 0) {
          // ainda não tem QR
        } else {
          // Check for QR code in various formats
          let qrBase64: string | null = null;
          if (qrResponse?.base64) {
            qrBase64 = qrResponse.base64;
          } else if (qrResponse?.qrcode?.base64) {
            qrBase64 = qrResponse.qrcode.base64;
          } else if (qrResponse?.qrcode?.code) {
            qrBase64 = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrResponse.qrcode.code)}`;
          } else if (qrResponse?.code) {
            qrBase64 = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrResponse.code)}`;
          }

          if (qrBase64) return qrBase64;
        }
      } catch (error) {
        console.log(`[QR Poll] Attempt ${attempt} failed:`, error);
      }

      // Wait before next attempt
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
    return null;
  };

  const ensureInstanceExists = async (instanceName: string): Promise<boolean> => {
    try {
      // Check if instance exists by getting status
      const statusResponse = await callEvolutionAPI('get-status', instanceName);
      console.log('[ensureInstance] Status:', statusResponse);
      return true;
    } catch (error: any) {
      console.log('[ensureInstance] Instance not found, creating...', error.message);
      
      // Instance doesn't exist, create it
      try {
        await callEvolutionAPI('create-instance', instanceName);
        // Wait for instance to initialize
        await new Promise(resolve => setTimeout(resolve, 2000));
        return true;
      } catch (createError) {
        console.error('[ensureInstance] Failed to create:', createError);
        return false;
      }
    }
  };

  const refreshQRCode = async (connection: Connection) => {
    const toastId = toast.loading("Atualizando QR Code...");
    
    try {
      const sessionData = connection.session_data as any;
      const instanceName = sessionData?.instanceName;
      
      if (!instanceName) {
        toast.error("Instância não encontrada", { id: toastId });
        return;
      }

      // Ensure instance exists (create if needed)
      const instanceReady = await ensureInstanceExists(instanceName);
      if (!instanceReady) {
        toast.error("Erro ao preparar instância", { id: toastId });
        return;
      }

      // Logout + reconnect to force new QR generation (restart endpoint doesn't exist in v2.2.3)
      try {
        await callEvolutionAPI('logout', instanceName);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (e) {
        console.log('[Refresh] logout failed (ignored):', e);
      }

      // Poll for QR code with retries
      const qrBase64 = await pollForQRCode(instanceName, 12);

      if (qrBase64) {
        await supabase
          .from("whatsapp_connections")
          .update({ qr_code: qrBase64, status: "waiting_qr" })
          .eq("id", connection.id);

        toast.success("QR Code atualizado!", { id: toastId });
        fetchConnections();
        
        // Start polling for connection status
        startStatusPolling(connection.id, instanceName);
      } else {
        toast.error("Não foi possível obter o QR Code. Tente novamente.", { id: toastId });
      }
    } catch (error: any) {
      console.error('[refreshQRCode] Error:', error);
      toast.error(error.message || "Erro ao atualizar QR Code", { id: toastId });
    }
  };

  const deleteConnection = async (connection: Connection) => {
    try {
      const sessionData = connection.session_data as any;
      const instanceName = sessionData?.instanceName;

      // Delete from Evolution API if instance exists
      if (instanceName) {
        try {
          await callEvolutionAPI('delete-instance', instanceName);
        } catch (e) {
          console.log('Instance may not exist in Evolution API');
        }
      }

      // Delete from database
      const { error } = await supabase
        .from("whatsapp_connections")
        .delete()
        .eq("id", connection.id);

      if (error) throw error;
      toast.success("Conexão removida!");
      fetchConnections();
    } catch (error: any) {
      toast.error(error.message || "Erro ao remover conexão");
    }
  };

  const disconnectWhatsApp = async (connection: Connection) => {
    try {
      const sessionData = connection.session_data as any;
      const instanceName = sessionData?.instanceName;

      if (instanceName) {
        await callEvolutionAPI('logout', instanceName);
      }

      await supabase
        .from("whatsapp_connections")
        .update({ status: "disconnected", qr_code: null, phone_number: null })
        .eq("id", connection.id);

      toast.success("WhatsApp desconectado!");
      fetchConnections();
    } catch (error: any) {
      toast.error(error.message || "Erro ao desconectar");
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

  const renderQRCode = (qrCode: string | null) => {
    if (!qrCode) return null;
    
    // Check if it's a base64 image
    if (qrCode.startsWith('data:image')) {
      return <img src={qrCode} alt="QR Code" className="w-full h-48 object-contain" />;
    }
    
    // Check if it's a URL
    if (qrCode.startsWith('http')) {
      return <img src={qrCode} alt="QR Code" className="w-full h-48 object-contain" />;
    }
    
    // Assume it's raw base64, add data URI prefix
    return <img src={`data:image/png;base64,${qrCode}`} alt="QR Code" className="w-full h-48 object-contain" />;
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Conexões WhatsApp</h1>
          <p className="text-gray-400">Gerencie suas sessões do WhatsApp via Evolution API</p>
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
              <div className="h-48 bg-gray-700 rounded-xl mb-4" />
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
                  {renderQRCode(connection.qr_code)}
                </div>
              ) : (
                <div className="bg-[#0a0f0d] rounded-xl p-4 mb-4 h-56 flex items-center justify-center">
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
                      onClick={() => refreshQRCode(connection)}
                      size="sm"
                      className="flex-1 bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/30"
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Atualizar QR
                    </Button>
                  )}
                  {connection.status === "connected" && (
                    <Button
                      onClick={() => disconnectWhatsApp(connection)}
                      size="sm"
                      className="flex-1 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                    >
                      <WifiOff className="w-4 h-4 mr-1" />
                      Desconectar
                    </Button>
                  )}
                  <Button
                    onClick={() => deleteConnection(connection)}
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
                onClick={() => {
                  setShowModal(false);
                  setQrCodeData(null);
                  setCreating(false);
                  setNewConnectionName("");
                  if (pollingRef.current) {
                    clearInterval(pollingRef.current);
                  }
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {qrCodeData ? (
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4">
                  {renderQRCode(qrCodeData)}
                </div>
                <p className="text-center text-gray-400 text-sm">
                  Escaneie o QR Code com seu WhatsApp
                </p>
                <div className="flex items-center justify-center gap-2 text-[#25D366]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Aguardando conexão...</span>
                </div>
              </div>
            ) : (
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
                    disabled={creating}
                  />
                </div>

                <Button
                  onClick={createConnection}
                  disabled={creating || !newConnectionName.trim()}
                  className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#22c55e] hover:to-[#0f766e] text-white"
                >
                  {creating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Gerando QR Code...
                    </>
                  ) : (
                    <>
                      <QrCode className="w-4 h-4 mr-2" />
                      Gerar QR Code
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
