import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Shield, Settings, Users, BarChart3, ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";

interface PlatformSetting {
  id: string;
  key: string;
  value: any;
  description: string;
}

interface Stats {
  totalUsers: number;
  totalColetas: number;
  totalPontos: number;
  totalCategorias: number;
}

export default function Admin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [settings, setSettings] = useState<PlatformSetting[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalColetas: 0,
    totalPontos: 0,
    totalCategorias: 0,
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Acesso negado. Faça login primeiro.");
        navigate("/login");
        return;
      }

      // Verificar se é admin
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (roleError || !roleData) {
        toast.error("Acesso negado. Apenas administradores podem acessar esta página.");
        navigate("/");
        return;
      }

      setIsAdmin(true);
      await loadSettings();
      await loadStats();
    } catch (error) {
      console.error("Erro ao verificar acesso admin:", error);
      toast.error("Erro ao verificar permissões");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    const { data, error } = await supabase
      .from("platform_settings")
      .select("*")
      .order("key");

    if (error) {
      toast.error("Erro ao carregar configurações");
      console.error(error);
      return;
    }

    setSettings(data || []);
  };

  const loadStats = async () => {
    // Total de usuários
    const { count: usersCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    // Total de coletas
    const { count: coletasCount } = await supabase
      .from("coletas")
      .select("*", { count: "exact", head: true });

    // Total de pontos
    const { data: pontosData } = await supabase
      .from("coletas")
      .select("pontos_ganhos");

    const totalPontos = pontosData?.reduce((sum, c) => sum + (c.pontos_ganhos || 0), 0) || 0;

    // Total de categorias
    const { count: categoriasCount } = await supabase
      .from("categorias")
      .select("*", { count: "exact", head: true });

    setStats({
      totalUsers: usersCount || 0,
      totalColetas: coletasCount || 0,
      totalPontos,
      totalCategorias: categoriasCount || 0,
    });
  };

  const updateSetting = async (key: string, newValue: any) => {
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("platform_settings")
      .update({ 
        value: newValue,
        updated_by: user?.id 
      })
      .eq("key", key);

    if (error) {
      toast.error(`Erro ao atualizar ${key}`);
      console.error(error);
      return;
    }

    toast.success("Configuração atualizada com sucesso");
    await loadSettings();
  };

  const toggleBooleanSetting = async (key: string, currentValue: boolean) => {
    await updateSetting(key, !currentValue);
  };

  const updateNumberSetting = async (key: string, value: string) => {
    const numValue = parseInt(value);
    if (isNaN(numValue)) {
      toast.error("Valor inválido");
      return;
    }
    await updateSetting(key, numValue);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const coletasEnabled = settings.find(s => s.key === "coletas_enabled")?.value === "true";
  const chatEnabled = settings.find(s => s.key === "chat_enabled")?.value === "true";
  const notificationsEnabled = settings.find(s => s.key === "notifications_enabled")?.value === "true";
  const maxColetasPerDay = settings.find(s => s.key === "max_coletas_per_day")?.value || "10";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Logo />
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <Shield className="h-8 w-8 text-primary" />
                  Painel Administrativo
                </h1>
                <p className="text-muted-foreground">Controle e parametrização da plataforma ReUse</p>
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Coletas</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalColetas}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pontos Distribuídos</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPontos.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categorias Ativas</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCategorias}</div>
            </CardContent>
          </Card>
        </div>

        {/* Configurações da Plataforma */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurações da Plataforma
            </CardTitle>
            <CardDescription>
              Ative ou desative funcionalidades e defina parâmetros globais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sistema de Coletas */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sistema de Coletas</Label>
                <p className="text-sm text-muted-foreground">
                  Permite que usuários agendem e registrem coletas
                </p>
              </div>
              <Switch
                checked={coletasEnabled}
                onCheckedChange={() => toggleBooleanSetting("coletas_enabled", coletasEnabled)}
              />
            </div>

            <Separator />

            {/* Chat de Suporte */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Chat de Suporte</Label>
                <p className="text-sm text-muted-foreground">
                  Assistente virtual flutuante para dúvidas
                </p>
              </div>
              <Switch
                checked={chatEnabled}
                onCheckedChange={() => toggleBooleanSetting("chat_enabled", chatEnabled)}
              />
            </div>

            <Separator />

            {/* Notificações */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações</Label>
                <p className="text-sm text-muted-foreground">
                  Sistema de notificações para usuários
                </p>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={() => toggleBooleanSetting("notifications_enabled", notificationsEnabled)}
              />
            </div>

            <Separator />

            {/* Limite de Coletas */}
            <div className="space-y-2">
              <Label htmlFor="maxColetas">Máximo de Coletas por Dia (por usuário)</Label>
              <div className="flex gap-2">
                <Input
                  id="maxColetas"
                  type="number"
                  min="1"
                  max="100"
                  defaultValue={maxColetasPerDay}
                  className="max-w-xs"
                />
                <Button
                  onClick={(e) => {
                    const input = document.getElementById("maxColetas") as HTMLInputElement;
                    updateNumberSetting("max_coletas_per_day", input.value);
                  }}
                >
                  Atualizar
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Define quantas coletas um usuário pode registrar por dia
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Instruções Node-RED */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>🔗 Integração com Node-RED</CardTitle>
            <CardDescription>
              Este painel pode ser controlado remotamente via Node-RED
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="font-semibold">Endpoints Disponíveis:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><code>/admin-api/settings</code> - Listar/Atualizar configurações</li>
                <li><code>/admin-api/stats</code> - Obter estatísticas da plataforma</li>
                <li><code>/admin-api/toggle-feature</code> - Ativar/Desativar funcionalidades</li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground">
              Importe o arquivo <code>node-red-flows.json</code> no seu Node-RED local para começar.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
