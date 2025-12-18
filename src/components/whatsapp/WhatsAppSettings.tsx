import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Settings,
  Bell,
  Webhook,
  MessageSquare,
  Crown,
  Save,
  User,
  Shield,
  Zap,
} from "lucide-react";

interface UserSettings {
  id?: string;
  notifications_enabled: boolean;
  webhook_url: string;
  auto_reply_enabled: boolean;
  auto_reply_message: string;
  plan_type: string;
}

const plans = [
  {
    type: "free",
    name: "Gratuito",
    price: "R$ 0",
    features: ["1 conexão", "100 mensagens/mês", "Suporte básico"],
  },
  {
    type: "pro",
    name: "Profissional",
    price: "R$ 97/mês",
    features: ["5 conexões", "5.000 mensagens/mês", "Automações ilimitadas", "Suporte prioritário"],
  },
  {
    type: "enterprise",
    name: "Empresarial",
    price: "R$ 297/mês",
    features: ["Conexões ilimitadas", "Mensagens ilimitadas", "API dedicada", "Suporte 24/7"],
  },
];

export const WhatsAppSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>({
    notifications_enabled: true,
    webhook_url: "",
    auto_reply_enabled: false,
    auto_reply_message: "",
    plan_type: "free",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from("whatsapp_settings")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error && error.code !== "PGRST116") throw error;
        if (data) {
          setSettings({
            id: data.id,
            notifications_enabled: data.notifications_enabled,
            webhook_url: data.webhook_url || "",
            auto_reply_enabled: data.auto_reply_enabled,
            auto_reply_message: data.auto_reply_message || "",
            plan_type: data.plan_type,
          });
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [user]);

  const saveSettings = async () => {
    if (!user) return;
    setSaving(true);

    try {
      if (settings.id) {
        const { error } = await supabase
          .from("whatsapp_settings")
          .update({
            notifications_enabled: settings.notifications_enabled,
            webhook_url: settings.webhook_url || null,
            auto_reply_enabled: settings.auto_reply_enabled,
            auto_reply_message: settings.auto_reply_message || null,
          })
          .eq("id", settings.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("whatsapp_settings").insert({
          user_id: user.id,
          notifications_enabled: settings.notifications_enabled,
          webhook_url: settings.webhook_url || null,
          auto_reply_enabled: settings.auto_reply_enabled,
          auto_reply_message: settings.auto_reply_message || null,
          plan_type: "free",
        });

        if (error) throw error;
      }

      toast.success("Configurações salvas!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <div className="h-8 bg-gray-700 rounded w-48 animate-pulse" />
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#111814]/80 rounded-2xl p-6 animate-pulse">
              <div className="h-6 bg-gray-700 rounded w-1/4 mb-4" />
              <div className="h-10 bg-gray-700 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Configurações</h1>
        <p className="text-gray-400">Personalize sua experiência no WhatsApp CRM</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Section */}
          <div className="bg-[#111814]/80 backdrop-blur-xl border border-[#25D366]/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[#25D366]/10">
                <User className="w-5 h-5 text-[#25D366]" />
              </div>
              <h2 className="text-xl font-semibold text-white">Perfil</h2>
            </div>

            <div className="flex items-center gap-4 p-4 bg-[#0a0f0d] rounded-xl">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-white font-medium">{user?.email}</p>
                <p className="text-gray-400 text-sm">Conta verificada</p>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-[#111814]/80 backdrop-blur-xl border border-[#25D366]/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Bell className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Notificações</h2>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Notificações push</p>
                <p className="text-gray-400 text-sm">Receba alertas de novas mensagens</p>
              </div>
              <Switch
                checked={settings.notifications_enabled}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, notifications_enabled: checked })
                }
              />
            </div>
          </div>

          {/* Auto Reply */}
          <div className="bg-[#111814]/80 backdrop-blur-xl border border-[#25D366]/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <MessageSquare className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Resposta Automática</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Ativar resposta automática</p>
                  <p className="text-gray-400 text-sm">Responde automaticamente fora do horário</p>
                </div>
                <Switch
                  checked={settings.auto_reply_enabled}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, auto_reply_enabled: checked })
                  }
                />
              </div>

              {settings.auto_reply_enabled && (
                <div>
                  <Label className="text-gray-300">Mensagem automática</Label>
                  <Textarea
                    placeholder="Olá! No momento estamos fora do horário de atendimento..."
                    value={settings.auto_reply_message}
                    onChange={(e) =>
                      setSettings({ ...settings, auto_reply_message: e.target.value })
                    }
                    className="mt-2 bg-[#0a0f0d] border-[#25D366]/20 text-white"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Webhook */}
          <div className="bg-[#111814]/80 backdrop-blur-xl border border-[#25D366]/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Webhook className="w-5 h-5 text-orange-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Webhook</h2>
            </div>

            <div>
              <Label className="text-gray-300">URL do Webhook</Label>
              <Input
                placeholder="https://seu-servidor.com/webhook"
                value={settings.webhook_url}
                onChange={(e) => setSettings({ ...settings, webhook_url: e.target.value })}
                className="mt-2 bg-[#0a0f0d] border-[#25D366]/20 text-white"
              />
              <p className="text-gray-500 text-sm mt-2">
                Receba eventos em tempo real via HTTP POST
              </p>
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={saveSettings}
            disabled={saving}
            className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#22c55e] hover:to-[#0f766e] text-white py-6"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Salvar Configurações
              </>
            )}
          </Button>
        </div>

        {/* Plans Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#111814]/80 backdrop-blur-xl border border-[#25D366]/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Crown className="w-5 h-5 text-yellow-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Planos</h2>
            </div>

            <div className="space-y-4">
              {plans.map((plan) => (
                <div
                  key={plan.type}
                  className={`p-4 rounded-xl border transition-all ${
                    settings.plan_type === plan.type
                      ? "border-[#25D366] bg-[#25D366]/10"
                      : "border-[#25D366]/10 hover:border-[#25D366]/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white">{plan.name}</h3>
                    {settings.plan_type === plan.type && (
                      <span className="px-2 py-1 rounded-full text-xs bg-[#25D366] text-white">
                        Atual
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-[#25D366] mb-3">{plan.price}</p>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="text-gray-400 text-sm flex items-center gap-2">
                        <Zap className="w-3 h-3 text-[#25D366]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {settings.plan_type !== plan.type && (
                    <Button
                      className="w-full mt-4 bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/30"
                      size="sm"
                    >
                      Upgrade
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Security Info */}
          <div className="bg-[#111814]/80 backdrop-blur-xl border border-[#25D366]/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Shield className="w-5 h-5 text-green-400" />
              </div>
              <h2 className="font-semibold text-white">Segurança</h2>
            </div>
            <p className="text-gray-400 text-sm">
              Seus dados são protegidos com criptografia de ponta a ponta. Nunca compartilhamos suas
              informações com terceiros.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
