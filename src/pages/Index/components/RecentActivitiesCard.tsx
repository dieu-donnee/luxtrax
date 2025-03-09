
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Car } from "lucide-react";

const RecentActivitiesCard = () => {
  return (
    <Card className="col-span-1 border-0 shadow-lg">
      <CardHeader className="border-b">
        <CardTitle className="text-xl">Activités récentes</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <CalendarDays className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Nouveau rendez-vous</p>
              <p className="text-sm text-gray-500">Il y a 2 heures</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-green-100 p-2 rounded-full">
              <Car className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Service terminé</p>
              <p className="text-sm text-gray-500">Il y a 4 heures</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivitiesCard;
