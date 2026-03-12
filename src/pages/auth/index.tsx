import { Button } from "@/components/ui/button";
import { AuthHeader } from "./components/AuthHeader";
import { AuthFormHeader } from "./components/AuthFormHeader";
import { AuthDivider } from "./components/AuthDivider";
import { ClientSignUpForm } from "./components/ClientSignUpForm";
import { ProviderSignUpForm } from "./components/ProviderSignUpForm";
import { LoginForm } from "./components/LoginForm";
import { GoogleAuth } from "./components/GoogleAuth";
import { TermsCheckbox } from "./components/TermsCheckbox";
import { UserTypeSelector } from "./components/UserTypeSelector";
import { useAuthForm } from "./hooks/useAuthForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Layers } from "lucide-react";

export default function AuthPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const {
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
  } = useAuthForm();

  useEffect(() => {
    if (user && !authLoading) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  return (
    <div className="min-h-screen bg-[#F0F4FF] flex font-sans overflow-hidden relative">
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

        <div className="mb-8 flex flex-col items-center">
          <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-primary/10 animate-fade-in ring-8 ring-white/50">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Layers className="text-white w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="max-w-md w-full space-y-6 bg-white/80 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-2xl shadow-primary/5 border border-white/50 animate-fade-in relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />

          <AuthFormHeader isSignUp={isSignUp} setIsSignUp={setIsSignUp} />
          <GoogleAuth />
          <AuthDivider />

          <form onSubmit={handleAuth} className="mt-8 space-y-6">
            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
            />

            {isSignUp && (
              <div className="space-y-6">
                <UserTypeSelector
                  isProvider={isProvider}
                  setIsProvider={setIsProvider}
                />

                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 shadow-inner">
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
                </div>

                <TermsCheckbox
                  termsAccepted={termsAccepted}
                  setTermsAccepted={setTermsAccepted}
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-14 text-lg font-bold rounded-2xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all transform hover:scale-[1.01] active:scale-[0.99] group mt-4"
              disabled={loading}
            >
              {loading ? "Chargement..." : isSignUp ? "Créer mon compte" : "Se connecter"}
              {!loading && <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>}
            </Button>
          </form>

          <div className="text-center pt-2">
            <p className="text-sm text-muted-foreground font-medium">
              {isSignUp ? "Vous avez déjà un compte ?" : "Pas encore de compte ?"}{" "}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary font-extrabold hover:underline transition-colors px-1"
              >
                {isSignUp ? "Se connecter" : "S'inscrire"}
              </button>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:block w-1/2 bg-cover bg-center relative" style={{
        backgroundImage: `url('/lovable-uploads/7e9e1aa9-0e1a-4f55-a580-daac6d7b4865.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="absolute inset-0 bg-primary/10 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#F0F4FF]" />
        <div className="h-full flex flex-col justify-end p-20 text-white relative z-10">
          <blockquote className="space-y-4">
            <p className="text-4xl font-extrabold leading-tight">
              "Luxury is in each detail."
            </p>
            <footer className="text-xl font-medium text-gray-200">- Hubert de Givenchy</footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
