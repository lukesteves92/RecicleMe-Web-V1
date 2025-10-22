import logoImage from "@/assets/logo-recicleme.png";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const Logo = ({ size = "md", showText = true }: LogoProps) => {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-32 h-32",
  };

  const textSizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <img src={logoImage} alt="Recicle.me Logo" className={sizeClasses[size]} />
      {showText && (
        <h1 className={`font-bold text-foreground ${textSizeClasses[size]}`}>
          Recicle.me
        </h1>
      )}
    </div>
  );
};

export default Logo;
