import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import * as QRCodeLib from "qrcode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  MessageSquare,
  QrCode,
  Wifi,
  WifiOff,
  Settings,
  RefreshCw,
  Check,
  Loader2,
  Smartphone,
  Trash2,
  Save,
  AlertTriangle,
} from "lucide-react";

interface ConnectionInfo {
  instanceName: string;
  status: string;
  profileName?: string;
  profilePicUrl?: string;
  phoneNumber?: string;
}

// Detecta se está rodando no preview do Lovable
const isLovablePreview =
  window.location.hostname.includes("lovableproject.com") ||
  window.location.hostname.includes("lovable.app");

// Em produção (no seu domínio), use um proxy no Nginx: https://SEU_DOMINIO/evo -> http://127.0.0.1:8080
const getDefaultApiUrl = () => {
  try {
    return `${window.location.origin}/evo`;
  } catch {
    return "";
  }
};

const DEFAULT_API_URL = getDefaultApiUrl();
const DEFAULT_API_KEY = "lov_evo_2024_X7kM9pL2qR5tY8wZ";

const isProbablyBase64 = (value: string) => /^[A-Za-z0-9+/=]+$/.test(value) && value.length > 200;

const normalizeQrToDataUrl = async (value: string) => {
  const trimmed = value.trim();
  if (trimmed.startsWith("data:image")) return trimmed;
  if (isProbablyBase64(trimmed)) return `data:image/png;base64,${trimmed}`;

  // Quando a API retorna o conteúdo do QR (texto), geramos a imagem no frontend
  return await QRCodeLib.toDataURL(trimmed, { margin: 1, width: 256 });
};

const extractQrValue = (data: any): string | null => {
  return (data?.base64 ?? data?.qrcode?.base64 ?? data?.code ?? data?.qrcode?.code ?? null) as string | null;
};

const WhatssDashboard = () => {
  // API Configuration
  const [apiUrl, setApiUrl] = useState(() => {
    const stored = localStorage.getItem("evo_api_url");
    if (!stored) return DEFAULT_API_URL;

    const hostname = window.location.hostname;
    const isLocal = hostname === "localhost" || hostname === "127.0.0.1";
    const isHttpsPage = window.location.protocol === "https:";

    // Se o usuário salvou localhost, isso aponta para o computador dele (não para a VPS)
    if (!isLocal && stored.includes("localhost")) return DEFAULT_API_URL;

    // Se a página é HTTPS e a API está em HTTP, o navegador bloqueia (Failed to fetch)
    if (!isLocal && isHttpsPage && stored.startsWith("http://")) return DEFAULT_API_URL;

    return stored;
  });

  const [apiKey, setApiKey] = useState(() => localStorage.getItem("evo_api_key") || DEFAULT_API_KEY);
  const [isConfigSaved, setIsConfigSaved] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  // Instance state
  const [instanceName, setInstanceName] = useState("");
  const [isCreatingInstance, setIsCreatingInstance] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isPollingQR, setIsPollingQR] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>("disconnected");
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo | null>(null);
  const [existingInstances, setExistingInstances] = useState<any[]>([]);
  const [isLoadingInstances, setIsLoadingInstances] = useState(false);

  // Check if config exists on load
  useEffect(() => {
    if (apiUrl && apiKey && !isLovablePreview) {
      setIsConfigSaved(true);
      fetchInstances();
    }
  }, []);

  // Save API configuration
  const saveConfig = async () => {
    if (!apiUrl || !apiKey) {
      toast.error("Preencha a URL e API Key");
      return;
    }

    setIsTestingConnection(true);
    try {
      // Test connection by fetching instances
      const response = await fetch(`${apiUrl}/instance/fetchInstances`, {
        method: "GET",
        headers: {
          "apikey": apiKey,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Save to localStorage
      localStorage.setItem("evo_api_url", apiUrl);
      localStorage.setItem("evo_api_key", apiKey);
      setIsConfigSaved(true);
      toast.success("Configuração salva e conexão verificada!");
      fetchInstances();
    } catch (error: any) {
      console.error("Connection test failed:", error);
      toast.error(`Falha na conexão: ${error.message}`);
    } finally {
      setIsTestingConnection(false);
    }
  };

  // Fetch existing instances
  const fetchInstances = async () => {
    if (!apiUrl || !apiKey) return;

    setIsLoadingInstances(true);
    try {
      const response = await fetch(`${apiUrl}/instance/fetchInstances`, {
        method: "GET",
        headers: {
          "apikey": apiKey,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      console.log("Instances:", data);
      setExistingInstances(Array.isArray(data) ? data : []);

      // Check for connected instances
      for (const instance of (Array.isArray(data) ? data : [])) {
        if (instance.instance?.status === "open" || instance.connectionStatus === "open") {
          await fetchConnectionInfo(instance.instance?.instanceName || instance.name);
        }
      }
    } catch (error: any) {
      console.error("Fetch instances error:", error);
      toast.error(`Erro ao buscar instâncias: ${error.message}`);
    } finally {
      setIsLoadingInstances(false);
    }
  };

  // Fetch connection info for a connected instance
  const fetchConnectionInfo = async (name: string) => {
    try {
      const response = await fetch(`${apiUrl}/instance/connectionState/${name}`, {
        method: "GET",
        headers: {
          "apikey": apiKey,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      console.log("Connection state:", data);

      if (data.instance?.state === "open") {
        setConnectionStatus("connected");
        
        // Fetch profile info
        const profileResponse = await fetch(`${apiUrl}/chat/fetchProfile/${name}`, {
          method: "POST",
          headers: {
            "apikey": apiKey,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ number: "" })
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setConnectionInfo({
            instanceName: name,
            status: "connected",
            profileName: profileData.name || profileData.pushName,
            profilePicUrl: profileData.picture || profileData.profilePictureUrl,
            phoneNumber: profileData.id?.split("@")[0] || profileData.wuid?.split("@")[0]
          });
        } else {
          setConnectionInfo({
            instanceName: name,
            status: "connected"
          });
        }
      }
    } catch (error) {
      console.error("Fetch connection info error:", error);
    }
  };

  // Create new instance
  const createInstance = async () => {
    if (!instanceName.trim()) {
      toast.error("Digite um nome para a instância");
      return;
    }

    setIsCreatingInstance(true);
    setQrCode(null);
    setConnectionStatus("connecting");

    try {
      // First, try to delete if exists
      try {
        await fetch(`${apiUrl}/instance/delete/${instanceName}`, {
          method: "DELETE",
          headers: { "apikey": apiKey }
        });
      } catch (e) {
        // Ignore delete errors
      }

      // Create instance
      const createResponse = await fetch(`${apiUrl}/instance/create`, {
        method: "POST",
        headers: {
          "apikey": apiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          instanceName: instanceName,
          qrcode: true,
          integration: "WHATSAPP-BAILEYS"
        })
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.message || `HTTP ${createResponse.status}`);
      }

      const createData = await createResponse.json();
      console.log("Create response:", createData);

      const qrValue = extractQrValue(createData);
      if (qrValue) {
        const dataUrl = await normalizeQrToDataUrl(qrValue);
        setQrCode(dataUrl);
        toast.success("QR Code gerado! Escaneie com seu WhatsApp");
        startPollingStatus();
      } else {
        // Start polling for QR
        startPollingQR();
      }

    } catch (error: any) {
      console.error("Create instance error:", error);
      toast.error(`Erro ao criar instância: ${error.message}`);
      setConnectionStatus("disconnected");
    } finally {
      setIsCreatingInstance(false);
    }
  };

  // Poll for QR code
  const startPollingQR = useCallback(() => {
    setIsPollingQR(true);
    let attempts = 0;
    const maxAttempts = 30;

    const pollQR = async () => {
      if (attempts >= maxAttempts) {
        setIsPollingQR(false);
        toast.error("Tempo esgotado. Tente novamente.");
        setConnectionStatus("disconnected");
        return;
      }

      attempts++;
      console.log(`[QR Poll] Attempt ${attempts}/${maxAttempts}`);

      try {
        // Try to get QR code
        const qrResponse = await fetch(`${apiUrl}/instance/connect/${instanceName}`, {
          method: "GET",
          headers: { "apikey": apiKey }
        });

        if (qrResponse.ok) {
          const qrData = await qrResponse.json();
          console.log("QR Response:", qrData);

          const qrValue = extractQrValue(qrData);
          if (qrValue) {
            const dataUrl = await normalizeQrToDataUrl(qrValue);
            setQrCode(dataUrl);
            setIsPollingQR(false);
            toast.success("QR Code gerado!");
            startPollingStatus();
            return;
          }
        }

        // Check connection state
        const stateResponse = await fetch(`${apiUrl}/instance/connectionState/${instanceName}`, {
          method: "GET",
          headers: { "apikey": apiKey }
        });

        if (stateResponse.ok) {
          const stateData = await stateResponse.json();
          console.log("State:", stateData);

          if (stateData.instance?.state === "open") {
            setIsPollingQR(false);
            setConnectionStatus("connected");
            await fetchConnectionInfo(instanceName);
            toast.success("WhatsApp conectado!");
            return;
          }
        }

        // Continue polling
        setTimeout(pollQR, 2000);
      } catch (error) {
        console.error("QR poll error:", error);
        setTimeout(pollQR, 2000);
      }
    };

    pollQR();
  }, [apiUrl, apiKey, instanceName]);

  // Poll connection status after QR is shown
  const startPollingStatus = useCallback(() => {
    let attempts = 0;
    const maxAttempts = 60; // 2 minutes

    const pollStatus = async () => {
      if (attempts >= maxAttempts) {
        toast.error("Tempo esgotado para escanear o QR Code");
        setQrCode(null);
        setConnectionStatus("disconnected");
        return;
      }

      attempts++;

      try {
        const response = await fetch(`${apiUrl}/instance/connectionState/${instanceName}`, {
          method: "GET",
          headers: { "apikey": apiKey }
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Status poll:", data);

          if (data.instance?.state === "open") {
            setQrCode(null);
            setConnectionStatus("connected");
            await fetchConnectionInfo(instanceName);
            await fetchInstances();
            toast.success("WhatsApp conectado com sucesso!");
            return;
          }
        }

        setTimeout(pollStatus, 2000);
      } catch (error) {
        console.error("Status poll error:", error);
        setTimeout(pollStatus, 2000);
      }
    };

    pollStatus();
  }, [apiUrl, apiKey, instanceName]);

  // Delete instance
  const deleteInstance = async (name: string) => {
    try {
      const response = await fetch(`${apiUrl}/instance/delete/${name}`, {
        method: "DELETE",
        headers: { "apikey": apiKey }
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      toast.success("Instância removida");
      setConnectionInfo(null);
      setConnectionStatus("disconnected");
      setQrCode(null);
      await fetchInstances();
    } catch (error: any) {
      toast.error(`Erro ao remover: ${error.message}`);
    }
  };

  // Logout instance
  const logoutInstance = async (name: string) => {
    try {
      const response = await fetch(`${apiUrl}/instance/logout/${name}`, {
        method: "DELETE",
        headers: { "apikey": apiKey }
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      toast.success("WhatsApp desconectado");
      setConnectionInfo(null);
      setConnectionStatus("disconnected");
      await fetchInstances();
    } catch (error: any) {
      toast.error(`Erro ao desconectar: ${error.message}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>Conectar WhatsApp via QR Code | Acessar.click</title>
        <meta name="description" content="Dashboard para conectar WhatsApp ao Web WhatsApp via Evolution API: gerar QR Code, escanear e salvar conexão." />
        <link rel="canonical" href="https://acessar.click/whatss" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="border-b border-emerald-800/30 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <MessageSquare className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">WhatsApp Dashboard</h1>
              <p className="text-sm text-emerald-400/70">Evolution API Integration</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Alerta para preview do Lovable */}
        {isLovablePreview && (
          <Alert className="mb-6 bg-amber-900/30 border-amber-600/50">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <AlertDescription className="text-amber-200">
              <strong>Atenção:</strong> No preview do Lovable a conexão com a Evolution API falha por restrições do navegador.
              <br />
              <span className="text-amber-400 font-medium">Acesse no seu domínio após o deploy.</span>
            </AlertDescription>
          </Alert>
        )}

        {/* Alerta de HTTPS -> HTTP (Mixed Content) */}
        {!isLovablePreview && window.location.protocol === "https:" && apiUrl.startsWith("http://") && (
          <Alert className="mb-6 bg-amber-900/30 border-amber-600/50">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <AlertDescription className="text-amber-200">
              <strong>Bloqueio do navegador:</strong> seu site está em <b>HTTPS</b> e a API está em <b>HTTP</b>.
              Isso causa <b>Failed to fetch</b>.
              <br />
              Use a URL <span className="text-amber-400 font-medium">{window.location.origin}/evo</span> e configure o proxy do Nginx.
              (Veja o arquivo <b>HOSTINGER_NGINX_EVOLUTION_PROXY.md</b> no seu servidor.)
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* API Configuration Card */}
          <Card className="bg-gray-900/50 border-emerald-800/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Settings className="h-5 w-5 text-emerald-400" />
                Configuração da API
              </CardTitle>
              <CardDescription className="text-gray-400">
                Configure a URL e chave da Evolution API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiUrl" className="text-gray-300">URL da API</Label>
                <Input
                  id="apiUrl"
                  placeholder={`${window.location.origin}/evo`}
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiKey" className="text-gray-300">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Sua chave de API"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              <Button
                onClick={saveConfig}
                disabled={isTestingConnection}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isTestingConnection ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testando conexão...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar e Testar Conexão
                  </>
                )}
              </Button>
              {isConfigSaved && (
                <div className="flex items-center gap-2 text-emerald-400 text-sm">
                  <Check className="h-4 w-4" />
                  Configuração salva
                </div>
              )}
            </CardContent>
          </Card>

          {/* Connection Status Card */}
          <Card className="bg-gray-900/50 border-emerald-800/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                {connectionStatus === "connected" ? (
                  <Wifi className="h-5 w-5 text-emerald-400" />
                ) : (
                  <WifiOff className="h-5 w-5 text-gray-500" />
                )}
                Status da Conexão
              </CardTitle>
              <CardDescription className="text-gray-400">
                {connectionStatus === "connected" 
                  ? "WhatsApp conectado" 
                  : connectionStatus === "connecting" 
                    ? "Conectando..." 
                    : "Não conectado"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {connectionInfo ? (
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {connectionInfo.profilePicUrl ? (
                      <img
                        src={connectionInfo.profilePicUrl}
                        alt="Profile"
                        className="w-16 h-16 rounded-full border-2 border-emerald-500"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center">
                        <Smartphone className="h-8 w-8 text-white" />
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-gray-900" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">
                      {connectionInfo.profileName || connectionInfo.instanceName}
                    </p>
                    {connectionInfo.phoneNumber && (
                      <p className="text-emerald-400/70 text-sm">
                        +{connectionInfo.phoneNumber}
                      </p>
                    )}
                    <Badge className="mt-1 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      Conectado
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => logoutInstance(connectionInfo.instanceName)}
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      <WifiOff className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteInstance(connectionInfo.instanceName)}
                      className="border-red-800 text-red-400 hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <WifiOff className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma conexão ativa</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Create Instance Card */}
          <Card className="bg-gray-900/50 border-emerald-800/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Smartphone className="h-5 w-5 text-emerald-400" />
                Nova Conexão
              </CardTitle>
              <CardDescription className="text-gray-400">
                Crie uma nova instância do WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="instanceName" className="text-gray-300">Nome da Instância</Label>
                <Input
                  id="instanceName"
                  placeholder="meu_whatsapp"
                  value={instanceName}
                  onChange={(e) => setInstanceName(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                  disabled={!isConfigSaved}
                />
                <p className="text-xs text-gray-500">Apenas letras, números e underscore</p>
              </div>
              <Button
                onClick={createInstance}
                disabled={!isConfigSaved || isCreatingInstance || !instanceName.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isCreatingInstance ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <QrCode className="h-4 w-4 mr-2" />
                    Gerar QR Code
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* QR Code Card */}
          <Card className="bg-gray-900/50 border-emerald-800/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <QrCode className="h-5 w-5 text-emerald-400" />
                QR Code
              </CardTitle>
              <CardDescription className="text-gray-400">
                Escaneie com seu WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center min-h-[280px]">
                {qrCode ? (
                  <div className="p-4 bg-white rounded-xl">
                    <img
                      src={qrCode}
                      alt="QR Code"
                      className="w-56 h-56"
                    />
                  </div>
                ) : isPollingQR || isCreatingInstance ? (
                  <div className="text-center">
                    <Loader2 className="h-16 w-16 mx-auto mb-4 animate-spin text-emerald-400" />
                    <p className="text-gray-400">Gerando QR Code...</p>
                    <p className="text-sm text-gray-500 mt-1">Aguarde alguns segundos</p>
                  </div>
                ) : connectionStatus === "connecting" ? (
                  <div className="text-center">
                    <Loader2 className="h-16 w-16 mx-auto mb-4 animate-spin text-emerald-400" />
                    <p className="text-gray-400">Aguardando leitura do QR Code...</p>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <QrCode className="h-20 w-20 mx-auto mb-4 opacity-30" />
                    <p>O QR Code aparecerá aqui</p>
                    <p className="text-sm mt-1">Configure a API e crie uma instância</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Existing Instances */}
          <Card className="lg:col-span-2 bg-gray-900/50 border-emerald-800/30 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <MessageSquare className="h-5 w-5 text-emerald-400" />
                    Instâncias Existentes
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Gerencie suas conexões do WhatsApp
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchInstances}
                  disabled={!isConfigSaved || isLoadingInstances}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingInstances ? "animate-spin" : ""}`} />
                  Atualizar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {existingInstances.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {existingInstances.map((inst, index) => {
                    const name = inst.instance?.instanceName || inst.name || `Instance ${index}`;
                    const status = inst.instance?.status || inst.connectionStatus || "unknown";
                    const isConnected = status === "open";

                    return (
                      <div
                        key={name}
                        className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-emerald-500" : "bg-gray-500"}`} />
                          <div>
                            <p className="text-white font-medium">{name}</p>
                            <p className="text-xs text-gray-500">{status}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {!isConnected && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setInstanceName(name);
                                startPollingQR();
                              }}
                              className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20"
                            >
                              <QrCode className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteInstance(name)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p>Nenhuma instância encontrada</p>
                  {!isConfigSaved && (
                    <p className="text-sm mt-1">Configure a API primeiro</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
    </>
  );
};

export default WhatssDashboard;
