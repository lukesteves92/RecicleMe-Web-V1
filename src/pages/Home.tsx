import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/Logo";
import FloatingChat from "@/components/FloatingChat";
import { MapPin, Trash2, Award, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Home = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="sm" showText={true} />
          <nav className="flex gap-4">
            <Button variant="ghost" onClick={() => window.location.href = '/pontos-coleta'}>
              Pontos de Coleta
            </Button>
            <Button variant="ghost" onClick={() => window.location.href = '/sobre'}>Sobre</Button>
            <Button variant="ghost" onClick={() => window.location.href = '/coletas'}>
              Minhas Coletas
            </Button>
            {user ? (
              <Button onClick={() => window.location.href = '/perfil'}>Perfil</Button>
            ) : (
              <Button onClick={() => window.location.href = '/login'}>Entrar</Button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center space-y-6">
          <h1 className="text-5xl font-bold text-foreground">
            Recicle com <span className="text-primary">Consciência</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Encontre pontos de coleta próximos a você e aprenda a descartar corretamente seus resíduos
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              className="h-12 px-8 text-base rounded-xl"
              onClick={() => window.location.href = '/pontos-coleta'}
            >
              Encontrar Pontos de Coleta
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-12 px-8 text-base rounded-xl"
              onClick={() => window.location.href = '/como-funciona'}
            >
              Saiba Mais
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Como Funciona
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <MapPin className="w-12 h-12 text-primary mb-2" />
                <CardTitle>Encontre Pontos</CardTitle>
                <CardDescription>
                  Localize pontos de coleta próximos a você
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <Trash2 className="w-12 h-12 text-primary mb-2" />
                <CardTitle>Descarte Correto</CardTitle>
                <CardDescription>
                  Aprenda a separar e descartar seus resíduos
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <Award className="w-12 h-12 text-primary mb-2" />
                <CardTitle>Ganhe Pontos</CardTitle>
                <CardDescription>
                  Acumule pontos e troque por recompensas
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <Users className="w-12 h-12 text-primary mb-2" />
                <CardTitle>Comunidade</CardTitle>
                <CardDescription>
                  Faça parte de uma comunidade sustentável
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="bg-primary text-primary-foreground border-0">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-4xl font-bold">
                Pronto para Começar?
              </h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Junte-se a milhares de pessoas que já estão fazendo a diferença pelo meio ambiente
              </p>
              <Button 
                size="lg" 
                variant="secondary" 
                className="h-12 px-8 text-base rounded-xl"
                onClick={() => window.location.href = '/cadastro'}
              >
                Criar Conta Grátis
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 Recicle.me - Todos os direitos reservados</p>
        </div>
      </footer>

      {/* Floating Chat */}
      <FloatingChat />
    </div>
  );
};

export default Home;
