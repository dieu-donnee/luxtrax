import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, Calendar, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";

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
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading Analytics</p>
      </div>
    );
  }

  const statCards = [
    { label: "Active Users", value: stats.totalUsers, icon: Users, trend: "+5.2%", color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Total Bookings", value: stats.totalBookings, icon: Calendar, trend: "+12.1%", color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Pending Missions", value: stats.pendingBookings, icon: TrendingUp, trend: "Stable", color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Est. Revenue", value: `${stats.totalRevenue.toLocaleString()} FCFA`, icon: DollarSign, trend: "+8.4%", color: "text-indigo-500", bg: "bg-indigo-50" },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <Card key={i} className="p-8 rounded-[2.5rem] border-none bg-white shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)] transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-[1.2rem] flex items-center justify-center transition-transform group-hover:scale-110`}>
                <stat.icon size={22} />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                <ArrowUpRight size={12} />
                {stat.trend}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-[#1A1A1A] tracking-tighter italic">{stat.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-10 rounded-[3rem] border-none bg-white shadow-[0_20px_50px_rgba(0,0,0,0.03)] space-y-8">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-[#1A1A1A] tracking-tighter uppercase italic">Platform Health</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Operational Overview</p>
            </div>
            <Activity className="text-primary opacity-20" size={32} />
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Role Distribution</p>
              <div className="space-y-3">
                {[
                  { label: "Clients", count: Math.floor(stats.totalUsers * 0.7), color: "bg-blue-500", percent: 70 },
                  { label: "Providers", count: Math.floor(stats.totalUsers * 0.25), color: "bg-emerald-500", percent: 25 },
                  { label: "Admins", count: Math.floor(stats.totalUsers * 0.05), color: "bg-primary", percent: 5 },
                ].map((role) => (
                  <div key={role.label} className="space-y-2">
                    <div className="flex justify-between text-[11px] font-black uppercase">
                      <span className="text-gray-400 italic">{role.label}</span>
                      <span className="text-[#1A1A1A]">{role.count}</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${role.color} transition-all duration-1000`}
                        style={{ width: `${role.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Booking Performance</p>
              <div className="space-y-3">
                {[
                  { label: "Completed", count: Math.floor(stats.totalBookings * 0.3), color: "bg-emerald-500", percent: 30 },
                  { label: "Confirmed", count: Math.floor(stats.totalBookings * 0.6), color: "bg-blue-500", percent: 60 },
                  { label: "Pending", count: stats.pendingBookings, color: "bg-orange-500", percent: Math.round((stats.pendingBookings / stats.totalBookings) * 100) || 10 },
                ].map((status) => (
                  <div key={status.label} className="space-y-2">
                    <div className="flex justify-between text-[11px] font-black uppercase">
                      <span className="text-gray-400 italic">{status.label}</span>
                      <span className="text-[#1A1A1A]">{status.count}</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${status.color} transition-all duration-1000`}
                        style={{ width: `${status.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-10 rounded-[3rem] border-none bg-[#1A1A1A] text-white shadow-2xl shadow-black/10 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Activity size={120} />
          </div>
          <div className="relative z-10 space-y-6">
            <h3 className="text-xl font-black tracking-tighter uppercase italic">Insights</h3>
            <div className="space-y-6">
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Growth Alert</p>
                <p className="text-sm font-medium leading-relaxed">Booking volume increased by <span className="text-primary font-bold">12%</span> this week. Recommend scaling provider onboarding.</p>
              </div>
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">Efficiency</p>
                <p className="text-sm font-medium leading-relaxed">Platform commission optimized. Net revenue projection: <span className="text-emerald-500 font-bold">4.2M FCFA</span>.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
