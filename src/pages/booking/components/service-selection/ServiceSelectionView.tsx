
import React from "react";
import type { Service } from "./types";
import { useAuth } from "@/contexts/AuthContext";
import { getServiceIcon, calculateEstimatedPrice } from "./utils";
import ServiceInstructions from "./components/ServiceInstructions";
import CategoriesSection from "./components/CategoriesSection";
import RecentServicesSection from "./components/RecentServicesSection";
import AllServicesSection from "./components/AllServicesSection";

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
      <ServiceInstructions />
      
      {/* Quick selection categories */}
      <CategoriesSection 
        categoryFilter={categoryFilter} 
        setCategoryFilter={setCategoryFilter}
      />
      
      {/* Recently used services */}
      <RecentServicesSection
        recentServices={recentServices}
        selectedService={selectedService}
        onSelectService={onSelectService}
        getServiceIcon={getIconForService}
        calculateEstimatedPrice={calculatePrice}
      />
      
      {/* All services */}
      <AllServicesSection
        services={services}
        selectedService={selectedService}
        onSelectService={onSelectService}
        loading={loading}
        error={error}
        getServiceIcon={getIconForService}
        calculateEstimatedPrice={calculatePrice}
      />
    </div>
  );
};

export default ServiceSelectionView;
