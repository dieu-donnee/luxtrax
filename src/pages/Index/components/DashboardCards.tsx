
import { Card } from "@/components/ui/card";
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import StatCards from "./StatCards";
import NotificationsCard from "./NotificationsCard";
import RecentActivitiesCard from "./RecentActivitiesCard";
import UpcomingAppointmentsCard from "./UpcomingAppointmentsCard";
import { DashboardData } from "@/hooks/useDashboardData";

interface DashboardCardsProps {
  dashboardData: DashboardData | undefined;
  isLoading: boolean;
  isError: boolean;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({
  dashboardData,
  isLoading,
  isError
}) => {
  const { toast } = useToast();
  const { profile } = useAuth();
  const navigate = useNavigate();

  const handleAddService = () => {
    toast({
      title: "Nouveau service",
      description: "Redirection vers la page des services...",
      duration: 3000,
    });
  };

  return (
    <>
      <Card className="glass-card p-2 border-0">
        <div className="px-6 pt-6 flex justify-end">
          {profile?.role === 'provider' ? (
            <Button
              onClick={() => toast({ title: "Missions", description: "Recherche de missions à proximité..." })}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 gold-shimmer transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              <Plus className="h-4 w-4" />
              Chercher une mission
            </Button>
          ) : (
            <Button
              onClick={() => navigate('/booking')}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 gold-shimmer transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              <Plus className="h-4 w-4" />
              Nouveau service
            </Button>
          )}
        </div>

        <StatCards data={dashboardData?.services} isLoading={isLoading} />
      </Card>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <NotificationsCard
          notifications={dashboardData?.notifications || []}
          isLoading={isLoading}
        />
        <RecentActivitiesCard
          activities={dashboardData?.activities || []}
          isLoading={isLoading}
        />
        <UpcomingAppointmentsCard
          appointments={dashboardData?.upcomingAppointments || []}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};

export default React.memo(DashboardCards);
