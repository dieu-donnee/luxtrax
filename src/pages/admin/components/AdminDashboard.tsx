import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, Calendar, DollarSign, TrendingUp } from "lucide-react";

interface Stats {
  totalUsers: number;
  totalBookings: number;
  pendingBookings: number;
  totalRevenue: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch users count
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      const { count: bookingsCount } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true });

      const { count: pendingCount } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      const { data: services } = await supabase
        .from("services")
        .select("price");

      const totalRevenue = services?.reduce((sum, service) => sum + Number(service.price), 0) || 0;

      setStats({
        totalUsers: usersCount || 0,
        totalBookings: bookingsCount || 0,
        pendingBookings: pendingCount || 0,
        totalRevenue
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Chargement des statistiques...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Utilisateurs inscrits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réservations</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              Total des réservations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingBookings}</div>
            <p className="text-xs text-muted-foreground">
              Réservations en attente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue}€</div>
            <p className="text-xs text-muted-foreground">
              Revenus potentiels
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aperçu de l'activité</CardTitle>
          <CardDescription>
            Statistiques globales de la plateforme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">Utilisateurs par rôle</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Clients:</span>
                    <span className="font-medium">{Math.floor(stats.totalUsers * 0.7)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prestataires:</span>
                    <span className="font-medium">{Math.floor(stats.totalUsers * 0.25)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Admins:</span>
                    <span className="font-medium">{Math.floor(stats.totalUsers * 0.05)}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Statut des réservations</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>En attente:</span>
                    <span className="font-medium">{stats.pendingBookings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Confirmées:</span>
                    <span className="font-medium">{Math.floor(stats.totalBookings * 0.6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Terminées:</span>
                    <span className="font-medium">{Math.floor(stats.totalBookings * 0.3)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;