
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

    // Define explicit type for bookings and providers
    type Booking = {
      id: string;
      user_id: string;
      service_id: string;
      status: string;
      scheduled_date: string;
      services?: { name: string };
    };

    type Provider = {
      id: string;
      role: string;
    };

    // Use Promise.all to parallelize data fetching
    const [bookingsResult, providersResult] = await Promise.all([
      (supabase
        .from("bookings") as any)
        .select("*, services(name)") as Promise<{ data: Booking[] | null; error: any }>,
      (supabase
        .from("profiles") as any)
        .select("*")
        .eq("role", "provider") as Promise<{ data: Provider[] | null; error: any }>
    ]);

    const bookings = bookingsResult.data || [];
    const providers = providersResult.data || [];
    
    if (bookingsResult.error) {
      console.error("Error fetching bookings:", bookingsResult.error);
    }
    
    if (providersResult.error) {
      console.error("Error fetching providers:", providersResult.error);
    }

    // Pre-compute values to avoid redundant calculations
    const ongoingServices = bookings.filter(b => b.status === "ongoing").length;
    const pendingServices = bookings.filter(b => b.status === "pending").length;
    const totalServices = bookings.length;
    const availableProviders = providers.filter(p => true).length;

    // Sort only once
    const sortedBookings = [...bookings].sort(
      (a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime()
    );

    const nextAppointment = sortedBookings.find(
      b => new Date(b.scheduled_date).getTime() > Date.now()
    );

    const upcomingAppointments = sortedBookings
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
      }));

    // Return optimized data
    return {
      services: {
        ongoing: ongoingServices,
        pending: pendingServices,
        total: totalServices,
      },
      appointments: {
        total: totalServices,
        next: {
          date: nextAppointment?.scheduled_date 
            ? new Date(nextAppointment.scheduled_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
            : null,
          service: nextAppointment?.services?.name || null,
        },
      },
      providers: {
        total: providers.length,
        available: availableProviders,
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
      upcomingAppointments,
    };
  };

  return useQuery({
    queryKey: ["dashboardData", user?.id],
    queryFn: fetchDashboardData,
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
  });
};
