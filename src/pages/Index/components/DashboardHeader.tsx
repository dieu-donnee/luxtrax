import { Sun, Cloud, Search, Bell, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface WeatherData {
  temp: number;
  condition: string;
}

interface DashboardHeaderProps {
  weatherData: WeatherData;
}

const DashboardHeader = ({ weatherData }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  return (
    <div className="relative bg-[#FDFDFD] pt-10 pb-6 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Section: Welcome & Actions */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-gray-400 text-sm font-medium tracking-wide">Hello,</p>
            <h1 className="text-2xl font-extrabold text-[#1A1A1A] tracking-tight">
              {profile?.full_name?.split(' ')[0] || "Guest"} 👋
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
              <Sun className="h-4 w-4 text-yellow-500" />
              <span className="text-xs font-bold text-gray-600">{weatherData.temp}°C</span>
            </div>
            <button className="relative p-3 bg-white rounded-2xl shadow-sm border border-gray-100 transition-transform active:scale-95 group">
              <Bell className="h-5 w-5 text-gray-500 group-hover:text-primary transition-colors" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </div>

        {/* Search Bar Section */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Find the best service..."
            className="w-full h-15 pl-14 pr-4 bg-white border border-gray-100 rounded-[1.25rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-gray-700 placeholder:text-gray-400 font-medium"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
            <MapPin className="h-4 w-4" />
          </button>
        </div>

        {/* Categories Section */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-none">
          {["All", "Lavage", "Polissage", "Intérieur", "Premium", "Moteur"].map((cat, i) => (
            <button
              key={cat}
              className={cn(
                "px-6 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all duration-300",
                i === 0
                  ? "bg-primary text-white shadow-xl shadow-primary/20 transform scale-105"
                  : "bg-white text-gray-500 border border-gray-100 hover:border-primary/20 hover:text-primary"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;
