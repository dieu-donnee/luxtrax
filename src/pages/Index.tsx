
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { CalendarDays, Car, Settings, Users } from "lucide-react";

const Index = () => {
  const { user, profile } = useAuth();

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* En-tête avec un fond plus attrayant */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-white">
            Bonjour, {profile?.full_name || user?.email}
          </h1>
          <p className="mt-2 text-blue-100">
            Bienvenue sur votre tableau de bord
          </p>
        </div>
      </div>

      {/* Contenu principal avec plus d'espace et un meilleur contraste */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
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
