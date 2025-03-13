
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Car, Sparkles, Leaf, SprayCan } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";

type Service = Database["public"]["Tables"]["services"]["Row"];

interface ServiceSelectionProps {
  selectedService: Service | null;
  onSelectService: (service: Service) => void;
}

const ServiceSelection = ({ selectedService, onSelectService }: ServiceSelectionProps) => {
  const { profile } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentServices, setRecentServices] = useState<Service[]>([]);

  // Define service categories with icons
  const categories = [
    { id: 'standard', name: 'Standard', icon: Car },
    { id: 'premium', name: 'Premium', icon: Sparkles },
    { id: 'eco', name: 'Écologique', icon: Leaf },
    { id: 'special', name: 'Spécial', icon: SprayCan },
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        let query = supabase
          .from('services')
          .select('*');
          
        if (categoryFilter) {
          query = query.eq('category', categoryFilter);
        }
        
        const { data, error } = await query.order('price', { ascending: true });

        if (error) {
          throw error;
        }

        setServices(data);
        
        // Simulate recently used services - in a real app, this would come from the user's history
        if (data.length > 0) {
          const recent = data.filter(service => service.is_popular).slice(0, 2);
          setRecentServices(recent);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        setError('Impossible de charger les services. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [categoryFilter]);

  const getServiceIcon = (service: Service) => {
    const category = categories.find(c => c.id === service.category) || categories[0];
    const Icon = category.icon;
    return <Icon className="h-5 w-5" />;
  };

  // Calculate estimated price based on vehicle type
  const calculateEstimatedPrice = (basePrice: number) => {
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
    <div className="space-y-6">
      <p className="text-gray-600 mb-4">
        Choisissez le service qui correspond le mieux à vos besoins :
      </p>
      
      {/* Quick selection categories */}
      <div className="flex overflow-x-auto gap-3 pb-2">
        <button
          className={`flex items-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
            categoryFilter === null ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setCategoryFilter(null)}
        >
          Tous
        </button>
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              className={`flex items-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                categoryFilter === category.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setCategoryFilter(category.id)}
            >
              <Icon className="h-4 w-4 mr-2" />
              {category.name}
            </button>
          );
        })}
      </div>
      
      {/* Recently used services */}
      {recentServices.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Services récents</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recentServices.map((service) => (
              <button
                key={service.id}
                className={`flex items-center p-3 border rounded-lg ${
                  selectedService?.id === service.id 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                }`}
                onClick={() => onSelectService(service)}
              >
                <div className="mr-3 bg-blue-100 p-2 rounded-full">
                  {getServiceIcon(service)}
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">{service.name}</p>
                  <p className="text-sm text-gray-500">
                    {calculateEstimatedPrice(service.price).toFixed(2)}€
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* All services */}
      <div className="space-y-4">
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
            
            {selectedService?.id === service.id && (
              <div className="absolute inset-0 border-2 border-blue-600 rounded-lg pointer-events-none"></div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelection;
