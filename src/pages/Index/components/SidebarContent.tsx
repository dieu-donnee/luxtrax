
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CalendarDays, Car, Settings } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

const SidebarContent = () => {
  const { toast } = useToast();
  const { profile } = useAuth();
  const { data: dashboardData, isLoading, isError } = useDashboardData();

  const dismissNotification = (id: number) => {
    toast({
      title: "Notification supprimée",
      variant: "default",
      duration: 2000,
    });
  };

  return (
    <>
      {profile?.role === 'admin' && (
        <Card className="col-span-1 border-0 shadow-lg mb-6">
          <CardHeader className="border-b">
            <CardTitle className="text-xl flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Administration
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Link to="/admin">
              <Button className="w-full" variant="default">
                Accéder à l'interface admin
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
      <Card className="col-span-1 border-0 shadow-lg">
        <CardHeader className="border-b flex flex-row items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-500" />
            Notifications
          </CardTitle>
          <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {dashboardData?.notifications.length || 0}
          </span>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="text-center py-4 text-gray-500">
              <p>Chargement des notifications...</p>
            </div>
          ) : dashboardData?.notifications.length ? (
            <div className="space-y-4">
              {dashboardData.notifications.map((notif) => (
                <div key={notif.id} className="flex items-start justify-between space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Bell className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{notif.message}</p>
                      <p className="text-sm text-gray-500">{notif.time}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => dismissNotification(notif.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="sr-only">Ignorer</span>
                    <span className="text-xs">×</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>Aucune notification</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="col-span-1 border-0 shadow-lg mt-6">
        <CardHeader className="border-b">
          <CardTitle className="text-xl">Activités récentes</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="text-center py-4 text-gray-500">
              <p>Chargement des activités...</p>
            </div>
          ) : dashboardData?.activities.length ? (
            <div className="space-y-6">
              {dashboardData.activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className={`bg-${activity.type === 'appointment' ? 'blue' : 'green'}-100 p-2 rounded-full`}>
                    {activity.icon === 'calendar' ? 
                      <CalendarDays className={`h-4 w-4 text-${activity.type === 'appointment' ? 'blue' : 'green'}-600`} /> :
                      <Car className={`h-4 w-4 text-${activity.type === 'appointment' ? 'blue' : 'green'}-600`} />
                    }
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>Aucune activité récente</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="col-span-1 border-0 shadow-lg mt-6">
        <CardHeader className="border-b">
          <CardTitle className="text-xl">Prochains rendez-vous</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="text-center py-4 text-gray-500">
              <p>Chargement des rendez-vous...</p>
            </div>
          ) : dashboardData?.upcomingAppointments.length ? (
            <div className="space-y-6">
              {dashboardData.upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-start space-x-4">
                  <div className={`bg-${appointment.color}-100 p-2 rounded-full`}>
                    <Car className={`h-4 w-4 text-${appointment.color}-600`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{appointment.service}</p>
                    <p className="text-sm text-gray-500">{appointment.date}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>Aucun rendez-vous prévu</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default SidebarContent;
