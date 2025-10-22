import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, MapPin, Calendar, Package, Award, Image as ImageIcon } from "lucide-react";

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
  foto_url?: string;
}

const ColetaDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coleta, setColeta] = useState<Coleta | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
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
    if (user && id) {
      loadColeta();
    }
  }, [user, id]);

  const loadColeta = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('coletas')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setColeta(data);
    } catch (error) {
      console.error('Erro ao carregar coleta:', error);
      toast.error('Erro ao carregar coleta');
      navigate("/coletas");
    } finally {
      setLoading(false);
    }
  };

  const handleConcluir = async () => {
    if (!coleta) return;

    try {
      const quantidade = coleta.quantidade;
      const pontosPorKg = coleta.tipo_residuo === "Metal" ? 15 : 
                          coleta.tipo_residuo === "Plástico" || coleta.tipo_residuo === "Vidro" ? 10 : 8;
      const pontosGanhos = Math.round(quantidade * pontosPorKg);

      const { error } = await supabase
        .from('coletas')
        .update({
          status: 'concluído',
          pontos_ganhos: pontosGanhos
        })
        .eq('id', coleta.id);

      if (error) throw error;

      toast.success(`Coleta concluída! Você ganhou ${pontosGanhos} pontos!`);
      loadColeta();
    } catch (error) {
      console.error('Erro ao concluir coleta:', error);
      toast.error('Erro ao concluir coleta');
    }
  };

  const handleCancelar = async () => {
    if (!coleta) return;

    if (!confirm('Tem certeza que deseja cancelar esta coleta?')) return;

    try {
      const { error } = await supabase
        .from('coletas')
        .delete()
        .eq('id', coleta.id);

      if (error) throw error;

      toast.success('Coleta cancelada');
      navigate("/coletas");
    } catch (error) {
      console.error('Erro ao cancelar coleta:', error);
      toast.error('Erro ao cancelar coleta');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!coleta) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    if (status === 'concluído') {
      return <Badge className="bg-secondary">Concluído</Badge>;
    }
    return <Badge variant="outline">Pendente</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="sm" showText={true} />
          <Button variant="ghost" onClick={() => navigate("/coletas")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Coletas
          </Button>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Card Principal */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">{coleta.tipo_residuo}</CardTitle>
                  <p className="text-muted-foreground">
                    {coleta.quantidade} {coleta.unidade}
                  </p>
                </div>
                {getStatusBadge(coleta.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Foto */}
              {coleta.foto_url && (
                <div className="rounded-lg overflow-hidden border">
                  <img 
                    src={coleta.foto_url} 
                    alt="Foto da coleta" 
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              {/* Informações */}
              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">{coleta.ponto_coleta}</p>
                    <p className="text-sm text-muted-foreground">{coleta.endereco}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Data da Coleta</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(coleta.data_coleta).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Material</p>
                    <p className="text-sm text-muted-foreground">
                      {coleta.tipo_residuo} - {coleta.quantidade} {coleta.unidade}
                    </p>
                  </div>
                </div>

                {coleta.pontos_ganhos > 0 && (
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-secondary" />
                    <div>
                      <p className="font-semibold text-secondary">Pontos Ganhos</p>
                      <p className="text-sm text-muted-foreground">
                        +{coleta.pontos_ganhos} pontos
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Ações */}
              {coleta.status === 'pendente' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    onClick={handleConcluir}
                    className="flex-1"
                  >
                    Marcar como Concluída
                  </Button>
                  <Button 
                    onClick={handleCancelar}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancelar Coleta
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ColetaDetalhe;
