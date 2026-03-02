
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarDays, Car } from "lucide-react";

interface Activity {
  id: number;
  type: string;
  message: string;
  time: string;
  icon: string;
}

interface RecentActivitiesCardProps {
  activities: Activity[];
  isLoading: boolean;
}

const RecentActivitiesCard: React.FC<RecentActivitiesCardProps> = ({ activities, isLoading }) => {
  // Helper function to safely get dynamic class names
  const getColorClass = (type: string, prefix: string) => {
    const validTypes = ['appointment', 'service'];
    const color = validTypes.includes(type) ? (type === 'appointment' ? 'blue' : 'green') : 'blue';
    return `${prefix}-${color}`;
  };

  return (
    <Card className="glass-card col-span-1 border-0 overflow-hidden transition-all duration-300 hover:shadow-2xl">
      <CardHeader className="border-b border-white/10 bg-primary/5">
        <CardTitle className="text-xl font-semibold">Activités récentes</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="text-center py-4 text-gray-500">
            <p>Chargement des activités...</p>
          </div>
        ) : activities.length ? (
          <div className="space-y-6">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 p-1 group">
                <div className={`${activity.type === 'service' ? 'bg-primary/15' : 'bg-secondary/20'} p-3 rounded-xl border border-white/10 group-hover:scale-105 transition-transform`}>
                  {activity.icon === 'calendar' ?
                    <CalendarDays className={`h-4 w-4 ${activity.type === 'service' ? 'text-primary' : 'text-foreground/70'}`} /> :
                    <Car className={`h-4 w-4 ${activity.type === 'service' ? 'text-primary' : 'text-foreground/70'}`} />
                  }
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground/90">{activity.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <p>Aucune activité récente</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivitiesCard;
