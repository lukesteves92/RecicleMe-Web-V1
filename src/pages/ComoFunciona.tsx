import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/Logo";
import FloatingChat from "@/components/FloatingChat";
import { ArrowLeft, MapPin, Trash2, Award, Users, CheckCircle, Map, Calendar, TrendingUp } from "lucide-react";

const ComoFunciona = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="sm" showText={true} />
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/10 via-secondary/5 to-background">
        <div className="container mx-auto text-center space-y-6 max-w-3xl">
          <h1 className="text-5xl font-bold text-foreground">
            Como Funciona o <span className="text-primary">Recicle.me</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Descubra como é fácil reciclar de forma consciente e ser recompensado por isso
          </p>
        </div>
      </section>

      {/* Passo a Passo */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-8">
            {/* Passo 1: Encontre Pontos */}
            <Card className="overflow-hidden border-2 hover:border-primary transition-all">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="order-2 md:order-1 p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                      1
                    </div>
                    <CardTitle className="text-2xl">Encontre Pontos de Coleta</CardTitle>
                  </div>
                  <CardContent className="p-0 space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Use nosso mapa interativo para localizar pontos de coleta próximos a você. 
                      Cada ponto possui informações detalhadas sobre os tipos de materiais aceitos.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Map className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-sm">Mapa Interativo</h4>
                          <p className="text-sm text-muted-foreground">
                            Visualize todos os pontos de coleta em tempo real na sua região
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-sm">Informações Detalhadas</h4>
                          <p className="text-sm text-muted-foreground">
                            Veja endereço completo, horários e materiais aceitos
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-sm">Escolha Conveniente</h4>
                          <p className="text-sm text-muted-foreground">
                            Selecione o ponto mais próximo e conveniente para você
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>
                <div className="order-1 md:order-2 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center p-8">
                  <MapPin className="w-32 h-32 text-primary" />
                </div>
              </div>
            </Card>

            {/* Passo 2: Descarte Correto */}
            <Card className="overflow-hidden border-2 hover:border-secondary transition-all">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center p-8">
                  <Trash2 className="w-32 h-32 text-secondary" />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-xl">
                      2
                    </div>
                    <CardTitle className="text-2xl">Descarte Correto</CardTitle>
                  </div>
                  <CardContent className="p-0 space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Aprenda a separar e descartar seus materiais recicláveis da forma correta. 
                      Nosso assistente virtual está sempre disponível para tirar suas dúvidas.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Trash2 className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-sm">Separação Adequada</h4>
                          <p className="text-sm text-muted-foreground">
                            Plástico, papel, vidro, metal e eletrônicos cada um tem seu destino
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-sm">Agende sua Coleta</h4>
                          <p className="text-sm text-muted-foreground">
                            Registre o tipo e quantidade do material que deseja descartar
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-sm">Assistente Inteligente</h4>
                          <p className="text-sm text-muted-foreground">
                            Tire dúvidas sobre reciclagem com nosso chatbot disponível 24/7
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>

            {/* Passo 3: Ganhe Pontos */}
            <Card className="overflow-hidden border-2 hover:border-primary transition-all">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="order-2 md:order-1 p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                      3
                    </div>
                    <CardTitle className="text-2xl">Ganhe Pontos</CardTitle>
                  </div>
                  <CardContent className="p-0 space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Cada coleta realizada gera pontos baseados no tipo e quantidade de material reciclado. 
                      Quanto mais você recicla, mais pontos acumula!
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Award className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-sm">Sistema de Pontuação</h4>
                          <p className="text-sm text-muted-foreground">
                            Metal: 15 pontos/kg • Plástico e Vidro: 10 pontos/kg • Papel: 8 pontos/kg
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-sm">Acompanhe seu Progresso</h4>
                          <p className="text-sm text-muted-foreground">
                            Visualize seus pontos acumulados e histórico de coletas no seu perfil
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-sm">Reconhecimento</h4>
                          <p className="text-sm text-muted-foreground">
                            Seja reconhecido por suas ações sustentáveis e impacto ambiental
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>
                <div className="order-1 md:order-2 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center p-8">
                  <Award className="w-32 h-32 text-primary" />
                </div>
              </div>
            </Card>

            {/* Passo 4: Comunidade */}
            <Card className="overflow-hidden border-2 hover:border-secondary transition-all">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center p-8">
                  <Users className="w-32 h-32 text-secondary" />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-xl">
                      4
                    </div>
                    <CardTitle className="text-2xl">Faça Parte da Comunidade</CardTitle>
                  </div>
                  <CardContent className="p-0 space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Junte-se a uma comunidade engajada de pessoas comprometidas com a sustentabilidade. 
                      Juntos, causamos um impacto real no meio ambiente.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-sm">Rede Sustentável</h4>
                          <p className="text-sm text-muted-foreground">
                            Conecte-se com pessoas que compartilham os mesmos valores ambientais
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-sm">Impacto Coletivo</h4>
                          <p className="text-sm text-muted-foreground">
                            Veja o impacto total da comunidade em materiais reciclados e CO₂ evitado
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-sm">Educação Contínua</h4>
                          <p className="text-sm text-muted-foreground">
                            Aprenda constantemente sobre práticas sustentáveis e reciclagem
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl text-center space-y-6">
          <h2 className="text-3xl font-bold">Pronto para Começar?</h2>
          <p className="text-xl text-muted-foreground">
            Cadastre-se gratuitamente e comece a fazer a diferença hoje mesmo
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg" 
              className="h-12 px-8 text-base rounded-xl"
              onClick={() => navigate("/cadastro")}
            >
              Criar Conta Grátis
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-12 px-8 text-base rounded-xl"
              onClick={() => navigate("/pontos-coleta")}
            >
              Ver Pontos de Coleta
            </Button>
          </div>
        </div>
      </section>

      <FloatingChat />
    </div>
  );
};

export default ComoFunciona;
