
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Check } from "lucide-react";
import type { Service } from "./types";

interface ServicesListProps {
  services: Service[];
  selectedService: Service | null;
  onSelectService: (service: Service) => void;
  loading: boolean;
  error: string | null;
  getServiceIcon: (service: Service) => JSX.Element;
  calculateEstimatedPrice: (basePrice: number) => number;
}

const ServicesList = ({ 
  services, 
  selectedService, 
  onSelectService, 
  loading, 
  error,
  getServiceIcon,
  calculateEstimatedPrice 
}: ServicesListProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
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

  if (services.length === 0) {
    return (
      <div className="text-gray-500 p-4 text-center">
        Aucun service disponible dans cette catégorie
      </div>
    );
  }

  // Helper function to render feature list
  const renderFeatures = (service: Service) => {
    if (!service.details) return null;
    
    try {
      const features = JSON.parse(service.details);
      if (Array.isArray(features)) {
        return (
          <ul className="space-y-1 mt-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        );
      }
    } catch (e) {
      // If not JSON, display as regular text
      return <p className="text-sm text-gray-600 mt-2">{service.details}</p>;
    }
    
    // Fallback if details is not an array or parse fails
    return <p className="text-sm text-gray-600 mt-2">{service.details}</p>;
  };

  // Helper function to render monthly subscription if available
  const renderMonthlySubscription = (service: Service) => {
    if (!service.details) return null;
    
    try {
      const details = JSON.parse(service.details);
      if (details.monthlyPrice) {
        return (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm font-medium text-blue-800">Forfait mensuel:</p>
            <p className="text-sm font-bold text-blue-600">
              {details.monthlyPrice.toLocaleString()} FCFA 
              <span className="text-xs ml-1 text-gray-600">
                ({details.monthlyDetails})
              </span>
            </p>
          </div>
        );
      }
    } catch (e) {
      // Silently fail if not JSON or doesn't have monthly price
      return null;
    }
    
    return null;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
      {services.map((service) => (
        <Card 
          key={service.id} 
          className={`relative cursor-pointer transition-all hover:border-blue-400 hover:shadow-md ${
            selectedService?.id === service.id 
              ? 'border-2 border-blue-600 shadow-md' 
              : 'border-gray-200'
          }`}
          onClick={() => onSelectService(service)}
        >
          {service.is_vip && (
            <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs px-2 py-1 rounded-bl-md rounded-tr-md font-medium">
              PREMIUM
            </div>
          )}
          
          <CardHeader className="pb-2">
            <div className="flex items-center mb-2">
              <div className="mr-3 bg-blue-100 p-2 rounded-full">
                {getServiceIcon(service)}
              </div>
              <CardTitle className="text-xl">{service.name}</CardTitle>
            </div>
            <CardDescription>
              {service.description || "Description non disponible"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {renderFeatures(service)}
            {renderMonthlySubscription(service)}
            
            <div className="flex gap-2 flex-wrap mt-4">
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
          </CardContent>
          
          <CardFooter className="border-t pt-4 flex justify-between items-center">
            <span className="text-lg font-bold text-blue-600">
              {service.discount_percentage ? (
                <div className="flex flex-col">
                  <span className="text-sm line-through text-gray-400">
                    {parseInt(service.price.toString()).toLocaleString()} FCFA
                  </span>
                  <span>
                    {parseInt((calculateEstimatedPrice(service.price * (1 - service.discount_percentage / 100))).toString()).toLocaleString()} FCFA
                  </span>
                </div>
              ) : (
                `${parseInt(calculateEstimatedPrice(service.price).toString()).toLocaleString()} FCFA`
              )}
            </span>
            
            <div className={`w-5 h-5 rounded-full border-2 ${
              selectedService?.id === service.id 
                ? 'border-blue-600 bg-blue-600' 
                : 'border-gray-300'
            }`}>
              {selectedService?.id === service.id && (
                <div className="flex items-center justify-center h-full">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
              )}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ServicesList;
