import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Zap, 
  CheckCircle2, 
  Loader2,
  Send,
  FileText,
  Palette,
  Users,
  CreditCard,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import confetti from 'canvas-confetti';

export default function Onboarding() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form fields
  const [productName, setProductName] = useState('');
  const [productType, setProductType] = useState('curso');
  const [productDescription, setProductDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [infinitepayUsername, setInfinitepayUsername] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactWhatsapp, setContactWhatsapp] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  useEffect(() => {
    // Trigger confetti on load
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00D26A', '#ffffff', '#10B981']
    });
    setIsLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productName || !productDescription || !infinitepayUsername || !contactEmail) {
      toast({ 
        title: "Preencha os campos obrigatórios", 
        variant: "destructive" 
      });
      return;
    }

    setIsSubmitting(true);

    // Here you would save the onboarding data to Supabase
    // For now, we'll just simulate success
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({ 
      title: "Solicitação enviada com sucesso!",
      description: "Entraremos em contato em até 24 horas."
    });

    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#00D26A', '#ffffff', '#10B981']
    });

    setSubmitted(true);
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00D26A] animate-spin" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-[#00D26A] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-zinc-950" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Solicitação Recebida!
          </h1>
          <p className="text-zinc-400 mb-8">
            Nossa equipe está criando sua área de membros. 
            Em até <span className="text-[#00D26A] font-bold">24 horas</span> você receberá 
            os dados de acesso no e-mail informado.
          </p>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-left mb-8">
            <h3 className="text-white font-semibold mb-4">Próximos passos:</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#00D26A]/20 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-[#00D26A] text-xs font-bold">1</span>
                </div>
                <p className="text-zinc-400 text-sm">
                  Criaremos sua página de vendas com base nas informações fornecidas
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#00D26A]/20 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-[#00D26A] text-xs font-bold">2</span>
                </div>
                <p className="text-zinc-400 text-sm">
                  Configuraremos sua área de membros e integração com InfinitePay
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#00D26A]/20 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-[#00D26A] text-xs font-bold">3</span>
                </div>
                <p className="text-zinc-400 text-sm">
                  Você receberá acesso admin para adicionar seu conteúdo
                </p>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/')}
            className="bg-[#00D26A] hover:bg-[#00D26A]/90 text-zinc-950"
          >
            Voltar ao Início
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#00D26A]/10 border border-[#00D26A]/30 rounded-full px-4 py-2 mb-6">
            <CheckCircle2 className="w-4 h-4 text-[#00D26A]" />
            <span className="text-sm text-[#00D26A] font-medium">Pagamento Confirmado!</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Vamos criar sua <span className="text-[#00D26A]">área de membros</span>
          </h1>
          <p className="text-zinc-400">
            Preencha as informações abaixo. Em até 24 horas sua página estará pronta.
          </p>
        </div>

        {/* Form */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#00D26A]" />
              Informações do Produto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Name */}
              <div className="space-y-2">
                <Label className="text-zinc-300">Nome do Produto *</Label>
                <Input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Ex: Curso de Marketing Digital"
                  className="bg-zinc-800 border-zinc-700 text-white"
                  required
                />
              </div>

              {/* Product Type */}
              <div className="space-y-2">
                <Label className="text-zinc-300">Tipo de Produto *</Label>
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full p-3 rounded-md bg-zinc-800 border border-zinc-700 text-white"
                >
                  <option value="curso">Curso Online</option>
                  <option value="comunidade">Comunidade/Grupo</option>
                  <option value="mentoria">Mentoria</option>
                  <option value="ebook">E-book / Material</option>
                  <option value="servico">Serviço/Assinatura</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              {/* Product Description */}
              <div className="space-y-2">
                <Label className="text-zinc-300">Descrição do Produto *</Label>
                <Textarea
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="Descreva seu produto em detalhes: o que ensina, benefícios, diferenciais, público-alvo, etc."
                  className="bg-zinc-800 border-zinc-700 text-white min-h-[150px]"
                  required
                />
              </div>

              {/* Target Audience */}
              <div className="space-y-2">
                <Label className="text-zinc-300">Público-Alvo</Label>
                <Input
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="Ex: Mulheres de 25-45 anos interessadas em beleza"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label className="text-zinc-300">Preço de Venda (R$)</Label>
                <Input
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  placeholder="Ex: 97"
                  type="number"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              {/* Separator */}
              <div className="border-t border-zinc-800 pt-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#00D26A]" />
                  Dados InfinitePay
                </h3>
              </div>

              {/* InfinitePay Username */}
              <div className="space-y-2">
                <Label className="text-zinc-300">Usuário InfinitePay *</Label>
                <div className="flex items-center">
                  <span className="bg-zinc-700 text-zinc-400 px-3 py-2 rounded-l-md border border-r-0 border-zinc-700 text-sm">
                    checkout.infinitepay.io/
                  </span>
                  <Input
                    value={infinitepayUsername}
                    onChange={(e) => setInfinitepayUsername(e.target.value)}
                    placeholder="seuusuario"
                    className="bg-zinc-800 border-zinc-700 text-white rounded-l-none"
                    required
                  />
                </div>
                <p className="text-zinc-500 text-xs">
                  Digite apenas seu usuário. Ex: se seu link é checkout.infinitepay.io/maria, digite apenas "maria"
                </p>
              </div>

              {/* Separator */}
              <div className="border-t border-zinc-800 pt-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#00D26A]" />
                  Contato
                </h3>
              </div>

              {/* Contact Email */}
              <div className="space-y-2">
                <Label className="text-zinc-300">E-mail *</Label>
                <Input
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="seu@email.com"
                  type="email"
                  className="bg-zinc-800 border-zinc-700 text-white"
                  required
                />
              </div>

              {/* WhatsApp */}
              <div className="space-y-2">
                <Label className="text-zinc-300">WhatsApp</Label>
                <Input
                  value={contactWhatsapp}
                  onChange={(e) => setContactWhatsapp(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              {/* Additional Info */}
              <div className="space-y-2">
                <Label className="text-zinc-300">Informações Adicionais</Label>
                <Textarea
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="Alguma informação extra? Cores preferidas, referências de design, módulos do curso, etc."
                  className="bg-zinc-800 border-zinc-700 text-white min-h-[100px]"
                />
              </div>

              {/* Info Box */}
              <div className="bg-[#00D26A]/10 border border-[#00D26A]/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#00D26A] mt-0.5" />
                  <div>
                    <p className="text-white font-medium text-sm">Prazo de Entrega: 24 horas</p>
                    <p className="text-zinc-400 text-xs mt-1">
                      Você receberá acesso admin por e-mail para adicionar seus vídeos e conteúdos.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#00D26A] hover:bg-[#00D26A]/90 text-zinc-950 py-6 text-lg font-bold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Enviar Solicitação
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
