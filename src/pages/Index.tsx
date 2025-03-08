
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { CalendarDays, Car, Bell, Settings, Users, Sun, Cloud, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [weatherData, setWeatherData] = useState({ temp: 22, condition: "Ensoleillé" });
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Nouveau rendez-vous confirmé", time: "Il y a 1 heure" },
    { id: 2, message: "Service terminé", time: "Il y a 3 heures" },
  ]);
  const { toast } = useToast();

  useEffect(() => {
    // Simuler un chargement de 2 secondes
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const stats = [
    {
      title: "Services en cours",
      value: "3",
      icon: Car,
      description: "2 en attente, 1 en cours",
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Rendez-vous",
      value: "12",
      icon: CalendarDays,
      description: "Prochain: 15 Mars",
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Prestataires",
      value: "8",
      icon: Users,
      description: "5 disponibles",
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

  const handleAddService = () => {
    toast({
      title: "Nouveau service",
      description: "Redirection vers la page des services...",
      duration: 3000,
    });
  };
  
  const dismissNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
    toast({
      title: "Notification supprimée",
      variant: "default",
      duration: 2000,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* En-tête avec un fond plus attrayant */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Bonjour, {profile?.full_name || user?.email}
              </h1>
              <p className="mt-2 text-blue-100">
                Bienvenue sur votre tableau de bord
              </p>
            </div>
            
            {/* Nouveau composant météo */}
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg text-white flex items-center gap-2">
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
      </div>

      {/* Contenu principal avec plus d'espace et un meilleur contraste */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Bouton d'action rapide */}
        <div className="mb-8 flex justify-end">
          <Button 
            onClick={handleAddService}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nouveau service
          </Button>
        </div>
        
        {/* Grille de statistiques avec des couleurs distinctes */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
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

        {/* Section principale avec un meilleur espacement */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Notifications */}
          <Card className="col-span-1">
            <CardHeader className="border-b flex flex-row items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-500" />
                Notifications
              </CardTitle>
              <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {notifications.length}
              </span>
            </CardHeader>
            <CardContent className="pt-6">
              {notifications.length > 0 ? (
                <div className="space-y-4">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="flex items-start justify-between space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-start space-x-4">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Bell className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{notif.message}</p>
                          <p className="text-xs text-gray-500">{notif.time}</p>
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

          {/* Activités récentes avec une meilleure présentation */}
          <Card className="col-span-1">
            <CardHeader className="border-b">
              <CardTitle className="text-xl">Activités récentes</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Liste des activités avec plus de détails visuels */}
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <CalendarDays className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Nouveau rendez-vous</p>
                    <p className="text-sm text-gray-500">Il y a 2 heures</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Car className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Service terminé</p>
                    <p className="text-sm text-gray-500">Il y a 4 heures</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prochains rendez-vous avec une meilleure présentation */}
          <Card className="col-span-1">
            <CardHeader className="border-b">
              <CardTitle className="text-xl">Prochains rendez-vous</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Liste des rendez-vous avec plus de détails visuels */}
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Car className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Lavage complet</p>
                    <p className="text-sm text-gray-500">15 Mars, 14:00</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <Car className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Nettoyage intérieur</p>
                    <p className="text-sm text-gray-500">18 Mars, 10:00</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
