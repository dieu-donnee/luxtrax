
import type { Database } from "@/integrations/supabase/types";

type Service = Database["public"]["Tables"]["services"]["Row"] & {
  is_popular?: boolean;
  category?: string;
  estimated_duration?: number;
};

interface RecentServicesProps {
  recentServices: Service[];
  selectedService: Service | null;
  onSelectService: (service: Service) => void;
  getServiceIcon: (service: Service) => JSX.Element;
  calculateEstimatedPrice: (basePrice: number) => number;
}

const RecentServices = ({ 
  recentServices, 
  selectedService, 
  onSelectService, 
  getServiceIcon, 
  calculateEstimatedPrice 
}: RecentServicesProps) => {
  if (recentServices.length === 0) {
    return null;
  }

  return (
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
  );
};

export default RecentServices;
