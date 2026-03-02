
import { Sun, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronRight } from "lucide-react";

interface WeatherData {
  temp: number;
  condition: string;
}

interface DashboardHeaderProps {
  weatherData: WeatherData;
}

const DashboardHeader = ({ weatherData }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const handleBooking = () => {
    navigate('/booking');
  };

  return (
    <div className="relative overflow-hidden bg-neutral-950">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-neutral-950 to-neutral-900 opacity-90"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
        <div className="md:flex items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Bonjour, <span className="text-primary">{profile?.full_name || user?.email}</span>
            </h1>
            <p className="text-neutral-300 text-xl mb-10 font-light max-w-md leading-relaxed">
              L'excellence à votre service. Offrez à votre véhicule le traitement qu'il mérite.
            </p>
            <Button
              onClick={handleBooking}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-6 rounded-full text-lg shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-300 flex items-center gold-shimmer transform hover:scale-105"
              size="lg"
            >
              Réserver un lavage
              <ChevronRight className="ml-2 h-6 w-6" />
            </Button>
          </div>

          <div className="md:w-1/2 flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl transform -translate-y-4 group-hover:bg-primary/30 transition-colors duration-500"></div>
              <img
                src="https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=1000&auto=format&fit=crop"
                alt="Voiture premium"
                className="relative z-10 max-h-96 object-cover rounded-2xl shadow-2xl border border-white/10 transform hover:scale-[1.02] transition-transform duration-700 ease-in-out"
              />
            </div>
          </div>
        </div>

        <div className="absolute top-4 right-4 md:top-8 md:right-8 glass-card p-4 rounded-xl text-white flex items-center gap-3 shadow-2xl border-white/10 group hover:border-primary/50 transition-colors">
          <div className="bg-primary/20 p-2 rounded-lg">
            {weatherData.condition === "Ensoleillé" ? (
              <Sun className="h-6 w-6 text-primary" />
            ) : (
              <Cloud className="h-6 w-6 text-neutral-300" />
            )}
          </div>
          <div>
            <p className="text-lg font-bold text-primary">{weatherData.temp}°C</p>
            <p className="text-xs uppercase tracking-widest font-semibold text-neutral-400">{weatherData.condition}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
