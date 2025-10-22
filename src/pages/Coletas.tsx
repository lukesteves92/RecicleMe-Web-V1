import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, MapPin, Calendar, Award, ArrowLeft } from "lucide-react";

interface Coleta {
  id: string;
  tipo_residuo: string;
  quantidade: number;
  unidade: string;
  ponto_coleta: string;
  endereco: string;
  data_coleta: string;
  status: string;
  pontos_ganhos: number;
}

const Coletas = () => {
  const navigate = useNavigate();
  const [coletas, setColetas] = useState<Coleta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Verificar autenticação
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
      } else {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/login");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      loadColetas();
    }
  }, [user]);

  const loadColetas = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('coletas')
        .select('*')
        .order('data_coleta', { ascending: false });

      if (error) throw error;

      setColetas(data || []);
    } catch (error) {
      console.error('Erro ao carregar coletas:', error);
      toast.error('Erro ao carregar coletas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const getStatusBadge = (status: string) => {
    if (status === 'concluído') {
      return <Badge className="bg-secondary">Concluído</Badge>;
    }
    return <Badge variant="outline">Pendente</Badge>;
  };

  const totalPontos = coletas.reduce((sum, coleta) => sum + coleta.pontos_ganhos, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="sm" showText={true} />
          <nav className="flex gap-4">
            <Button variant="ghost" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button variant="ghost" onClick={() => navigate("/perfil")}>
              Perfil
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Sair
            </Button>
          </nav>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Estatísticas */}
          <Card className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Minhas Coletas</h2>
                  <p className="opacity-90">Acompanhe seu histórico de reciclagem</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-3xl font-bold">
                    <Award className="w-8 h-8" />
                    {totalPontos}
                  </div>
                  <p className="text-sm opacity-90">Pontos Acumulados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Coletas */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Histórico de Coletas</h3>
            
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Carregando...</p>
              </div>
            ) : coletas.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Trash2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Nenhuma coleta registrada ainda.</p>
                  <Button className="mt-4" onClick={() => navigate("/")}>
                    Começar a Reciclar
                  </Button>
                </CardContent>
              </Card>
            ) : (
              coletas.map((coleta) => (
                <Card 
                  key={coleta.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/coletas/${coleta.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Trash2 className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{coleta.tipo_residuo}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {coleta.quantidade} {coleta.unidade}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(coleta.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <div>
                        <p className="font-medium">{coleta.ponto_coleta}</p>
                        <p>{coleta.endereco}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {new Date(coleta.data_coleta).toLocaleDateString('pt-BR')}
                      </div>
                      {coleta.pontos_ganhos > 0 && (
                        <div className="flex items-center gap-1 text-sm font-semibold text-secondary">
                          <Award className="w-4 h-4" />
                          +{coleta.pontos_ganhos} pontos
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coletas;
