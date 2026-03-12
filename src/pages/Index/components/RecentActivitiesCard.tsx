
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, CalendarDays, Car } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: number;
  type: string;
  message: string;
  time: string;
  icon: string;
}

interface RecentActivitiesCardProps {
  activities: ActivityItem[];
  isLoading: boolean;
}

const RecentActivitiesCard: React.FC<RecentActivitiesCardProps> = ({ activities, isLoading }) => {
  return (
    <Card className="bg-white border-none rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-500 hover:shadow-[0_30px_60_rgba(0,0,0,0.06)]">
      <CardHeader className="p-7 pb-4">
        <CardTitle className="text-xl font-extrabold text-[#1A1A1A] flex items-center gap-3">
          <div className="p-2.5 bg-primary/5 text-primary rounded-xl">
            <Activity className="h-5 w-5" />
          </div>
          Activities
        </CardTitle>
      </CardHeader>
      <CardContent className="px-7 pb-7">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-400 animate-pulse font-medium">Tracking history...</p>
          </div>
        ) : activities.length ? (
          <div className="space-y-6">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 group">
                <div className={cn(
                  "p-3 rounded-2xl transition-all duration-300 group-hover:scale-110 shadow-sm",
                  activity.type === 'service' ? 'bg-primary/5 text-primary border border-primary/10' : 'bg-gray-50 text-gray-400 border border-gray-100'
                )}>
                  {activity.icon === 'calendar' ? <CalendarDays className="h-4 w-4" /> : <Car className="h-4 w-4" />}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-bold text-[#1A1A1A] group-hover:text-primary transition-colors leading-tight">
                    {activity.message}
                  </p>
                  <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-gray-400 font-medium italic">No recent activities</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivitiesCard;
