
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Notification {
  id: number;
  message: string;
  time: string;
}

interface NotificationsCardProps {
  notifications: Notification[];
  isLoading: boolean;
}

const NotificationsCard: React.FC<NotificationsCardProps> = ({ notifications, isLoading }) => {
  const { toast } = useToast();

  const dismissNotification = (id: number) => {
    toast({
      title: "Notification supprimée",
      variant: "default",
      duration: 2000,
    });
  };

  return (
    <Card className="glass-card col-span-1 border-0 overflow-hidden transition-all duration-300 hover:shadow-2xl">
      <CardHeader className="border-b border-white/10 flex flex-row items-center justify-between bg-primary/5">
        <CardTitle className="text-xl flex items-center gap-2 font-semibold">
          <Bell className="h-5 w-5 text-primary" />
          Notifications
        </CardTitle>
        <span className="bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/20">
          {notifications.length}
        </span>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="text-center py-4 text-gray-500">
            <p>Chargement des notifications...</p>
          </div>
        ) : notifications.length ? (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div key={notif.id} className="flex items-start justify-between space-x-4 p-4 bg-white/40 dark:bg-white/5 rounded-xl border border-white/20 hover:border-primary/30 hover:bg-white/60 dark:hover:bg-white/10 transition-all duration-200 group">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2.5 rounded-lg group-hover:scale-110 transition-transform">
                    <Bell className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground/90">{notif.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
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
  );
};

export default NotificationsCard;
