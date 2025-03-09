
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car } from "lucide-react";

const UpcomingAppointmentsCard = () => {
  return (
    <Card className="col-span-1 border-0 shadow-lg">
      <CardHeader className="border-b">
        <CardTitle className="text-xl">Prochains rendez-vous</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="bg-purple-100 p-2 rounded-full">
              <Car className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Lavage complet</p>
              <p className="text-sm text-gray-500">15 Mars, 14:00</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-orange-100 p-2 rounded-full">
              <Car className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Nettoyage intérieur</p>
              <p className="text-sm text-gray-500">18 Mars, 10:00</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingAppointmentsCard;
