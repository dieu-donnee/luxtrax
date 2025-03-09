
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface Notification {
  id: number;
  message: string;
  time: string;
}

const NotificationsCard = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, message: "Nouveau rendez-vous confirmé", time: "Il y a 1 heure" },
    { id: 2, message: "Service terminé", time: "Il y a 3 heures" },
  ]);

  const dismissNotification = (id: number) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
    toast({
      title: "Notification supprimée",
      variant: "default",
      duration: 2000,
    });
  };

  return (
    <Card className="col-span-1 border-0 shadow-lg">
      <CardHeader className="border-b flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-500" />
          Notifications
        </CardTitle>
        <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {notifications.length}
        </span>
      </CardHeader>
      <CardContent className="pt-6">
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div key={notif.id} className="flex items-start justify-between space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Bell className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{notif.message}</p>
                    <p className="text-sm text-gray-500">{notif.time}</p>
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
