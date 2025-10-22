import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/Logo";
import { ArrowLeft, Leaf, Users, Target, Award, Heart, Recycle } from "lucide-react";

const Sobre = () => {
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

      {/* Conteúdo */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Hero Section */}
          <Card className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <Recycle className="w-12 h-12" />
                <h1 className="text-4xl font-bold">Sobre o ReUse</h1>
              </div>
              <p className="text-lg opacity-90">
                Uma iniciativa sustentável que conecta pessoas comprometidas com o meio ambiente
              </p>
            </CardContent>
          </Card>

          {/* Origem do Projeto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="w-6 h-6 text-primary" />
                Origem do Projeto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                O <span className="font-semibold text-foreground">ReUse</span> nasceu de um projeto acadêmico desenvolvido por{" "}
                <span className="font-semibold text-primary">Lucas Esteves</span> para o curso da{" "}
                <span className="font-semibold text-foreground">FIAP</span>, uma das principais instituições de ensino em tecnologia do Brasil.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                O objetivo principal era criar uma solução tecnológica que promovesse a <span className="font-semibold text-foreground">sustentabilidade</span> e 
                incentivasse práticas conscientes de descarte e reciclagem de materiais. Inspirado pela urgência das questões ambientais 
                e pela necessidade de engajamento coletivo, o projeto foi idealizado para transformar a forma como as pessoas lidam com 
                seus resíduos recicláveis.
              </p>
            </CardContent>
          </Card>

          {/* Missão */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-6 h-6 text-primary" />
                Nossa Missão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Facilitar o descarte consciente de materiais recicláveis, conectando cidadãos a pontos de coleta 
                e recompensando boas práticas ambientais. Acreditamos que pequenas ações individuais, quando somadas, 
                geram um impacto significativo na preservação do nosso planeta.
              </p>
            </CardContent>
          </Card>

          {/* Funcionalidades Principais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-6 h-6 text-primary" />
                O que Oferecemos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Recycle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Agendamento de Coletas</h3>
                    <p className="text-sm text-muted-foreground">
                      Registre e agende suas coletas de materiais recicláveis de forma simples
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Sistema de Pontos</h3>
                    <p className="text-sm text-muted-foreground">
                      Ganhe pontos a cada coleta realizada e seja reconhecido por suas ações
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Pontos de Coleta</h3>
                    <p className="text-sm text-muted-foreground">
                      Encontre pontos de coleta próximos a você através do mapa interativo
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Assistente Virtual</h3>
                    <p className="text-sm text-muted-foreground">
                      Tire suas dúvidas sobre reciclagem com nosso assistente inteligente
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Impacto */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-primary" />
                Nosso Impacto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Cada coleta registrada no ReUse representa não apenas materiais desviados de aterros sanitários, 
                mas também uma mudança de mentalidade. Estamos construindo uma comunidade de pessoas comprometidas 
                com a sustentabilidade, provando que tecnologia e consciência ambiental podem caminhar juntas.
              </p>
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <p className="text-sm text-center italic">
                  "Juntos, transformamos pequenas ações em grandes mudanças para o nosso planeta."
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Faça Parte Dessa Mudança</h3>
              <p className="text-muted-foreground mb-4">
                Cadastre-se agora e comece a fazer a diferença através da reciclagem consciente
              </p>
              <Button onClick={() => navigate("/cadastro")} size="lg">
                Criar Conta Grátis
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Sobre;
