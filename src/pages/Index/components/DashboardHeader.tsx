
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
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxyYWRpYWxHcmFkaWVudCBpZD0iZ2xvdzEiIGN4PSIyMCUiIGN5PSIzMCUiIHI9IjMwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzRmYjRmZiIgc3RvcC1vcGFjaXR5PSIwLjQiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwMDAwMDAiIHN0b3Atb3BhY2l0eT0iMCIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJnbG93MiIgY3g9IjgwJSIgY3k9IjcwJSIgcj0iMjUlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjNjJkZWZmIiBzdG9wLW9wYWNpdHk9IjAuMyIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzAwMDAwMCIgc3RvcC1vcGFjaXR5PSIwIi8+PC9yYWRpYWxHcmFkaWVudD48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNnbG93MSkiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiLz48cmVjdCBmaWxsPSJ1cmwoI2dsb3cyKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-90 mix-blend-overlay"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10">
        <div className="md:flex items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Bonjour, {profile?.full_name || user?.email}
            </h1>
            <p className="text-blue-100 text-lg mb-8">
              Votre voiture mérite le meilleur service
            </p>
            <Button 
              onClick={handleBooking}
              className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-full text-lg shadow-lg transition-all duration-300 flex items-center"
              size="lg"
            >
              Réserver un lavage
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-300/20 rounded-full blur-3xl transform -translate-y-4"></div>
              <img 
                src="https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=1000&auto=format&fit=crop" 
                alt="Voiture premium" 
                className="relative z-10 max-h-80 object-cover rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-500 ease-in-out"
              />
            </div>
          </div>
        </div>
        
        <div className="absolute top-4 right-4 md:top-8 md:right-8 bg-white/20 backdrop-blur-md p-3 rounded-lg text-white flex items-center gap-2 shadow-lg">
          {weatherData.condition === "Ensoleillé" ? (
            <Sun className="h-5 w-5 text-yellow-300" />
          ) : (
            <Cloud className="h-5 w-5 text-gray-200" />
          )}
          <div>
            <p className="font-medium">{weatherData.temp}°C</p>
            <p className="text-xs">{weatherData.condition}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
