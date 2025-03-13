
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Car, Clock, MapPin, PenLine, Tag, Shield } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";

type Service = Database["public"]["Tables"]["services"]["Row"];

interface BookingSummaryProps {
  service: Service | null;
  date: Date | undefined;
  time: string;
  address: string;
  notes: string;
}

const BookingSummary = ({ service, date, time, address, notes }: BookingSummaryProps) => {
  const { profile } = useAuth();
  
  if (!service || !date) {
    return <div>Informations incomplètes. Veuillez revenir aux étapes précédentes.</div>;
  }

  // Calculate price based on vehicle type
  const calculateAdjustedPrice = (basePrice: number) => {
    const vehicleType = profile?.vehicle_type || 'sedan';
    const multipliers: Record<string, number> = {
      sedan: 1,
      suv: 1.2,
      truck: 1.5,
      van: 1.3,
      motorcycle: 0.7
    };
    
    return basePrice * (multipliers[vehicleType] || 1);
  };

  // Original price and discount calculations
  const originalPrice = calculateAdjustedPrice(service.price);
  const discountAmount = service.discount_percentage 
    ? originalPrice * (service.discount_percentage / 100)
    : 0;
  const subtotal = originalPrice - discountAmount;
  
  // Apply loyalty discount if applicable (simulated - would come from user profile)
  const loyaltyDiscount = profile?.loyalty_level === 'gold' ? subtotal * 0.05 : 0;
  
  // Calculate final price
  const finalPrice = subtotal - loyaltyDiscount;

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

      <div>
        <Separator className="my-4" />
        <div className="rounded-lg border p-4 bg-white">
          <h4 className="font-medium mb-3">Détails du prix</h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Prix de base</span>
              <span>{service.price.toFixed(2)}€</span>
            </div>
            
            {profile?.vehicle_type && profile.vehicle_type !== 'sedan' && (
              <div className="flex justify-between">
                <span>Ajustement {profile.vehicle_type}</span>
                <span>{(originalPrice - service.price).toFixed(2)}€</span>
              </div>
            )}
            
            {service.discount_percentage > 0 && (
              <div className="flex justify-between text-green-600">
                <span className="flex items-center">
                  <Tag className="h-3.5 w-3.5 mr-1" />
                  Remise ({service.discount_percentage}%)
                </span>
                <span>-{discountAmount.toFixed(2)}€</span>
              </div>
            )}
            
            {loyaltyDiscount > 0 && (
              <div className="flex justify-between text-amber-600">
                <span className="flex items-center">
                  <Shield className="h-3.5 w-3.5 mr-1" />
                  Fidélité Gold (5%)
                </span>
                <span>-{loyaltyDiscount.toFixed(2)}€</span>
              </div>
            )}
            
            <Separator className="my-2" />
            
            <div className="flex justify-between font-medium text-base pt-1">
              <span>Prix total:</span>
              <span className="text-lg text-blue-600 font-bold">
                {finalPrice.toFixed(2)}€
              </span>
            </div>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-3 text-center">
          Prix estimé. Le prix final peut varier en fonction de l'état du véhicule et de services additionnels.
        </p>
      </div>
    </div>
  );
};

export default BookingSummary;
