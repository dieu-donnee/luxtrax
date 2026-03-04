
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CalendarDays, Car, Settings } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { Wallet, GraduationCap, LayoutDashboard } from "lucide-react";

const SidebarContent = () => {
  const { toast } = useToast();
  const { profile } = useAuth();
  const { data: dashboardData, isLoading } = useDashboardData();

  const dismissNotification = (id: number) => {
    toast({
      title: "Notification dismissed",
      variant: "default",
      duration: 2000,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {profile?.role === 'admin' && (
        <Card className="bg-white border-gray-50 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-gray-200/20 transition-all duration-500 overflow-hidden border">
          <div className="p-6 bg-primary/5 border-b border-primary/10">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Administration
            </h3>
          </div>
          <CardContent className="p-6">
            <Link to="/admin">
              <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 transition-all">
                Control Panel
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {(profile?.role === 'provider' || profile?.role === 'admin') && (
        <Card className="bg-white border-gray-50 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-gray-200/20 transition-all duration-500 overflow-hidden border">
          <div className="p-6 bg-primary/5 border-b border-primary/10">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Provider Space
            </h3>
          </div>
          <CardContent className="p-6 space-y-3">
            <Link to="/provider/wallet">
              <Button variant="outline" className="w-full h-12 border-gray-100 rounded-xl hover:bg-primary/5 hover:text-primary flex items-center justify-between group px-4">
                <span className="text-[10px] uppercase font-black tracking-widest">My Wallet</span>
                <Wallet className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
              </Button>
            </Link>
            <Link to="/provider/academy">
              <Button variant="outline" className="w-full h-12 border-gray-100 rounded-xl hover:bg-primary/5 hover:text-primary flex items-center justify-between group px-4">
                <span className="text-[10px] uppercase font-black tracking-widest">Academy Training</span>
                <GraduationCap className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Notifications */}
      <Card className="bg-white border-gray-50 rounded-[2.5rem] shadow-sm transition-all duration-500 border overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#1A1A1A] flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            Alerts
          </h3>
          <span className="bg-primary/10 text-primary text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm border border-primary/5">
            {dashboardData?.notifications.length || 0}
          </span>
        </div>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="text-center py-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 animate-pulse">Wait...</p>
            </div>
          ) : dashboardData?.notifications.length ? (
            <div className="space-y-4">
              {dashboardData.notifications.map((notif) => (
                <div key={notif.id} className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-gray-50/50 hover:bg-white border border-transparent hover:border-gray-50 transition-all duration-500 group shadow-inner hover:shadow-lg hover:shadow-gray-200/20">
                  <div className="flex items-start gap-3">
                    <div className="bg-white p-2 rounded-lg text-gray-300 group-hover:text-primary transition-colors shadow-sm">
                      <Bell className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-[#1A1A1A] leading-tight tracking-tight">{notif.message}</p>
                      <p className="text-[8px] text-gray-400 mt-1 uppercase font-black tracking-widest">{notif.time}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissNotification(notif.id)}
                    className="text-gray-200 hover:text-red-500 transition-colors pt-0.5"
                  >
                    <span className="text-xl">×</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Clear Sky</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appointments */}
      <Card className="bg-white border-gray-50 rounded-[2.5rem] shadow-sm transition-all duration-500 border overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#1A1A1A] flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            Agenda
          </h3>
        </div>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="text-center py-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 animate-pulse">Wait...</p>
            </div>
          ) : dashboardData?.upcomingAppointments.length ? (
            <div className="space-y-4">
              {dashboardData.upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center gap-4 p-4 rounded-2xl border border-transparent hover:border-gray-50 hover:bg-white hover:shadow-xl hover:shadow-gray-200/20 shadow-inner bg-gray-50/50 transition-all duration-500 group">
                  <div className="bg-white p-3 rounded-xl text-gray-300 group-hover:text-primary transition-all duration-500 shadow-sm border border-transparent group-hover:border-primary/5">
                    <Car className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-black text-[#1A1A1A] tracking-tight uppercase group-hover:text-primary transition-colors">{appointment.service}</p>
                    <p className="text-[9px] text-gray-400 mt-1 font-black uppercase tracking-[0.15em] flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      {appointment.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Agenda Empty</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SidebarContent;
