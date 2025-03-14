
import { ServiceCard, ServiceSkeleton } from "./components";
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
          <ServiceSkeleton key={i} />
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
      {services.map((service) => (
        <ServiceCard 
          key={service.id}
          service={service}
          isSelected={selectedService?.id === service.id}
          onSelect={() => onSelectService(service)}
          getServiceIcon={getServiceIcon}
          calculateEstimatedPrice={calculateEstimatedPrice}
        />
      ))}
    </div>
  );
};

export default ServicesList;
