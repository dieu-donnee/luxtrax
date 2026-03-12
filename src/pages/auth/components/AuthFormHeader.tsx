
import { Button } from "@/components/ui/button";

interface AuthFormHeaderProps {
  isSignUp: boolean;
  setIsSignUp: (value: boolean) => void;
}

export function AuthFormHeader({ isSignUp, setIsSignUp }: AuthFormHeaderProps) {
  return (
    <div className="text-center space-y-2 mb-8 animate-fade-in">
      <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 font-sans">
        {isSignUp ? "Join LuxtraX" : "Welcome back"}
      </h2>
      <p className="text-gray-500 font-medium">
        {isSignUp ? "Experience premium services at your doorstep" : "Enter your credentials to access your luxury account"}
      </p>
    </div>
  );
}
