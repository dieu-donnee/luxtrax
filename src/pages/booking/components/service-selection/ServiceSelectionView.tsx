
import React from "react";
import ServiceCategories from "./ServiceCategories";
import RecentServices from "./RecentServices";
import ServicesList from "./ServicesList";
import { getServiceIcon, calculateEstimatedPrice } from "./utils";
import type { Service } from "./types";
import { useAuth } from "@/contexts/AuthContext";

interface ServiceSelectionViewProps {
  services: Service[];
  recentServices: Service[];
  selectedService: Service | null;
  onSelectService: (service: Service) => void;
  categoryFilter: string | null;
  setCategoryFilter: (category: string | null) => void;
  loading: boolean;
  error: string | null;
}

const ServiceSelectionView: React.FC<ServiceSelectionViewProps> = ({
  services,
  recentServices,
  selectedService,
  onSelectService,
  categoryFilter,
  setCategoryFilter,
  loading,
  error
}) => {
  const { profile } = useAuth();
  
  // Wrapper functions that use the imported utility functions
  const getIconForService = (service: Service) => {
    return getServiceIcon(service);
  };

  const calculatePrice = (basePrice: number) => {
    return calculateEstimatedPrice(basePrice, profile?.vehicle_type || 'sedan');
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-600 mb-4">
        Choisissez le service qui correspond le mieux à vos besoins :
      </p>
      
      {/* Quick selection categories */}
      <ServiceCategories 
        categoryFilter={categoryFilter} 
        setCategoryFilter={setCategoryFilter}
      />
      
      {/* Recently used services */}
      <RecentServices
        recentServices={recentServices}
        selectedService={selectedService}
        onSelectService={onSelectService}
        getServiceIcon={getIconForService}
        calculateEstimatedPrice={calculatePrice}
      />
      
      {/* All services */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Tous les services</h3>
        <ServicesList
          services={services}
          selectedService={selectedService}
          onSelectService={onSelectService}
          loading={loading}
          error={error}
          getServiceIcon={getIconForService}
          calculateEstimatedPrice={calculatePrice}
        />
      </div>
    </div>
  );
};

export default ServiceSelectionView;
