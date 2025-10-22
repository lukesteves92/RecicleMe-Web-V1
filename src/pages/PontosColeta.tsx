import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Logo from "@/components/Logo";
import FloatingChat from "@/components/FloatingChat";
import ImageUpload from "@/components/ImageUpload";
import { MapPin, ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Pontos de coleta com endereços reais da Zona Sul de São Paulo
const pontosColeta = [
  {
    id: 1,
    nome: "EcoPonto Shopping Ibirapuera",
    endereco: "Av. Ibirapuera, 3103 - Moema, São Paulo - SP",
    lat: -23.5975,
    lng: -46.6575,
    tipos: ["Plástico", "Papel", "Vidro", "Metal"]
  },
  {
    id: 2,
    nome: "Cooperativa ReciclaVida Brooklin",
    endereco: "Av. Eng. Luís Carlos Berrini, 1461 - Brooklin, São Paulo - SP",
    lat: -23.6129,
    lng: -46.6925,
    tipos: ["Plástico", "Papel", "Metal", "Eletrônicos"]
  },
  {
    id: 3,
    nome: "EcoPonto Parque Ibirapuera",
    endereco: "Av. Pedro Álvares Cabral - Vila Mariana, São Paulo - SP",
    lat: -23.5875,
    lng: -46.6572,
    tipos: ["Vidro", "Papel", "Plástico"]
  },
  {
    id: 4,
    nome: "Centro de Triagem Morumbi",
    endereco: "Av. Roque Petroni Júnior, 1089 - Morumbi, São Paulo - SP",
    lat: -23.6234,
    lng: -46.6978,
    tipos: ["Plástico", "Papel", "Vidro", "Metal", "Eletrônicos"]
  }
];

const PontosColeta = () => {
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedPonto, setSelectedPonto] = useState<typeof pontosColeta[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    tipo_residuo: "",
    quantidade: "",
    unidade: "kg",
    foto_url: ""
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Token público do Mapbox (substitua pelo seu token)
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZS1kZW1vIiwiYSI6ImNtNXBxMDAwdTBjYnoya3EzdmE2N3NvMHEifQ.mock-token';

    try {
      // Inicializar mapa centrado em São Paulo
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-46.633308, -23.550520],
        zoom: 12
      });

      // Adicionar controles de navegação
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Adicionar marcadores para cada ponto de coleta
      pontosColeta.forEach(ponto => {
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.cssText = `
          background-color: hsl(20, 100%, 63%);
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        `;

        const marker = new mapboxgl.Marker(el)
          .setLngLat([ponto.lng, ponto.lat])
          .addTo(map.current!);

        el.addEventListener('click', () => {
          setSelectedPonto(ponto);
          map.current?.flyTo({
            center: [ponto.lng, ponto.lat],
            zoom: 14,
            duration: 1500
          });
        });

        // Popup ao passar o mouse
        const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
          .setHTML(`<div style="padding: 8px;"><strong>${ponto.nome}</strong><br/>${ponto.endereco}</div>`);

        marker.setPopup(popup);
      });
    } catch (error) {
      console.error('Erro ao inicializar mapa:', error);
      toast.error('Erro ao carregar o mapa. Usando versão simplificada.');
    }

    return () => {
      map.current?.remove();
    };
  }, []);

  const handleColetaSubmit = async () => {
    if (!selectedPonto || !formData.tipo_residuo || !formData.quantidade) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (!user) {
      toast.error("Você precisa estar logado para registrar uma coleta");
      navigate("/login");
      return;
    }

    try {
      const quantidade = parseFloat(formData.quantidade);
      const pontosPorKg = formData.tipo_residuo === "Metal" ? 15 : 
                          formData.tipo_residuo === "Plástico" || formData.tipo_residuo === "Vidro" ? 10 : 8;
      const pontosGanhos = Math.round(quantidade * pontosPorKg);

      const { error } = await supabase
        .from('coletas')
        .insert({
          user_id: user.id,
          tipo_residuo: formData.tipo_residuo,
          quantidade,
          unidade: formData.unidade,
          ponto_coleta: selectedPonto.nome,
          endereco: selectedPonto.endereco,
          status: 'pendente',
          pontos_ganhos: 0,
          foto_url: formData.foto_url
        });

      if (error) throw error;

      toast.success(`Coleta agendada com sucesso! Você ganhará ${pontosGanhos} pontos quando completar.`);
      setIsDialogOpen(false);
      setFormData({ tipo_residuo: "", quantidade: "", unidade: "kg", foto_url: "" });
      
      setTimeout(() => navigate("/coletas"), 2000);
    } catch (error) {
      console.error('Erro ao registrar coleta:', error);
      toast.error('Erro ao registrar coleta');
    }
  };

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
            {user && (
              <Button variant="outline" onClick={() => navigate("/coletas")}>
                Minhas Coletas
              </Button>
            )}
            {!user && (
              <Button onClick={() => navigate("/login")}>
                Entrar
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Mapa */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Pontos de Coleta Próximos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100%-80px)]">
                <div ref={mapContainer} className="w-full h-full" />
              </CardContent>
            </Card>
          </div>

          {/* Informações e Lista */}
          <div className="space-y-6">
            {selectedPonto ? (
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-lg">{selectedPonto.nome}</CardTitle>
                  <p className="text-sm text-muted-foreground">{selectedPonto.endereco}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Materiais aceitos:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPonto.tipos.map((tipo) => (
                        <span
                          key={tipo}
                          className="px-3 py-1 bg-secondary/20 text-secondary rounded-full text-sm"
                        >
                          {tipo}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Agendar Coleta
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Agendar Coleta</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label>Tipo de Material</Label>
                          <Select
                            value={formData.tipo_residuo}
                            onValueChange={(value) => setFormData({ ...formData, tipo_residuo: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o material" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedPonto.tipos.map((tipo) => (
                                <SelectItem key={tipo} value={tipo}>
                                  {tipo}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Quantidade</Label>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="0.0"
                              value={formData.quantidade}
                              onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Unidade</Label>
                            <Select
                              value={formData.unidade}
                              onValueChange={(value) => setFormData({ ...formData, unidade: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="kg">kg</SelectItem>
                                <SelectItem value="unidade">unidade</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <ImageUpload
                          onImageUploaded={(url) => setFormData({ ...formData, foto_url: url })}
                          currentImage={formData.foto_url}
                        />

                        <div className="bg-muted/50 p-4 rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            <strong>Pontos estimados:</strong> {formData.quantidade && formData.tipo_residuo ? 
                              Math.round(parseFloat(formData.quantidade) * (formData.tipo_residuo === "Metal" ? 15 : formData.tipo_residuo === "Plástico" || formData.tipo_residuo === "Vidro" ? 10 : 8)) : 0} pontos
                          </p>
                        </div>

                        <Button onClick={handleColetaSubmit} className="w-full">
                          Confirmar Agendamento
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Clique em um marcador no mapa para ver os detalhes do ponto de coleta
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Lista de Pontos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Todos os Pontos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {pontosColeta.map((ponto) => (
                  <button
                    key={ponto.id}
                    onClick={() => {
                      setSelectedPonto(ponto);
                      map.current?.flyTo({
                        center: [ponto.lng, ponto.lat],
                        zoom: 14,
                        duration: 1500
                      });
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedPonto?.id === ponto.id
                        ? 'bg-primary/10 border-2 border-primary'
                        : 'bg-muted/50 hover:bg-muted'
                    }`}
                  >
                    <h4 className="font-semibold text-sm">{ponto.nome}</h4>
                    <p className="text-xs text-muted-foreground">{ponto.endereco}</p>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <FloatingChat />
    </div>
  );
};

export default PontosColeta;
