
import { Button } from "@/components/ui/button";

interface AuthFormHeaderProps {
  isSignUp: boolean;
  setIsSignUp: (value: boolean) => void;
}

export function AuthFormHeader({ isSignUp, setIsSignUp }: AuthFormHeaderProps) {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900">
        {isSignUp ? "Créer un compte" : "Se connecter"}
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        {isSignUp ? "Déjà un compte ?" : "Pas encore de compte ?"}{" "}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-blue-600 hover:text-blue-500"
        >
          {isSignUp ? "Se connecter" : "S'inscrire"}
        </button>
      </p>
    </div>
  );
}
