
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { CalendarDays, Car, Bell, Settings, Users, Sun, Cloud, Plus, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useDashboardData } from "@/hooks/useDashboardData";

const Index = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [weatherData, setWeatherData] = useState({ temp: 22, condition: "Ensoleillé" });
  
  // Utiliser notre nouveau hook pour récupérer les données
  const { data: dashboardData, isLoading, isError } = useDashboardData();

  const stats = [
    {
      title: "Services en cours",
      value: dashboardData ? `${dashboardData.services.total}` : "...",
      icon: Car,
      description: dashboardData 
        ? `${dashboardData.services.pending} en attente, ${dashboardData.services.ongoing} en cours`
        : "Chargement...",
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Rendez-vous",
      value: dashboardData ? `${dashboardData.appointments.total}` : "...",
      icon: CalendarDays,
      description: dashboardData?.appointments.next.date 
        ? `Prochain: ${dashboardData.appointments.next.date}`
        : "Aucun rendez-vous prévu",
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Prestataires",
      value: dashboardData ? `${dashboardData.providers.total}` : "...",
      icon: Users,
      description: dashboardData 
        ? `${dashboardData.providers.available} disponibles`
        : "Chargement...",
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "Paramètres",
      value: "4",
      icon: Settings,
      description: "2 notifications",
      color: "bg-orange-100 text-orange-600"
    }
  ];

  const handleBooking = () => {
    navigate('/booking');
  };

  const dismissNotification = (id) => {
    // Ici, on pourrait mettre à jour la base de données pour marquer la notification comme lue
    toast({
      title: "Notification supprimée",
      variant: "default",
      duration: 2000,
    });
  };

  const handleAddService = () => {
    toast({
      title: "Nouveau service",
      description: "Redirection vers la page des services...",
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 -mt-10 relative z-20">
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 p-2">
          <div className="px-6 pt-6 flex justify-end">
            <Button 
              onClick={handleAddService}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Nouveau service
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 p-6">
            {stats.map((stat) => (
              <Card key={stat.title} className="hover:shadow-lg transition-shadow border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-full ${stat.color}`}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Card>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
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

          <Card className="col-span-1 border-0 shadow-lg">
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

          <Card className="col-span-1 border-0 shadow-lg">
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
        </div>
      </main>
    </div>
  );
};

export default Index;
