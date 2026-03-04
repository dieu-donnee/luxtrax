
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
      title: "Notification dismissed",
      variant: "default",
      duration: 2000,
    });
  };

  return (
    <Card className="bg-white border-none rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)]">
      <CardHeader className="flex flex-row items-center justify-between p-7 pb-4">
        <CardTitle className="text-xl font-extrabold text-gray-900 flex items-center gap-3">
          <div className="p-2.5 bg-primary/5 text-primary rounded-xl">
            <Bell className="h-5 w-5" />
          </div>
          Notifications
        </CardTitle>
        <div className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg shadow-primary/20">
          {notifications.length}
        </div>
      </CardHeader>
      <CardContent className="px-7 pb-7">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-400 animate-pulse font-medium">Refreshing...</p>
          </div>
        ) : notifications.length ? (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div key={notif.id} className="flex items-start justify-between space-x-4 p-4 rounded-2xl border border-gray-50 hover:border-primary/20 hover:bg-primary/5 transition-all duration-300 group">
                <div className="flex items-start space-x-4">
                  <div className="mt-1 w-2 h-2 bg-primary rounded-full group-hover:scale-125 transition-transform" />
                  <div>
                    <p className="text-sm font-bold text-[#1A1A1A] leading-relaxed">{notif.message}</p>
                    <p className="text-[10px] text-gray-400 mt-1 font-bold uppercase tracking-widest">{notif.time}</p>
                  </div>
                </div>
                <button
                  onClick={() => dismissNotification(notif.id)}
                  className="text-gray-300 hover:text-gray-500 transition-colors p-1"
                >
                  <span className="sr-only">Dismiss</span>
                  <span className="text-xl leading-none">×</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-gray-400 font-medium italic">No new notifications</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationsCard;
