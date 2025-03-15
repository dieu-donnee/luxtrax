
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ServiceFeatures from "./ServiceFeatures";
import ServiceTags from "./ServiceTags";
import ServicePrice from "./ServicePrice";
import type { Service } from "../types";

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onSelect: () => void;
  getServiceIcon: (service: Service) => JSX.Element;
  calculateEstimatedPrice: (basePrice: number) => number;
}

const ServiceCard = ({ 
  service, 
  isSelected, 
  onSelect,
  getServiceIcon,
  calculateEstimatedPrice 
}: ServiceCardProps) => {
  return (
    <Card 
      className={`relative cursor-pointer transition-all hover:border-blue-400 hover:shadow-md ${
        isSelected 
          ? 'border-2 border-blue-600 shadow-md' 
          : 'border-gray-200'
      }`}
      onClick={onSelect}
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
        <ServiceFeatures 
          service={service} 
          onSelectService={(selectedService) => {
            // If the table inside has its own select function
            if (selectedService && selectedService !== service) {
              // Handle selection of a different service from the table
              onSelect();
            }
          }}
          currentService={service}
        />
        <ServiceTags service={service} />
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex justify-between items-center">
        <span className="text-lg font-bold text-blue-600">
          <ServicePrice service={service} calculateEstimatedPrice={calculateEstimatedPrice} />
        </span>
        
        <div className={`w-5 h-5 rounded-full border-2 ${
          isSelected 
            ? 'border-blue-600 bg-blue-600' 
            : 'border-gray-300'
        }`}>
          {isSelected && (
            <div className="flex items-center justify-center h-full">
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
