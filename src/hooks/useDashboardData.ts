
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type DashboardData = {
  services: {
    ongoing: number;
    pending: number;
    total: number;
  };
  appointments: {
    total: number;
    next: {
      date: string | null;
      service: string | null;
    };
  };
  providers: {
    total: number;
    available: number;
  };
  notifications: Array<{
    id: number;
    message: string;
    time: string;
  }>;
  activities: Array<{
    id: number;
    type: string;
    message: string;
    time: string;
    icon: string;
  }>;
  upcomingAppointments: Array<{
    id: number;
    service: string;
    date: string;
    icon: string;
    color: string;
  }>;
};

export const useDashboardData = () => {
  const { user } = useAuth();

  const fetchDashboardData = async (): Promise<DashboardData> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Récupérer les réservations de l'utilisateur
    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select("*, services(name)")
      .eq("user_id", user.id);

    if (bookingsError) {
      console.error("Error fetching bookings:", bookingsError);
    }

    // Récupérer les prestataires disponibles
    const { data: providers, error: providersError } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "provider");

    if (providersError) {
      console.error("Error fetching providers:", providersError);
    }

    // Calculer les statistiques
    const ongoingServices = bookings?.filter(b => b.status === "ongoing").length || 0;
    const pendingServices = bookings?.filter(b => b.status === "pending").length || 0;

    // Trier les réservations par date pour trouver la prochaine
    const sortedBookings = [...(bookings || [])].sort(
      (a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime()
    );

    const nextAppointment = sortedBookings.find(
      b => new Date(b.scheduled_date).getTime() > Date.now()
    );

    // Formater les données pour l'affichage
    const formattedData: DashboardData = {
      services: {
        ongoing: ongoingServices,
        pending: pendingServices,
        total: bookings?.length || 0,
      },
      appointments: {
        total: bookings?.length || 0,
        next: {
          date: nextAppointment?.scheduled_date 
            ? new Date(nextAppointment.scheduled_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
            : null,
          service: nextAppointment?.services?.name || null,
        },
      },
      providers: {
        total: providers?.length || 0,
        available: providers?.filter(p => true).length || 0, // Idéalement, ajoutez une logique de disponibilité
      },
      notifications: [
        { id: 1, message: "Nouveau rendez-vous confirmé", time: "Il y a 1 heure" },
        { id: 2, message: "Service terminé", time: "Il y a 3 heures" },
      ],
      activities: [
        { 
          id: 1, 
          type: "appointment", 
          message: "Nouveau rendez-vous", 
          time: "Il y a 2 heures",
          icon: "calendar" 
        },
        { 
          id: 2, 
          type: "service", 
          message: "Service terminé", 
          time: "Il y a 4 heures",
          icon: "car" 
        },
      ],
      upcomingAppointments: sortedBookings
        .filter(b => new Date(b.scheduled_date).getTime() > Date.now())
        .slice(0, 2)
        .map((booking, index) => ({
          id: index + 1,
          service: booking.services?.name || "Service",
          date: new Date(booking.scheduled_date).toLocaleDateString('fr-FR', { 
            day: 'numeric', 
            month: 'long',
            hour: '2-digit',
            minute: '2-digit'
          }),
          icon: "car",
          color: index === 0 ? "purple" : "orange"
        })),
    };

    return formattedData;
  };

  return useQuery({
    queryKey: ["dashboardData", user?.id],
    queryFn: fetchDashboardData,
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
