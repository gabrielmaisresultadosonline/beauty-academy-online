import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Users,
  Plus,
  Search,
  Trash2,
  Edit,
  X,
  Phone,
  Mail,
  Tag,
  MessageCircle,
} from "lucide-react";

interface Contact {
  id: string;
  name: string;
  phone_number: string;
  email: string | null;
  tags: string[];
  notes: string | null;
  created_at: string;
}

export const WhatsAppContacts = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
    tags: "",
    notes: "",
  });

  const fetchContacts = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("whatsapp_contacts")
        .select("*")
        .eq("user_id", user.id)
        .order("name", { ascending: true });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [user]);

  const handleSubmit = async () => {
    if (!user || !formData.name.trim() || !formData.phone_number.trim()) return;

    try {
      const tags = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      if (editingContact) {
        const { error } = await supabase
          .from("whatsapp_contacts")
          .update({
            name: formData.name,
            phone_number: formData.phone_number,
            email: formData.email || null,
            tags,
            notes: formData.notes || null,
          })
          .eq("id", editingContact.id);

        if (error) throw error;
        toast.success("Contato atualizado!");
      } else {
        const { error } = await supabase.from("whatsapp_contacts").insert({
          user_id: user.id,
          name: formData.name,
          phone_number: formData.phone_number,
          email: formData.email || null,
          tags,
          notes: formData.notes || null,
        });

        if (error) throw error;
        toast.success("Contato adicionado!");
      }

      resetForm();
      fetchContacts();
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar contato");
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const { error } = await supabase.from("whatsapp_contacts").delete().eq("id", id);
      if (error) throw error;
      toast.success("Contato removido!");
      fetchContacts();
    } catch (error: any) {
      toast.error(error.message || "Erro ao remover contato");
    }
  };

  const editContact = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      phone_number: contact.phone_number,
      email: contact.email || "",
      tags: contact.tags?.join(", ") || "",
      notes: contact.notes || "",
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setShowModal(false);
    setEditingContact(null);
    setFormData({ name: "", phone_number: "", email: "", tags: "", notes: "" });
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone_number.includes(searchTerm) ||
      contact.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Contatos</h1>
          <p className="text-gray-400">Gerencie seus contatos do WhatsApp</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#22c55e] hover:to-[#0f766e] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Contato
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input
          placeholder="Buscar por nome, telefone ou tag..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-[#111814]/80 border-[#25D366]/20 text-white"
        />
      </div>

      {/* Contacts Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-[#111814]/80 rounded-2xl p-6 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-700" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="bg-[#111814]/80 backdrop-blur-xl border border-[#25D366]/10 rounded-2xl p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#25D366]/10 flex items-center justify-center">
            <Users className="w-10 h-10 text-[#25D366]" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {searchTerm ? "Nenhum contato encontrado" : "Nenhum contato"}
          </h3>
          <p className="text-gray-400 mb-6">
            {searchTerm ? "Tente buscar com outros termos" : "Adicione seu primeiro contato"}
          </p>
          {!searchTerm && (
            <Button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#22c55e] hover:to-[#0f766e] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Contato
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-[#111814]/80 backdrop-blur-xl border border-[#25D366]/10 rounded-2xl p-6 hover:border-[#25D366]/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-lg">
                    {contact.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white truncate">{contact.name}</h3>
                  <p className="text-gray-400 text-sm flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {contact.phone_number}
                  </p>
                  {contact.email && (
                    <p className="text-gray-500 text-sm flex items-center gap-1 truncate">
                      <Mail className="w-3 h-3" />
                      {contact.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Tags */}
              {contact.tags && contact.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {contact.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-[#25D366]/10 text-[#25D366]"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Notes */}
              {contact.notes && (
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{contact.notes}</p>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex-1 text-[#25D366] hover:bg-[#25D366]/10"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Chat
                </Button>
                <Button
                  onClick={() => editContact(contact)}
                  size="sm"
                  variant="ghost"
                  className="text-blue-400 hover:bg-blue-500/10"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => deleteContact(contact.id)}
                  size="sm"
                  variant="ghost"
                  className="text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111814] border border-[#25D366]/20 rounded-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {editingContact ? "Editar Contato" : "Novo Contato"}
              </h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <Label className="text-gray-300">Nome</Label>
                <Input
                  placeholder="Nome do contato"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-2 bg-[#0a0f0d] border-[#25D366]/20 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300">Telefone</Label>
                <Input
                  placeholder="+55 11 99999-9999"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  className="mt-2 bg-[#0a0f0d] border-[#25D366]/20 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300">Email (opcional)</Label>
                <Input
                  type="email"
                  placeholder="email@exemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-2 bg-[#0a0f0d] border-[#25D366]/20 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300">Tags (separadas por vírgula)</Label>
                <Input
                  placeholder="cliente, vip, ativo"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="mt-2 bg-[#0a0f0d] border-[#25D366]/20 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300">Notas (opcional)</Label>
                <Textarea
                  placeholder="Observações sobre o contato..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-2 bg-[#0a0f0d] border-[#25D366]/20 text-white"
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!formData.name.trim() || !formData.phone_number.trim()}
                className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#22c55e] hover:to-[#0f766e] text-white"
              >
                {editingContact ? "Salvar Alterações" : "Adicionar Contato"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
