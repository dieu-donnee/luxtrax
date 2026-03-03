
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
      title: "Notification supprimée",
      variant: "default",
      duration: 2000,
    });
  };

  return (
    <div className="space-y-6">
      {profile?.role === 'admin' && (
        <Card className="glass-card border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300">
          <CardHeader className="border-b border-white/10 bg-primary/5">
            <CardTitle className="text-xl flex items-center gap-2 font-bold">
              <Settings className="h-5 w-5 text-primary" />
              Administration
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Link to="/admin">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg transform hover:scale-[1.02] active:scale-95 transition-all">
                Interface Admin
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {(profile?.role === 'provider' || profile?.role === 'admin') && (
        <Card className="glass-card border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300">
          <CardHeader className="border-b border-white/10 bg-primary/5">
            <CardTitle className="text-xl flex items-center gap-2 font-bold">
              <LayoutDashboard className="h-5 w-5 text-primary" />
              Espace Prestataire
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            <Link to="/provider/wallet">
              <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/10 text-primary flex items-center justify-between group/btn">
                <span>Mon Portefeuille</span>
                <Wallet className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
              </Button>
            </Link>
            <Link to="/provider/academy">
              <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/10 text-primary flex items-center justify-between group/btn">
                <span>Formation Academy</span>
                <GraduationCap className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Notifications - Mobile/Sidebar View */}
      <Card className="glass-card border-0 overflow-hidden transition-all duration-300">
        <CardHeader className="border-b border-white/10 flex flex-row items-center justify-between bg-primary/5">
          <CardTitle className="text-xl flex items-center gap-2 font-bold">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
          </CardTitle>
          <span className="bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/20">
            {dashboardData?.notifications.length || 0}
          </span>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="text-center py-4 text-muted-foreground">
              <p className="animate-pulse">Chargement...</p>
            </div>
          ) : dashboardData?.notifications.length ? (
            <div className="space-y-4">
              {dashboardData.notifications.map((notif) => (
                <div key={notif.id} className="flex items-start justify-between space-x-3 p-3 bg-white/40 dark:bg-white/5 rounded-xl border border-white/10 group">
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <Bell className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground/90 leading-tight">{notif.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{notif.time}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissNotification(notif.id)}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <span className="text-xl">×</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p>Aucune notification</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Prochains rendez-vous - Mobile/Sidebar View */}
      <Card className="glass-card border-0 overflow-hidden transition-all duration-300">
        <CardHeader className="border-b border-white/10 bg-primary/5">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            Rendez-vous
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="text-center py-4 text-muted-foreground">
              <p className="animate-pulse">Chargement...</p>
            </div>
          ) : dashboardData?.upcomingAppointments.length ? (
            <div className="space-y-4">
              {dashboardData.upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-start space-x-4 p-3 rounded-xl border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all group">
                  <div className="bg-primary/10 p-3 rounded-xl border border-primary/20 group-hover:scale-105 transition-transform shadow-inner">
                    <Car className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground/90">{appointment.service}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      {appointment.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p>Aucun rendez-vous</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SidebarContent;
