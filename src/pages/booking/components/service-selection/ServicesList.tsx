
import { Skeleton } from "@/components/ui/skeleton";
import ServiceCard from "./ServiceCard";
import type { Database } from "@/integrations/supabase/types";

type Service = Database["public"]["Tables"]["services"]["Row"] & {
  is_popular?: boolean;
  category?: string;
  estimated_duration?: number;
};

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
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="relative cursor-not-allowed overflow-hidden">
            <div className="space-y-2">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div>
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4 text-center">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          isSelected={selectedService?.id === service.id}
          onSelect={onSelectService}
          getServiceIcon={getServiceIcon}
          calculateEstimatedPrice={calculateEstimatedPrice}
        />
      ))}
    </div>
  );
};

export default ServicesList;
