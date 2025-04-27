
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
    <Card className="col-span-1 border-0 shadow-lg">
      <CardHeader className="border-b">
        <CardTitle className="text-xl">Activités récentes</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="text-center py-4 text-gray-500">
            <p>Chargement des activités...</p>
          </div>
        ) : activities.length ? (
          <div className="space-y-6">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className={`${getColorClass(activity.type, 'bg')}-100 p-2 rounded-full`}>
                  {activity.icon === 'calendar' ? 
                    <CalendarDays className={`h-4 w-4 ${getColorClass(activity.type, 'text')}-600`} /> :
                    <Car className={`h-4 w-4 ${getColorClass(activity.type, 'text')}-600`} />
                  }
                </div>
                <div>
                  <p className="text-sm font-medium">{activity.message}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
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
