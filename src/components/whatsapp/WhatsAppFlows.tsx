import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  GitBranch,
  Plus,
  Play,
  Pause,
  Trash2,
  Edit,
  X,
  MessageSquare,
  Zap,
  Clock,
  Hash,
} from "lucide-react";

interface Flow {
  id: string;
  name: string;
  description: string | null;
  trigger_type: string;
  trigger_value: string | null;
  actions: any;
  is_active: boolean;
  created_at: string;
}

const triggerTypes = [
  { value: "keyword", label: "Palavra-chave", icon: Hash, description: "Dispara quando a mensagem contém uma palavra" },
  { value: "first_message", label: "Primeira mensagem", icon: MessageSquare, description: "Dispara na primeira mensagem de um contato" },
  { value: "schedule", label: "Agendado", icon: Clock, description: "Dispara em horário específico" },
  { value: "webhook", label: "Webhook", icon: Zap, description: "Dispara via chamada de API externa" },
];

export const WhatsAppFlows = () => {
  const { user } = useAuth();
  const [flows, setFlows] = useState<Flow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFlow, setEditingFlow] = useState<Flow | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    trigger_type: "keyword",
    trigger_value: "",
    response_message: "",
  });

  const fetchFlows = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("whatsapp_flows")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFlows(data || []);
    } catch (error) {
      console.error("Error fetching flows:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlows();
  }, [user]);

  const handleSubmit = async () => {
    if (!user || !formData.name.trim()) return;

    try {
      const actions = formData.response_message
        ? [{ type: "send_message", content: formData.response_message }]
        : [];

      if (editingFlow) {
        const { error } = await supabase
          .from("whatsapp_flows")
          .update({
            name: formData.name,
            description: formData.description,
            trigger_type: formData.trigger_type,
            trigger_value: formData.trigger_value,
            actions,
          })
          .eq("id", editingFlow.id);

        if (error) throw error;
        toast.success("Fluxo atualizado!");
      } else {
        const { error } = await supabase.from("whatsapp_flows").insert({
          user_id: user.id,
          name: formData.name,
          description: formData.description,
          trigger_type: formData.trigger_type,
          trigger_value: formData.trigger_value,
          actions,
          is_active: true,
        });

        if (error) throw error;
        toast.success("Fluxo criado com sucesso!");
      }

      resetForm();
      fetchFlows();
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar fluxo");
    }
  };

  const toggleFlow = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from("whatsapp_flows")
        .update({ is_active: !isActive })
        .eq("id", id);

      if (error) throw error;
      toast.success(isActive ? "Fluxo pausado" : "Fluxo ativado");
      fetchFlows();
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar fluxo");
    }
  };

  const deleteFlow = async (id: string) => {
    try {
      const { error } = await supabase.from("whatsapp_flows").delete().eq("id", id);
      if (error) throw error;
      toast.success("Fluxo removido!");
      fetchFlows();
    } catch (error: any) {
      toast.error(error.message || "Erro ao remover fluxo");
    }
  };

  const editFlow = (flow: Flow) => {
    setEditingFlow(flow);
    setFormData({
      name: flow.name,
      description: flow.description || "",
      trigger_type: flow.trigger_type,
      trigger_value: flow.trigger_value || "",
      response_message: flow.actions?.[0]?.content || "",
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setShowModal(false);
    setEditingFlow(null);
    setFormData({
      name: "",
      description: "",
      trigger_type: "keyword",
      trigger_value: "",
      response_message: "",
    });
  };

  const getTriggerIcon = (type: string) => {
    const trigger = triggerTypes.find((t) => t.value === type);
    return trigger?.icon || Hash;
  };

  const getTriggerLabel = (type: string) => {
    const trigger = triggerTypes.find((t) => t.value === type);
    return trigger?.label || type;
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Automações</h1>
          <p className="text-gray-400">Crie fluxos de automação para suas conversas</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#22c55e] hover:to-[#0f766e] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Fluxo
        </Button>
      </div>

      {/* Flows Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#111814]/80 rounded-2xl p-6 animate-pulse">
              <div className="h-6 bg-gray-700 rounded w-3/4 mb-4" />
              <div className="h-4 bg-gray-700 rounded w-full mb-2" />
              <div className="h-4 bg-gray-700 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : flows.length === 0 ? (
        <div className="bg-[#111814]/80 backdrop-blur-xl border border-[#25D366]/10 rounded-2xl p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#25D366]/10 flex items-center justify-center">
            <GitBranch className="w-10 h-10 text-[#25D366]" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Nenhuma automação</h3>
          <p className="text-gray-400 mb-6">Crie seu primeiro fluxo de automação</p>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#22c55e] hover:to-[#0f766e] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Fluxo
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flows.map((flow) => {
            const TriggerIcon = getTriggerIcon(flow.trigger_type);
            return (
              <div
                key={flow.id}
                className={`bg-[#111814]/80 backdrop-blur-xl border rounded-2xl p-6 transition-all duration-300 ${
                  flow.is_active ? "border-[#25D366]/30" : "border-gray-700/30"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${flow.is_active ? "bg-[#25D366]/20" : "bg-gray-700/20"}`}>
                    <TriggerIcon className={`w-6 h-6 ${flow.is_active ? "text-[#25D366]" : "text-gray-500"}`} />
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      flow.is_active ? "bg-[#25D366]/20 text-[#25D366]" : "bg-gray-700/20 text-gray-400"
                    }`}
                  >
                    {flow.is_active ? "Ativo" : "Inativo"}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white mb-1">{flow.name}</h3>
                <p className="text-gray-400 text-sm mb-2">{flow.description || "Sem descrição"}</p>
                <p className="text-xs text-gray-500 mb-4">
                  Gatilho: {getTriggerLabel(flow.trigger_type)}
                  {flow.trigger_value && ` - "${flow.trigger_value}"`}
                </p>

                <div className="flex gap-2">
                  <Button
                    onClick={() => toggleFlow(flow.id, flow.is_active)}
                    size="sm"
                    variant="ghost"
                    className={flow.is_active ? "text-yellow-400 hover:bg-yellow-500/10" : "text-[#25D366] hover:bg-[#25D366]/10"}
                  >
                    {flow.is_active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button
                    onClick={() => editFlow(flow)}
                    size="sm"
                    variant="ghost"
                    className="text-blue-400 hover:bg-blue-500/10"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => deleteFlow(flow.id)}
                    size="sm"
                    variant="ghost"
                    className="text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111814] border border-[#25D366]/20 rounded-2xl w-full max-w-lg p-6 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {editingFlow ? "Editar Fluxo" : "Novo Fluxo"}
              </h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <Label className="text-gray-300">Nome do fluxo</Label>
                <Input
                  placeholder="Ex: Boas-vindas"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-2 bg-[#0a0f0d] border-[#25D366]/20 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300">Descrição (opcional)</Label>
                <Input
                  placeholder="Descreva o fluxo..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-2 bg-[#0a0f0d] border-[#25D366]/20 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300 mb-3 block">Tipo de gatilho</Label>
                <div className="grid grid-cols-2 gap-3">
                  {triggerTypes.map((trigger) => {
                    const Icon = trigger.icon;
                    return (
                      <button
                        key={trigger.value}
                        onClick={() => setFormData({ ...formData, trigger_type: trigger.value })}
                        className={`p-4 rounded-xl border transition-all text-left ${
                          formData.trigger_type === trigger.value
                            ? "border-[#25D366] bg-[#25D366]/10"
                            : "border-[#25D366]/20 hover:border-[#25D366]/40"
                        }`}
                      >
                        <Icon className={`w-5 h-5 mb-2 ${formData.trigger_type === trigger.value ? "text-[#25D366]" : "text-gray-400"}`} />
                        <p className="text-white text-sm font-medium">{trigger.label}</p>
                        <p className="text-gray-500 text-xs mt-1">{trigger.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {formData.trigger_type === "keyword" && (
                <div>
                  <Label className="text-gray-300">Palavra-chave</Label>
                  <Input
                    placeholder="Ex: oi, olá, preço"
                    value={formData.trigger_value}
                    onChange={(e) => setFormData({ ...formData, trigger_value: e.target.value })}
                    className="mt-2 bg-[#0a0f0d] border-[#25D366]/20 text-white"
                  />
                </div>
              )}

              <div>
                <Label className="text-gray-300">Mensagem de resposta</Label>
                <Textarea
                  placeholder="Digite a mensagem que será enviada automaticamente..."
                  value={formData.response_message}
                  onChange={(e) => setFormData({ ...formData, response_message: e.target.value })}
                  className="mt-2 bg-[#0a0f0d] border-[#25D366]/20 text-white min-h-[100px]"
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!formData.name.trim()}
                className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#22c55e] hover:to-[#0f766e] text-white"
              >
                {editingFlow ? "Salvar Alterações" : "Criar Fluxo"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
