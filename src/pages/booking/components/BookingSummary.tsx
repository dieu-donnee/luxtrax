
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, MapPin, PenLine, Car } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface BookingSummaryProps {
  date: Date | undefined;
  time: string;
  address: string;
  notes: string;
}

const BookingSummary = ({ date, time, address, notes }: BookingSummaryProps) => {
  const { profile } = useAuth();
  
  if (!date) {
    return <div>Informations incomplètes. Veuillez revenir aux étapes précédentes.</div>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Récapitulatif de votre réservation</h3>
      <p className="text-sm text-gray-600">
        Vérifiez les détails de votre réservation avant de confirmer:
      </p>

      <Card className="border bg-blue-50/50">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-700">Date</p>
                <p className="text-gray-900">
                  {format(date, "EEEE d MMMM yyyy", { locale: fr })}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-700">Heure</p>
                <p className="text-gray-900">{time}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-700">Adresse</p>
                <p className="text-gray-900">{address}</p>
              </div>
            </div>

            {notes && (
              <div className="flex items-start space-x-3">
                <PenLine className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Instructions spéciales</p>
                  <p className="text-gray-900">{notes}</p>
                </div>
              </div>
            )}
            
            {profile?.vehicle_type && (
              <div className="flex items-start space-x-3">
                <Car className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Type de véhicule</p>
                  <p className="text-gray-900 capitalize">{profile.vehicle_type}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingSummary;
