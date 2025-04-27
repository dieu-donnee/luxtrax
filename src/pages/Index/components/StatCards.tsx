
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
      title: "Services en cours",
      value: data ? `${data.total}` : "...",
      icon: Car,
      description: data 
        ? `${data.pending} en attente, ${data.ongoing} en cours`
        : "Chargement...",
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Rendez-vous",
      value: "12",
      icon: CalendarDays,
      description: "Prochain: 15 Mars",
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Prestataires",
      value: "8",
      icon: Users,
      description: "5 disponibles",
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "Paramètres",
      value: "4",
      icon: Settings,
      description: "2 notifications",
      color: "bg-orange-100 text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 p-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover:shadow-lg transition-shadow border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${stat.color}`}>
              <stat.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-16 my-1" />
                <Skeleton className="h-4 w-32 mt-2" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
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
