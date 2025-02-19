
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { AuthHeader } from "./components/AuthHeader";
import { ClientSignUpForm } from "./components/ClientSignUpForm";
import { ProviderSignUpForm } from "./components/ProviderSignUpForm";
import { LoginForm } from "./components/LoginForm";
import { GoogleAuth } from "./components/GoogleAuth";
import { TermsCheckbox } from "./components/TermsCheckbox";
import { UserTypeSelector } from "./components/UserTypeSelector";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isProvider, setIsProvider] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [documents, setDocuments] = useState<File[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp && !termsAccepted) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Vous devez accepter les conditions d'utilisation pour vous inscrire.",
      });
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        if (isProvider && !experienceLevel) {
          throw new Error("Veuillez sélectionner votre niveau d'expérience");
        }
        if (!isProvider && !vehicleType) {
          throw new Error("Veuillez sélectionner votre type de véhicule");
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              address,
              role: isProvider ? 'provider' : 'client',
              vehicle_type: !isProvider ? vehicleType : null,
              experience_level: isProvider ? experienceLevel : null,
              terms_accepted: termsAccepted,
            },
          },
        });

        if (error) throw error;

        // Attendons que le profil soit créé
        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .select()
            .eq('id', data.user.id)
            .single();

          if (profileError) {
            console.error("Erreur lors de la vérification du profil:", profileError);
            throw new Error("Erreur lors de la création du profil utilisateur");
          }
        }

        toast({
          title: "Inscription réussie",
          description: "Veuillez vérifier votre email pour confirmer votre compte.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate("/");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <AuthHeader />
        
        <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-xl shadow-sm">
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

          <GoogleAuth />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Ou</span>
            </div>
          </div>

          <form onSubmit={handleAuth} className="mt-8 space-y-6">
            {isSignUp && (
              <div className="space-y-4">
                <UserTypeSelector 
                  isProvider={isProvider}
                  setIsProvider={setIsProvider}
                />

                {isProvider ? (
                  <ProviderSignUpForm
                    fullName={fullName}
                    setFullName={setFullName}
                    address={address}
                    setAddress={setAddress}
                    experienceLevel={experienceLevel}
                    setExperienceLevel={setExperienceLevel}
                    documents={documents}
                    setDocuments={setDocuments}
                  />
                ) : (
                  <ClientSignUpForm
                    fullName={fullName}
                    setFullName={setFullName}
                    address={address}
                    setAddress={setAddress}
                    vehicleType={vehicleType}
                    setVehicleType={setVehicleType}
                  />
                )}

                <TermsCheckbox 
                  termsAccepted={termsAccepted}
                  setTermsAccepted={setTermsAccepted}
                />
              </div>
            )}
            
            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Chargement..." : isSignUp ? "S'inscrire" : "Se connecter"}
            </Button>
          </form>
        </div>
      </div>

      <div className="hidden lg:block w-1/2 bg-cover bg-center" style={{
        backgroundImage: `url('/lovable-uploads/7e9e1aa9-0e1a-4f55-a580-daac6d7b4865.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="h-full w-full bg-blue-500/10 backdrop-blur-sm" />
      </div>
    </div>
  );
}
