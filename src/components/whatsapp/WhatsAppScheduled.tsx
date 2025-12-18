import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Calendar,
  Plus,
  Clock,
  Trash2,
  Send,
  X,
  CheckCircle,
  AlertCircle,
  Repeat,
} from "lucide-react";

interface ScheduledMessage {
  id: string;
  content: string;
  scheduled_at: string;
  recurrence: string | null;
  status: string;
  created_at: string;
}

const recurrenceOptions = [
  { value: null, label: "Sem recorrência" },
  { value: "daily", label: "Diariamente" },
  { value: "weekly", label: "Semanalmente" },
  { value: "monthly", label: "Mensalmente" },
];

export const WhatsAppScheduled = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ScheduledMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    content: "",
    scheduled_at: "",
    recurrence: null as string | null,
  });

  const fetchMessages = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("whatsapp_scheduled_messages")
        .select("*")
        .eq("user_id", user.id)
        .order("scheduled_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching scheduled messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [user]);

  const createMessage = async () => {
    if (!user || !formData.content.trim() || !formData.scheduled_at) return;

    try {
      const { error } = await supabase.from("whatsapp_scheduled_messages").insert({
        user_id: user.id,
        content: formData.content,
        scheduled_at: new Date(formData.scheduled_at).toISOString(),
        recurrence: formData.recurrence,
        status: "pending",
      });

      if (error) throw error;
      toast.success("Mensagem agendada com sucesso!");
      setShowModal(false);
      setFormData({ content: "", scheduled_at: "", recurrence: null });
      fetchMessages();
    } catch (error: any) {
      toast.error(error.message || "Erro ao agendar mensagem");
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const { error } = await supabase
        .from("whatsapp_scheduled_messages")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Agendamento removido!");
      fetchMessages();
    } catch (error: any) {
      toast.error(error.message || "Erro ao remover agendamento");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; icon: typeof Clock }> = {
      pending: { label: "Pendente", color: "bg-yellow-500/20 text-yellow-400", icon: Clock },
      sent: { label: "Enviada", color: "bg-[#25D366]/20 text-[#25D366]", icon: CheckCircle },
      failed: { label: "Falhou", color: "bg-red-500/20 text-red-400", icon: AlertCircle },
    };
    const config = statusMap[status] || statusMap.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRecurrenceLabel = (recurrence: string | null) => {
    const option = recurrenceOptions.find((r) => r.value === recurrence);
    return option?.label || "Sem recorrência";
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Agendamento</h1>
          <p className="text-gray-400">Agende mensagens para envio automático</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#22c55e] hover:to-[#0f766e] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agendar Mensagem
        </Button>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#111814]/80 rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-3" />
              <div className="h-3 bg-gray-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-[#111814]/80 backdrop-blur-xl border border-[#25D366]/10 rounded-2xl p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#25D366]/10 flex items-center justify-center">
            <Calendar className="w-10 h-10 text-[#25D366]" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Nenhum agendamento</h3>
          <p className="text-gray-400 mb-6">Agende sua primeira mensagem</p>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#22c55e] hover:to-[#0f766e] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agendar
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className="bg-[#111814]/80 backdrop-blur-xl border border-[#25D366]/10 rounded-2xl p-6 hover:border-[#25D366]/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {getStatusBadge(message.status)}
                    {message.recurrence && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                        <Repeat className="w-3 h-3" />
                        {getRecurrenceLabel(message.recurrence)}
                      </span>
                    )}
                  </div>
                  <p className="text-white mb-2">{message.content}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDateTime(message.scheduled_at)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {message.status === "pending" && (
                    <Button
                      onClick={() => deleteMessage(message.id)}
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
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
              <h2 className="text-xl font-semibold text-white">Agendar Mensagem</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <Label className="text-gray-300">Mensagem</Label>
                <Textarea
                  placeholder="Digite a mensagem..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="mt-2 bg-[#0a0f0d] border-[#25D366]/20 text-white min-h-[100px]"
                />
              </div>

              <div>
                <Label className="text-gray-300">Data e hora</Label>
                <Input
                  type="datetime-local"
                  value={formData.scheduled_at}
                  onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                  className="mt-2 bg-[#0a0f0d] border-[#25D366]/20 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300 mb-3 block">Recorrência</Label>
                <div className="grid grid-cols-2 gap-2">
                  {recurrenceOptions.map((option) => (
                    <button
                      key={option.label}
                      onClick={() => setFormData({ ...formData, recurrence: option.value })}
                      className={`p-3 rounded-xl border transition-all text-sm ${
                        formData.recurrence === option.value
                          ? "border-[#25D366] bg-[#25D366]/10 text-white"
                          : "border-[#25D366]/20 text-gray-400 hover:border-[#25D366]/40"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={createMessage}
                disabled={!formData.content.trim() || !formData.scheduled_at}
                className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#22c55e] hover:to-[#0f766e] text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                Agendar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
