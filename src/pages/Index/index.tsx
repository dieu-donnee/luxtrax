
import { useState, useEffect } from "react";
import DashboardHeader from "./components/DashboardHeader";
import LoadingScreen from "./components/LoadingScreen";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import SidebarContent from "./components/SidebarContent";
import DashboardCards from "./components/DashboardCards";
import { useDashboardData } from "@/hooks/useDashboardData";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [weatherData, setWeatherData] = useState({ temp: 22, condition: "Ensoleillé" });
  
  // Use the optimized hook
  const { data: dashboardData, isLoading: isDataLoading, isError } = useDashboardData();

  useEffect(() => {
    // Reduce initial loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Show loading screen only initially
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <DashboardHeader weatherData={weatherData} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 -mt-10 relative z-20">
        <div className="flex justify-end mb-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>
        
        <DashboardCards 
          dashboardData={dashboardData}
          isLoading={isDataLoading}
          isError={isError}
        />

        <div className="mt-8 hidden md:grid grid-cols-1 gap-6 lg:grid-cols-3">
          <SidebarContent />
        </div>
      </main>
    </div>
  );
};

export default Index;
