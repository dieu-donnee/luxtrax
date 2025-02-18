
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
      description: "2 en attente, 1 en cours"
    },
    {
      title: "Rendez-vous",
      value: "12",
      icon: CalendarDays,
      description: "Prochain: 15 Mars"
    },
    {
      title: "Prestataires",
      value: "8",
      icon: Users,
      description: "5 disponibles"
    },
    {
      title: "Paramètres",
      value: "4",
      icon: Settings,
      description: "2 notifications"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Bonjour, {profile?.full_name || user?.email}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Bienvenue sur votre tableau de bord
          </p>
        </div>
      </div>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Grille de statistiques */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Section principale */}
        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Activités récentes */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Activités récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Liste des activités */}
                <div className="flex items-center">
                  <div className="ml-4">
                    <p className="text-sm font-medium">Nouveau rendez-vous</p>
                    <p className="text-sm text-gray-500">Il y a 2 heures</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="ml-4">
                    <p className="text-sm font-medium">Service terminé</p>
                    <p className="text-sm text-gray-500">Il y a 4 heures</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prochains rendez-vous */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Prochains rendez-vous</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Liste des rendez-vous */}
                <div className="flex items-center">
                  <div className="ml-4">
                    <p className="text-sm font-medium">Lavage complet</p>
                    <p className="text-sm text-gray-500">15 Mars, 14:00</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="ml-4">
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
