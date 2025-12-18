import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { WhatsAppLogin } from "@/components/whatsapp/WhatsAppLogin";
import { WhatsAppDashboard } from "@/components/whatsapp/WhatsAppDashboard";
import { WhatsAppSidebar } from "@/components/whatsapp/WhatsAppSidebar";
import { WhatsAppConnections } from "@/components/whatsapp/WhatsAppConnections";
import { WhatsAppConversations } from "@/components/whatsapp/WhatsAppConversations";
import { WhatsAppFlows } from "@/components/whatsapp/WhatsAppFlows";
import { WhatsAppScheduled } from "@/components/whatsapp/WhatsAppScheduled";
import { WhatsAppContacts } from "@/components/whatsapp/WhatsAppContacts";
import { WhatsAppSettings } from "@/components/whatsapp/WhatsAppSettings";

type ActiveView = "dashboard" | "connections" | "conversations" | "flows" | "scheduled" | "contacts" | "settings";

const WhatsAppCRM = () => {
  const { user, session } = useAuth();
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const loading = session === undefined;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f0d] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#25D366] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <WhatsAppLogin />;
  }

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <WhatsAppDashboard />;
      case "connections":
        return <WhatsAppConnections />;
      case "conversations":
        return <WhatsAppConversations />;
      case "flows":
        return <WhatsAppFlows />;
      case "scheduled":
        return <WhatsAppScheduled />;
      case "contacts":
        return <WhatsAppContacts />;
      case "settings":
        return <WhatsAppSettings />;
      default:
        return <WhatsAppDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f0d] flex">
      <WhatsAppSidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default WhatsAppCRM;
