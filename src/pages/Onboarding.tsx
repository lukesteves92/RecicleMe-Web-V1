import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import onboardingImage from "@/assets/onboarding-illustration.png";

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md space-y-8 text-center animate-fade-in">
        <img 
          src={onboardingImage} 
          alt="Pessoas reciclando" 
          className="mx-auto w-full max-w-sm rounded-2xl"
        />
        
        <Logo size="md" showText={true} />
        
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            Bem-vindo ao Recicle.me!
          </h2>
          <p className="text-muted-foreground">
            Ajude o meio ambiente descartando corretamente seus resíduos e encontre pontos de coleta próximos a você.
          </p>
        </div>

        <Button 
          onClick={() => navigate("/login")} 
          className="w-full h-12 text-base font-semibold rounded-xl"
          size="lg"
        >
          Entrar
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
