import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, User } from "lucide-react";

const DemoLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === "teste" && password === "teste") {
      localStorage.setItem("demo_authenticated", "true");
      toast.success("Login realizado! Bem-vindo à demonstração.");
      navigate("/demonstracao/admin");
    } else {
      toast.error("Credenciais inválidas. Use: teste / teste");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-2">Demonstração</h1>
          <p className="text-zinc-400">Veja como funciona uma Área de Membros</p>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white text-center">Acesso Demonstração</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-zinc-300">Usuário</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="teste"
                    className="pl-10 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="teste"
                    className="pl-10 pr-10 bg-zinc-800 border-zinc-700 text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
                <p className="text-zinc-400 text-sm">
                  Use as credenciais: <span className="text-[#00D26A] font-bold">teste</span> / <span className="text-[#00D26A] font-bold">teste</span>
                </p>
              </div>

              <Button type="submit" className="w-full bg-[#00D26A] hover:bg-[#00D26A]/90 text-black font-black">
                ENTRAR NA DEMONSTRAÇÃO
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-zinc-500 text-sm mt-6">
          Esta é uma demonstração. Os dados são salvos apenas no seu navegador.
        </p>
      </div>
    </div>
  );
};

export default DemoLogin;
