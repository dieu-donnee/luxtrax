
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Car, Clock, MapPin, PenLine } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Service = Database["public"]["Tables"]["services"]["Row"];

interface BookingSummaryProps {
  service: Service | null;
  date: Date | undefined;
  time: string;
  address: string;
  notes: string;
}

const BookingSummary = ({ service, date, time, address, notes }: BookingSummaryProps) => {
  if (!service || !date) {
    return <div>Informations incomplètes. Veuillez revenir aux étapes précédentes.</div>;
  }

  // Calcul du prix avec la remise si applicable
  const finalPrice = service.discount_percentage 
    ? service.price * (1 - service.discount_percentage / 100) 
    : service.price;

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
              <Car className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-700">Service</p>
                <p className="text-gray-900">{service.name}</p>
                {service.description && (
                  <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                )}
              </div>
            </div>

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
          </div>
        </CardContent>
      </Card>

      <div>
        <Separator className="my-4" />
        <div className="flex justify-between items-center font-medium">
          <span>Prix total:</span>
          <div className="text-right">
            {service.discount_percentage ? (
              <>
                <span className="text-sm text-gray-500 line-through block">
                  {service.price.toFixed(2)}€
                </span>
                <span className="text-lg text-blue-600 font-bold">
                  {finalPrice.toFixed(2)}€
                </span>
              </>
            ) : (
              <span className="text-lg text-blue-600 font-bold">
                {finalPrice.toFixed(2)}€
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
