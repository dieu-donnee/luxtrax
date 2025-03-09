
import { useEffect, useState } from "react";
import DashboardHeader from "./components/DashboardHeader";
import StatCards from "./components/StatCards";
import NotificationsCard from "./components/NotificationsCard";
import RecentActivitiesCard from "./components/RecentActivitiesCard";
import UpcomingAppointmentsCard from "./components/UpcomingAppointmentsCard";
import LoadingScreen from "./components/LoadingScreen";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [weatherData, setWeatherData] = useState({ temp: 22, condition: "Ensoleillé" });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <DashboardHeader weatherData={weatherData} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 -mt-10 relative z-20">
        <StatCards />

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <NotificationsCard />
          <RecentActivitiesCard />
          <UpcomingAppointmentsCard />
        </div>
      </main>
    </div>
  );
};

export default Index;
