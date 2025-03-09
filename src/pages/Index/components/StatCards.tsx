
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, CalendarDays, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type StatCardProps = {
  title: string;
  value: string;
  icon: React.ElementType;
  description: string;
  color: string;
};

const StatCards = () => {
  const { toast } = useToast();

  const handleAddService = () => {
    toast({
      title: "Nouveau service",
      description: "Redirection vers la page des services...",
      duration: 3000,
    });
  };

  const stats = [
    {
      title: "Services en cours",
      value: "3",
      icon: Car,
      description: "2 en attente, 1 en cours",
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
    <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 p-2">
      <div className="px-6 pt-6 flex justify-end">
        <Button 
          onClick={handleAddService}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nouveau service
        </Button>
      </div>
      
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
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default StatCards;
