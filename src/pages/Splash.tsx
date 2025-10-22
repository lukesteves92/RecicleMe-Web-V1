import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/onboarding");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="animate-fade-in">
        <Logo size="lg" showText={true} />
      </div>
    </div>
  );
};

export default Splash;
