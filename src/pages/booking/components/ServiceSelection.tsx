
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Service = Database["public"]["Tables"]["services"]["Row"];

interface ServiceSelectionProps {
  selectedService: Service | null;
  onSelectService: (service: Service) => void;
}

const ServiceSelection = ({ selectedService, onSelectService }: ServiceSelectionProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('price', { ascending: true });

        if (error) {
          throw error;
        }

        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
        setError('Impossible de charger les services. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="relative cursor-not-allowed overflow-hidden">
            <CardHeader className="space-y-2">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-6 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4 text-center">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <p className="text-gray-600 mb-4">
        Choisissez le service qui correspond le mieux à vos besoins :
      </p>
      
      {services.map((service) => (
        <Card 
          key={service.id} 
          className={`relative cursor-pointer transition-all hover:border-blue-400 ${
            selectedService?.id === service.id 
              ? 'border-2 border-blue-600 shadow-md' 
              : 'border-gray-200'
          }`}
          onClick={() => onSelectService(service)}
        >
          {service.is_vip && (
            <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs px-2 py-1 rounded-bl-md rounded-tr-md font-medium">
              VIP
            </div>
          )}
          
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{service.name}</span>
              <span className="text-lg font-bold text-blue-600">
                {service.discount_percentage ? (
                  <div className="flex flex-col items-end">
                    <span className="text-sm line-through text-gray-400">
                      {service.price.toFixed(2)}€
                    </span>
                    <span>
                      {(service.price * (1 - service.discount_percentage / 100)).toFixed(2)}€
                    </span>
                  </div>
                ) : (
                  `${service.price.toFixed(2)}€`
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
            <div className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium ${
              service.type === 'carwash' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-purple-100 text-purple-800'
            }`}>
              {service.type === 'carwash' ? 'Lavage Auto' : 'Nettoyage Intérieur'}
            </div>
          </CardFooter>
          
          {selectedService?.id === service.id && (
            <div className="absolute inset-0 border-2 border-blue-600 rounded-lg pointer-events-none"></div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default ServiceSelection;
