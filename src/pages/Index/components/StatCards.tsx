
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, CalendarDays, Users, Settings } from "lucide-react";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  description: string;
  color: string;
}

interface StatCardsProps {
  data?: {
    ongoing: number;
    pending: number;
    total: number;
  };
  isLoading: boolean;
}

const StatCards: React.FC<StatCardsProps> = ({ data, isLoading }) => {
  const stats = [
    {
      title: "Services",
      value: data ? `${data.total}` : "...",
      icon: Car,
      description: data
        ? `${data.pending} pending, ${data.ongoing} active`
        : "Loading...",
    },
    {
      title: "Appointments",
      value: "12",
      icon: CalendarDays,
      description: "Next: March 15",
    },
    {
      title: "Providers",
      value: "8",
      icon: Users,
      description: "5 available",
    },
    {
      title: "Settings",
      value: "4",
      icon: Settings,
      description: "2 alerts",
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 px-2 py-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-white border-none shadow-[0_10px_30px_rgba(0,0,0,0.02)] rounded-[2rem] transition-all duration-300 group hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-5">
            <div className="p-2.5 rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <stat.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-3 w-20" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-black text-gray-900 tracking-tight">{stat.value}</div>
                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider group-hover:text-primary transition-colors">
                  {stat.title}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default React.memo(StatCards);
