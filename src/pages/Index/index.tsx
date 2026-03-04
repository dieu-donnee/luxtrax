import { useState } from "react";
import DashboardHeader from "./components/DashboardHeader";
import LoadingScreen from "./components/LoadingScreen";
import SidebarContent from "./components/SidebarContent";
import DashboardCards from "./components/DashboardCards";
import { useDashboardData } from "@/hooks/useDashboardData";

const Index = () => {
  const [weatherData] = useState({ temp: 22, condition: "Ensoleillé" });
  const { data: dashboardData, isLoading: isDataLoading, isError } = useDashboardData();

  if (isDataLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans pb-20 lg:pb-0">
      <DashboardHeader weatherData={weatherData} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-20 animate-fade-in">
        <DashboardCards
          dashboardData={dashboardData}
          isLoading={isDataLoading}
          isError={isError}
        />

        {/* Desktop Sidebar view if needed or other sections */}
        <div className="mt-12 hidden lg:grid grid-cols-1 gap-8">
          {/* Additional sections can go here for desktop */}
        </div>
      </main>
    </div>
  );
};

export default Index;
