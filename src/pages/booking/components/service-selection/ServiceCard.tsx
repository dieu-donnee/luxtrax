
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Database } from "@/integrations/supabase/types";

type Service = Database["public"]["Tables"]["services"]["Row"] & {
  is_popular?: boolean;
  category?: string;
  estimated_duration?: number;
};

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onSelect: (service: Service) => void;
  calculateEstimatedPrice: (basePrice: number) => number;
  getServiceIcon: (service: Service) => JSX.Element;
}

const ServiceCard = ({ 
  service, 
  isSelected, 
  onSelect, 
  calculateEstimatedPrice, 
  getServiceIcon 
}: ServiceCardProps) => {
  return (
    <Card 
      key={service.id} 
      className={`relative cursor-pointer transition-all hover:border-blue-400 ${
        isSelected 
          ? 'border-2 border-blue-600 shadow-md' 
          : 'border-gray-200'
      }`}
      onClick={() => onSelect(service)}
    >
      {service.is_vip && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs px-2 py-1 rounded-bl-md rounded-tr-md font-medium">
          VIP
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="mr-3 bg-gray-100 p-2 rounded-full">
              {getServiceIcon(service)}
            </div>
            <span>{service.name}</span>
          </div>
          <span className="text-lg font-bold text-blue-600">
            {service.discount_percentage ? (
              <div className="flex flex-col items-end">
                <span className="text-sm line-through text-gray-400">
                  {service.price.toFixed(2)}€
                </span>
                <span>
                  {(calculateEstimatedPrice(service.price * (1 - service.discount_percentage / 100))).toFixed(2)}€
                </span>
              </div>
            ) : (
              `${calculateEstimatedPrice(service.price).toFixed(2)}€`
            )}
          </span>
        </CardTitle>
        <CardDescription>
          {service.description || "Description non disponible"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">
          {service.details || "Pas de détails additionnels"}
        </p>
      </CardContent>
      <CardFooter className="border-t pt-4 mt-2">
        <div className="flex gap-2 flex-wrap">
          <div className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium ${
            service.type === 'carwash' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-purple-100 text-purple-800'
          }`}>
            {service.type === 'carwash' ? 'Lavage Auto' : 'Nettoyage Intérieur'}
          </div>
          
          {service.is_popular && (
            <div className="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium bg-green-100 text-green-800">
              Populaire
            </div>
          )}
          
          {service.estimated_duration && (
            <div className="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800">
              {service.estimated_duration} min
            </div>
          )}
        </div>
      </CardFooter>
      
      {isSelected && (
        <div className="absolute inset-0 border-2 border-blue-600 rounded-lg pointer-events-none"></div>
      )}
    </Card>
  );
};

export default ServiceCard;
