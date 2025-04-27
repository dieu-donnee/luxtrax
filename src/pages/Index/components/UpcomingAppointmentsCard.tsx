
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
    <Card className="col-span-1 border-0 shadow-lg">
      <CardHeader className="border-b">
        <CardTitle className="text-xl">Prochains rendez-vous</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="text-center py-4 text-gray-500">
            <p>Chargement des rendez-vous...</p>
          </div>
        ) : appointments.length ? (
          <div className="space-y-6">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="flex items-start space-x-4">
                <div className={`${getColorClass(appointment.color, 'bg')}-100 p-2 rounded-full`}>
                  <Car className={`h-4 w-4 ${getColorClass(appointment.color, 'text')}-600`} />
                </div>
                <div>
                  <p className="text-sm font-medium">{appointment.service}</p>
                  <p className="text-sm text-gray-500">{appointment.date}</p>
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
