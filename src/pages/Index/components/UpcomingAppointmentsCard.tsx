
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Car } from "lucide-react";

interface Appointment {
  id: number;
  service: string;
  date: string;
  icon: string;
  color: string;
}

interface UpcomingAppointmentsCardProps {
  appointments: Appointment[];
  isLoading: boolean;
}

const UpcomingAppointmentsCard: React.FC<UpcomingAppointmentsCardProps> = ({ appointments, isLoading }) => {
  // Function to get dynamic class names safely
  const getColorClass = (type: string, prefix: string) => {
    const validColors = ['purple', 'orange', 'blue', 'green', 'red', 'yellow'];
    return validColors.includes(type) ? `${prefix}-${type}` : `${prefix}-blue`;
  };

  return (
    <Card className="glass-card col-span-1 border-0 overflow-hidden transition-all duration-300 hover:shadow-2xl">
      <CardHeader className="border-b border-white/10 bg-primary/5">
        <CardTitle className="text-xl font-semibold">Prochains rendez-vous</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="text-center py-4 text-gray-500">
            <p>Chargement des rendez-vous...</p>
          </div>
        ) : appointments.length ? (
          <div className="space-y-6">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="flex items-start space-x-4 p-2 rounded-xl border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all group">
                <div className="bg-primary/10 p-3 rounded-xl border border-primary/20 group-hover:scale-105 transition-transform shadow-inner">
                  <Car className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground/90">{appointment.service}</p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    {appointment.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <p>Aucun rendez-vous prévu</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingAppointmentsCard;
