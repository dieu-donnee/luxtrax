
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

export default function AuthPage() {
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <AuthHeader />
        
        <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-xl shadow-sm">
          <AuthFormHeader isSignUp={isSignUp} setIsSignUp={setIsSignUp} />
          <GoogleAuth />
          <AuthDivider />

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
