
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export function useAuthForm() {
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

        if (data.user) {
          // Attendre un court instant que le trigger s'exécute
          await new Promise(resolve => setTimeout(resolve, 500));

          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .maybeSingle();

          if (profileError) {
            console.error("Erreur lors de la récupération du profil:", profileError);
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

  return {
    isSignUp,
    setIsSignUp,
    isProvider,
    setIsProvider,
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    address,
    setAddress,
    vehicleType,
    setVehicleType,
    experienceLevel,
    setExperienceLevel,
    documents,
    setDocuments,
    termsAccepted,
    setTermsAccepted,
    loading,
    handleAuth
  };
}
