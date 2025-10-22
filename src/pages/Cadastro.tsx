import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Cadastro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email || !formData.senha || !formData.confirmarSenha) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (formData.senha.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      // Criar usuário
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.senha,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            nome: formData.nome,
          }
        }
      });

      if (authError) {
        if (authError.message.includes("User already registered")) {
          toast.error("Este email já está cadastrado");
        } else {
          toast.error(authError.message);
        }
        return;
      }

      if (authData.user) {
        // Criar perfil do usuário
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: authData.user.id,
            nome: formData.nome,
            email: formData.email,
          });

        if (profileError) {
          console.error("Erro ao criar perfil:", profileError);
        }
      }

      toast.success("Cadastro realizado com sucesso!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Erro no cadastro:", error);
      toast.error("Erro ao fazer cadastro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
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
          <h1 className="text-2xl font-bold text-foreground">Criar Conta</h1>
          <p className="text-muted-foreground">
            Preencha os dados para criar sua conta
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-foreground">
              Nome completo
            </Label>
            <Input
              id="nome"
              type="text"
              placeholder="Seu nome"
              value={formData.nome}
              onChange={handleChange}
              className="h-12 rounded-xl bg-input border-0 placeholder:text-muted-foreground/60"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
              className="h-12 rounded-xl bg-input border-0 placeholder:text-muted-foreground/60"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="senha" className="text-foreground">
              Senha
            </Label>
            <Input
              id="senha"
              type="password"
              placeholder="••••••••"
              value={formData.senha}
              onChange={handleChange}
              className="h-12 rounded-xl bg-input border-0 placeholder:text-muted-foreground/60"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmarSenha" className="text-foreground">
              Confirmar senha
            </Label>
            <Input
              id="confirmarSenha"
              type="password"
              placeholder="••••••••"
              value={formData.confirmarSenha}
              onChange={handleChange}
              className="h-12 rounded-xl bg-input border-0 placeholder:text-muted-foreground/60"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-base font-semibold rounded-xl"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Criando conta..." : "Criar conta"}
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Já tem uma conta? </span>
          <Link 
            to="/login" 
            className="text-primary font-semibold hover:text-primary/80 transition-colors"
          >
            Fazer login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
