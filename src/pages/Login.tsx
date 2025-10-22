import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redirecionar se já estiver autenticado
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Email ou senha incorretos");
        } else {
          toast.error(error.message);
        }
        return;
      }

      toast.success("Login realizado com sucesso!");
      navigate("/");
    } catch (error) {
      console.error("Erro no login:", error);
      toast.error("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md mx-auto space-y-8 animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Bem-vindo de volta!</h1>
          <p className="text-muted-foreground">Faça seu login</p>
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

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              Digite sua senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 rounded-xl bg-input border-0 placeholder:text-muted-foreground/60"
            />
          </div>

          <div className="text-right">
            <Link 
              to="/recuperar-senha" 
              className="text-sm text-foreground hover:text-primary transition-colors"
            >
              Esqueceu a senha?
            </Link>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-base font-semibold rounded-xl"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Ainda não tem uma conta? </span>
          <Link 
            to="/cadastro" 
            className="text-primary font-semibold hover:text-primary/80 transition-colors"
          >
            Faça seu cadastro
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
