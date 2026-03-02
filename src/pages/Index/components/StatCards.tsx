
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
    },
    {
      title: "Rendez-vous",
      value: "12",
      icon: CalendarDays,
      description: "Prochain: 15 Mars",
    },
    {
      title: "Prestataires",
      value: "8",
      icon: Users,
      description: "5 disponibles",
    },
    {
      title: "Paramètres",
      value: "4",
      icon: Settings,
      description: "2 notifications",
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 p-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="glass-card hover:shadow-2xl transition-all duration-300 border-0 group hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
              {stat.title}
            </CardTitle>
            <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-inner">
              <stat.icon className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
            ) : (
              <>
                <div className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</div>
                <p className="text-xs font-medium text-muted-foreground mt-2 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-primary" />
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
