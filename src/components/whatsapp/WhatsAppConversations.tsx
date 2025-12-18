import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Check,
  CheckCheck,
  MessageCircle,
} from "lucide-react";

interface Contact {
  id: string;
  name: string;
  phone_number: string;
  avatar_url: string | null;
}

interface Conversation {
  id: string;
  contact_id: string;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
  status: string;
  contact?: Contact;
}

interface Message {
  id: string;
  content: string;
  direction: string;
  status: string;
  created_at: string;
}

export const WhatsAppConversations = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      try {
        const { data: convs, error: convError } = await supabase
          .from("whatsapp_conversations")
          .select("*")
          .eq("user_id", user.id)
          .order("last_message_at", { ascending: false });

        if (convError) throw convError;

        // Fetch contacts for conversations
        const contactIds = convs?.map((c) => c.contact_id).filter(Boolean) || [];
        if (contactIds.length > 0) {
          const { data: contacts } = await supabase
            .from("whatsapp_contacts")
            .select("*")
            .in("id", contactIds);

          const convsWithContacts = convs?.map((conv) => ({
            ...conv,
            contact: contacts?.find((c) => c.id === conv.contact_id),
          }));
          setConversations(convsWithContacts || []);
        } else {
          setConversations(convs || []);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("whatsapp_messages_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "whatsapp_messages",
        },
        (payload) => {
          if (selectedConversation && payload.new.conversation_id === selectedConversation.id) {
            setMessages((prev) => [...prev, payload.new as Message]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedConversation]);

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from("whatsapp_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const selectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    fetchMessages(conv.id);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    try {
      const { error } = await supabase.from("whatsapp_messages").insert({
        user_id: user.id,
        conversation_id: selectedConversation.id,
        content: newMessage,
        direction: "outgoing",
        status: "sent",
      });

      if (error) throw error;

      // Update conversation last message
      await supabase
        .from("whatsapp_conversations")
        .update({
          last_message: newMessage,
          last_message_at: new Date().toISOString(),
        })
        .eq("id", selectedConversation.id);

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.contact?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen flex">
      {/* Conversations List */}
      <div className="w-96 border-r border-[#25D366]/10 flex flex-col bg-[#111814]/50">
        {/* Search Header */}
        <div className="p-4 border-b border-[#25D366]/10">
          <h2 className="text-xl font-semibold text-white mb-4">Conversas</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Buscar conversa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#0a0f0d] border-[#25D366]/20 text-white"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-12 h-12 rounded-full bg-gray-700" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-700 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">Nenhuma conversa encontrada</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => selectConversation(conv)}
                className={`w-full p-4 flex items-center gap-3 hover:bg-[#25D366]/10 transition-colors ${
                  selectedConversation?.id === conv.id ? "bg-[#25D366]/20" : ""
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-lg">
                    {conv.contact?.name?.charAt(0) || "?"}
                  </span>
                </div>
                <div className="flex-1 text-left overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white truncate">
                      {conv.contact?.name || "Contato"}
                    </h3>
                    {conv.last_message_at && (
                      <span className="text-xs text-gray-500">
                        {formatTime(conv.last_message_at)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 truncate">{conv.last_message || "..."}</p>
                </div>
                {conv.unread_count > 0 && (
                  <span className="bg-[#25D366] text-white text-xs px-2 py-1 rounded-full">
                    {conv.unread_count}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-[#25D366]/10 flex items-center justify-between bg-[#111814]/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {selectedConversation.contact?.name?.charAt(0) || "?"}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-white">
                    {selectedConversation.contact?.name || "Contato"}
                  </h3>
                  <p className="text-xs text-[#25D366]">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Video className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0f0d]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.direction === "outgoing" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-2xl ${
                      message.direction === "outgoing"
                        ? "bg-[#25D366] text-white rounded-br-sm"
                        : "bg-[#111814] text-white rounded-bl-sm"
                    }`}
                  >
                    <p>{message.content}</p>
                    <div
                      className={`flex items-center gap-1 mt-1 ${
                        message.direction === "outgoing" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <span className="text-xs opacity-70">{formatTime(message.created_at)}</span>
                      {message.direction === "outgoing" && (
                        message.status === "read" ? (
                          <CheckCheck className="w-4 h-4 text-blue-400" />
                        ) : (
                          <Check className="w-4 h-4 opacity-70" />
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-[#25D366]/10 bg-[#111814]/80">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Smile className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Input
                  placeholder="Digite uma mensagem..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1 bg-[#0a0f0d] border-[#25D366]/20 text-white"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-[#25D366] hover:bg-[#22c55e] text-white"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-[#0a0f0d]">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#25D366]/10 flex items-center justify-center">
                <MessageCircle className="w-12 h-12 text-[#25D366]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">WhatsApp CRM</h3>
              <p className="text-gray-400">Selecione uma conversa para começar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
