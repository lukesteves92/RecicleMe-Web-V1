import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const RecuperarSenha = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Por favor, digite seu email");
      return;
    }

    toast.success("Código de recuperação enviado para seu email!");
    setTimeout(() => navigate("/login"), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background px-6 py-12">
      <div className="w-full max-w-md mx-auto space-y-8 animate-fade-in">
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Voltar</span>
        </Link>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Recuperar Senha</h1>
          <p className="text-muted-foreground">
            Digite seu email para receber o código de recuperação
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Digite seu email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-xl bg-input border-0 placeholder:text-muted-foreground/60"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-base font-semibold rounded-xl"
            size="lg"
          >
            Enviar código
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RecuperarSenha;
