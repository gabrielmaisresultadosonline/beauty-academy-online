interface WhatsAppProofProps {
  name: string;
  message: string;
  time: string;
  avatar: string;
}

const WhatsAppProof = ({ name, message, time, avatar }: WhatsAppProofProps) => {
  return (
    <div className="flex gap-3 animate-fade-in">
      <img
        src={avatar}
        alt={name}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1">
        <div className="whatsapp-bubble bg-[hsl(142,70%,95%)] rounded-lg rounded-tl-none p-3 shadow-sm">
          <p className="text-xs font-semibold text-success mb-1">{name}</p>
          <p className="text-sm text-foreground leading-relaxed">{message}</p>
          <p className="text-[10px] text-muted-foreground text-right mt-1">{time}</p>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppProof;
