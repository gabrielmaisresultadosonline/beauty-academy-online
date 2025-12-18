import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageCircle, 
  QrCode, 
  Phone, 
  Users, 
  Search, 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical,
  CheckCheck,
  Clock,
  Star,
  Tag,
  Filter,
  Plus,
  Settings,
  LogOut,
  Smartphone,
  RefreshCw,
  ArrowLeft,
  Image,
  Mic,
  Video,
  FileText,
  Download,
  Trash2,
  Archive,
  Bell,
  BellOff,
  Pin,
  UserPlus
} from 'lucide-react';
import { toast } from 'sonner';

interface Contact {
  id: string;
  name: string;
  phone: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  tags: string[];
  avatar?: string;
  isPinned?: boolean;
  isMuted?: boolean;
}

interface Message {
  id: string;
  content: string;
  timestamp: string;
  isFromMe: boolean;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'audio' | 'document';
}

const CRMWhatsApp = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [qrCodeTimer, setQrCodeTimer] = useState(60);

  // Demo contacts
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Maria Silva',
      phone: '+55 11 99999-1111',
      lastMessage: 'Olá, gostaria de saber mais sobre o curso',
      lastMessageTime: '10:30',
      unreadCount: 3,
      isOnline: true,
      tags: ['Lead', 'Interessado'],
      isPinned: true
    },
    {
      id: '2',
      name: 'João Santos',
      phone: '+55 11 99999-2222',
      lastMessage: 'Obrigado pelo atendimento!',
      lastMessageTime: '09:15',
      unreadCount: 0,
      isOnline: false,
      tags: ['Cliente']
    },
    {
      id: '3',
      name: 'Ana Costa',
      phone: '+55 11 99999-3333',
      lastMessage: 'Qual o valor do plano premium?',
      lastMessageTime: 'Ontem',
      unreadCount: 1,
      isOnline: true,
      tags: ['Lead']
    },
    {
      id: '4',
      name: 'Pedro Oliveira',
      phone: '+55 11 99999-4444',
      lastMessage: 'Vou fazer o pagamento amanhã',
      lastMessageTime: 'Ontem',
      unreadCount: 0,
      isOnline: false,
      tags: ['Negociação']
    },
    {
      id: '5',
      name: 'Carla Mendes',
      phone: '+55 11 99999-5555',
      lastMessage: 'Perfeito! Já acessei a plataforma',
      lastMessageTime: '15/12',
      unreadCount: 0,
      isOnline: false,
      tags: ['Cliente', 'Premium']
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Olá, gostaria de saber mais sobre o curso',
      timestamp: '10:25',
      isFromMe: false,
      status: 'read',
      type: 'text'
    },
    {
      id: '2',
      content: 'Olá Maria! Claro, temos várias opções de cursos. Qual área te interessa mais?',
      timestamp: '10:26',
      isFromMe: true,
      status: 'read',
      type: 'text'
    },
    {
      id: '3',
      content: 'Estou interessada na área de beleza, especialmente alisamento',
      timestamp: '10:28',
      isFromMe: false,
      status: 'read',
      type: 'text'
    },
    {
      id: '4',
      content: 'Excelente escolha! Temos o curso Liso Perfeito que é muito completo. Posso te enviar mais informações?',
      timestamp: '10:29',
      isFromMe: true,
      status: 'read',
      type: 'text'
    },
    {
      id: '5',
      content: 'Sim, por favor! Qual o valor?',
      timestamp: '10:30',
      isFromMe: false,
      status: 'read',
      type: 'text'
    }
  ]);

  // QR Code timer
  useEffect(() => {
    if (isConnecting && qrCodeTimer > 0) {
      const timer = setTimeout(() => setQrCodeTimer(qrCodeTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [isConnecting, qrCodeTimer]);

  const handleConnect = () => {
    setIsConnecting(true);
    setQrCodeTimer(60);
    
    // Simulate connection after 3 seconds
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
      toast.success('WhatsApp conectado com sucesso!');
    }, 3000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setSelectedContact(null);
    toast.info('WhatsApp desconectado');
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: messageInput,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      isFromMe: true,
      status: 'sent',
      type: 'text'
    };
    
    setMessages([...messages, newMessage]);
    setMessageInput('');
    
    // Update contact's last message
    if (selectedContact) {
      setContacts(contacts.map(c => 
        c.id === selectedContact.id 
          ? { ...c, lastMessage: messageInput, lastMessageTime: 'Agora' }
          : c
      ));
    }

    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev => prev.map(m => 
        m.id === newMessage.id ? { ...m, status: 'delivered' } : m
      ));
    }, 1000);

    // Simulate message read
    setTimeout(() => {
      setMessages(prev => prev.map(m => 
        m.id === newMessage.id ? { ...m, status: 'read' } : m
      ));
    }, 2000);
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.phone.includes(searchQuery);
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'unread') return matchesSearch && contact.unreadCount > 0;
    if (activeTab === 'leads') return matchesSearch && contact.tags.includes('Lead');
    if (activeTab === 'clients') return matchesSearch && contact.tags.includes('Cliente');
    
    return matchesSearch;
  });

  const sortedContacts = [...filteredContacts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Clock className="w-3 h-3 text-muted-foreground" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-muted-foreground" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  // QR Code Connection Screen
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl">CRM WhatsApp</CardTitle>
            <p className="text-muted-foreground">
              Conecte seu WhatsApp para gerenciar conversas
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isConnecting ? (
              <>
                <div className="bg-muted/50 rounded-lg p-6 text-center">
                  <Smartphone className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Como conectar:</h3>
                  <ol className="text-sm text-muted-foreground text-left space-y-2">
                    <li>1. Abra o WhatsApp no seu celular</li>
                    <li>2. Toque em Menu ou Configurações</li>
                    <li>3. Selecione "Aparelhos conectados"</li>
                    <li>4. Toque em "Conectar um aparelho"</li>
                    <li>5. Escaneie o QR Code</li>
                  </ol>
                </div>
                <Button 
                  onClick={handleConnect} 
                  className="w-full bg-green-500 hover:bg-green-600"
                  size="lg"
                >
                  <QrCode className="w-5 h-5 mr-2" />
                  Gerar QR Code
                </Button>
              </>
            ) : (
              <>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center border-2 border-dashed border-green-500">
                  {/* Simulated QR Code */}
                  <div className="w-48 h-48 mx-auto mb-4 bg-black p-2 rounded-lg">
                    <div className="w-full h-full grid grid-cols-8 gap-0.5">
                      {Array(64).fill(0).map((_, i) => (
                        <div 
                          key={i} 
                          className={`${Math.random() > 0.5 ? 'bg-white' : 'bg-black'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Escaneie o QR Code com seu WhatsApp
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <RefreshCw className="w-4 h-4 animate-spin text-green-500" />
                    <span>Aguardando conexão... ({qrCodeTimer}s)</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setIsConnecting(false)}
                  className="w-full"
                >
                  Cancelar
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main CRM Interface
  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar - Contact List */}
      <div className={`w-full md:w-96 border-r flex flex-col ${selectedContact ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
        <div className="p-4 border-b bg-green-500 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-semibold">CRM WhatsApp</h2>
                <p className="text-xs text-white/80">Conectado</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Plus className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20"
                onClick={handleDisconnect}
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
            <Input 
              placeholder="Buscar conversas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/20 border-0 text-white placeholder:text-white/60 focus-visible:ring-white/30"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-auto p-0">
            <TabsTrigger 
              value="all" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-500 data-[state=active]:bg-transparent"
            >
              Todas
            </TabsTrigger>
            <TabsTrigger 
              value="unread"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-500 data-[state=active]:bg-transparent"
            >
              Não lidas
              {contacts.filter(c => c.unreadCount > 0).length > 0 && (
                <Badge className="ml-1 bg-green-500 text-white text-xs px-1.5">
                  {contacts.filter(c => c.unreadCount > 0).length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="leads"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-500 data-[state=active]:bg-transparent"
            >
              Leads
            </TabsTrigger>
            <TabsTrigger 
              value="clients"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-500 data-[state=active]:bg-transparent"
            >
              Clientes
            </TabsTrigger>
          </TabsList>

          {/* Contact List */}
          <ScrollArea className="flex-1">
            <div className="divide-y">
              {sortedContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => {
                    setSelectedContact(contact);
                    // Clear unread count
                    setContacts(contacts.map(c => 
                      c.id === contact.id ? { ...c, unreadCount: 0 } : c
                    ));
                  }}
                  className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedContact?.id === contact.id ? 'bg-muted' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-green-100 text-green-700">
                          {contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      {contact.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {contact.isPinned && <Pin className="w-3 h-3 text-muted-foreground" />}
                          <span className="font-medium truncate">{contact.name}</span>
                        </div>
                        <span className={`text-xs ${contact.unreadCount > 0 ? 'text-green-500 font-medium' : 'text-muted-foreground'}`}>
                          {contact.lastMessageTime}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate pr-2">
                          {contact.lastMessage}
                        </p>
                        {contact.unreadCount > 0 && (
                          <Badge className="bg-green-500 text-white text-xs px-1.5 min-w-[20px] flex items-center justify-center">
                            {contact.unreadCount}
                          </Badge>
                        )}
                      </div>
                      {contact.tags.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {contact.tags.map((tag, i) => (
                            <Badge 
                              key={i} 
                              variant="secondary" 
                              className="text-xs px-1.5 py-0"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Tabs>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${!selectedContact ? 'hidden md:flex' : 'flex'}`}>
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden"
                  onClick={() => setSelectedContact(null)}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-green-100 text-green-700">
                      {selectedContact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  {selectedContact.isOnline && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{selectedContact.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedContact.isOnline ? 'Online' : 'Offline'} • {selectedContact.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Search className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat">
              <div className="space-y-3 max-w-3xl mx-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isFromMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-3 py-2 ${
                        message.isFromMe
                          ? 'bg-green-500 text-white rounded-br-none'
                          : 'bg-white dark:bg-gray-800 rounded-bl-none shadow-sm'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 ${
                        message.isFromMe ? 'text-white/70' : 'text-muted-foreground'
                      }`}>
                        <span className="text-xs">{message.timestamp}</span>
                        {message.isFromMe && getStatusIcon(message.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t bg-card">
              <div className="flex items-end gap-2">
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <Smile className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                </div>
                <Textarea
                  placeholder="Digite uma mensagem..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="min-h-[44px] max-h-32 resize-none"
                  rows={1}
                />
                <Button 
                  onClick={handleSendMessage}
                  size="icon"
                  className="bg-green-500 hover:bg-green-600 shrink-0"
                >
                  {messageInput.trim() ? (
                    <Send className="w-5 h-5" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center bg-muted/30">
            <div className="text-center">
              <div className="w-64 h-64 mx-auto mb-6 opacity-50">
                <svg viewBox="0 0 303 172" className="w-full h-full">
                  <path
                    fill="currentColor"
                    className="text-muted-foreground"
                    d="M229.565 160.229c32.647-10.984 57.366-41.988 53.825-86.81-5.381-68.1-71.025-84.478-111.915-71.478C115.715 18.79 76.683 42.78 57.478 66.884c-23.564 29.582-17.9 77.2 11.988 97.118 35.2 23.478 117.936 11.728 160.1-3.773z"
                  />
                  <path
                    fill="currentColor"
                    className="text-background"
                    d="M123.218 40.082c-17.3 5.073-34.47 16.588-45.043 32.86-9.478 14.594-12.628 32.203-8.336 48.282 4.4 16.476 15.593 29.973 30.973 37.313 12.037 5.744 25.17 7.59 38.186 5.378 13.64-2.317 26.012-8.916 35.913-18.9 11.29-11.387 19.316-26.18 21.972-42.368 2.94-17.91-1.14-36.985-11.77-51.186-10.244-13.698-26.49-22.07-43.33-22.58a69.498 69.498 0 0 0-18.565 1.201z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                WhatsApp CRM
              </h3>
              <p className="text-muted-foreground">
                Selecione uma conversa para começar
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Contact Info Sidebar - Only visible on larger screens */}
      {selectedContact && (
        <div className="hidden lg:flex w-80 border-l flex-col bg-card">
          <div className="p-6 text-center border-b">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarFallback className="bg-green-100 text-green-700 text-2xl">
                {selectedContact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-lg">{selectedContact.name}</h3>
            <p className="text-sm text-muted-foreground">{selectedContact.phone}</p>
            <div className="flex gap-2 justify-center mt-4">
              {selectedContact.tags.map((tag, i) => (
                <Badge key={i} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="h-7">
                    <Plus className="w-3 h-3 mr-1" />
                    Adicionar tag
                  </Button>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Ações rápidas</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="justify-start">
                    <Pin className="w-4 h-4 mr-2" />
                    Fixar
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    <BellOff className="w-4 h-4 mr-2" />
                    Silenciar
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    <Archive className="w-4 h-4 mr-2" />
                    Arquivar
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Notas</h4>
                <Textarea 
                  placeholder="Adicione notas sobre este contato..."
                  className="min-h-[100px]"
                />
                <Button size="sm" className="mt-2 w-full">
                  Salvar nota
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default CRMWhatsApp;
