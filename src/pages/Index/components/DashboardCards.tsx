import { Card } from "@/components/ui/card";
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Star, ArrowRight, Clock } from "lucide-react";
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

  const services = [
    {
      id: "std",
      title: "Lavage Standard",
      price: "15,000 FCFA",
      category: "Professional Wash",
      image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=800&auto=format&fit=crop",
      rating: 4.8,
    },
    {
      id: "prm",
      title: "Lavage Premium",
      price: "25,000 FCFA",
      category: "Deep Cleaning",
      image: "https://images.unsplash.com/photo-1601362840469-51e4d8d59085?q=80&w=800&auto=format&fit=crop",
      rating: 4.9,
    },
    {
      id: "int",
      title: "Nettoyage Intérieur",
      price: "10,000 FCFA",
      category: "Detailing",
      image: "https://images.unsplash.com/photo-1507133366044-c99002c10223?q=80&w=800&auto=format&fit=crop",
      rating: 4.7,
    }
  ];

  if (profile?.role !== 'provider') {
    return (
      <div className="space-y-10 pb-24 lg:pb-12">
        {/* Top Rated Services */}
        <section className="space-y-6">
          <div className="flex justify-between items-end px-2">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Top Rated Services</h2>
              <p className="text-gray-400 text-sm font-medium">Specially selected for you</p>
            </div>
            <button className="text-primary font-bold text-sm hover:underline transition-all">See All</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.id} className="group overflow-hidden border-none bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:-translate-y-2">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-xl">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="text-[11px] font-extrabold text-gray-900">{service.rating}</span>
                  </div>
                  <div className="absolute bottom-5 left-5">
                    <span className="bg-primary/90 backdrop-blur-md text-white px-4 py-1.5 rounded-xl text-[10px] font-extrabold tracking-widest uppercase">
                      {service.category}
                    </span>
                  </div>
                </div>
                <div className="p-7 space-y-5">
                  <div className="flex justify-between items-start">
                    <h3 className="font-extrabold text-xl text-gray-900 leading-tight">{service.title}</h3>
                    <p className="text-primary font-black text-lg">{service.price.split(' ')[0]}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={() => navigate('/booking')}
                      className="flex-1 h-14 bg-primary hover:bg-primary/90 text-white font-extrabold rounded-2xl shadow-xl shadow-primary/10 transition-all active:scale-95 group/btn"
                    >
                      Book Now
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                    <button className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:text-primary hover:bg-primary/5 transition-colors">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Recent Activity Section */}
        <section className="space-y-6">
          <div className="flex justify-between items-end px-2">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Recent Activity</h2>
              <p className="text-gray-400 text-sm font-medium">Your latest luxury experiences</p>
            </div>
          </div>

          <Card className="p-6 flex items-center gap-5 border-none shadow-[0_15px_40px_rgba(0,0,0,0.03)] rounded-[2rem] bg-white group hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all">
            <div className="w-16 h-16 bg-primary/5 rounded-[1.25rem] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <Clock className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                <h4 className="font-extrabold text-gray-900 text-lg">Dernier lavage</h4>
              </div>
              <p className="text-sm text-gray-400 font-medium">Lavage Premium • 23 Mars 2024 • Terminé</p>
            </div>
            <button className="p-4 text-gray-300 hover:text-primary transition-colors">
              <ChevronRight className="w-6 h-6" />
            </button>
          </Card>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-24 lg:pb-12">
      <Card className="bg-white/50 backdrop-blur-xl p-4 border-none rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
        <div className="px-6 pt-4 flex justify-between items-center mb-6">
          <h2 className="text-xl font-extrabold text-gray-900">Dashboard Overivew</h2>
          <Button
            onClick={() => toast({ title: "Missions", description: "Recherche de missions à proximité..." })}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-6 h-12 rounded-xl transition-all shadow-xl shadow-primary/20"
          >
            <Plus className="h-4 w-4" />
            New Mission
          </Button>
        </div>

        <StatCards data={dashboardData?.services} isLoading={isLoading} />
      </Card>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
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
    </div>
  );
};

import { ChevronRight } from "lucide-react";

export default React.memo(DashboardCards);
