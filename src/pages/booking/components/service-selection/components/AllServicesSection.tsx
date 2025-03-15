
import React from "react";
import ServicesList from "../ServicesList";
import type { Service } from "../types";

interface AllServicesSectionProps {
  services: Service[];
  selectedService: Service | null;
  onSelectService: (service: Service) => void;
  loading: boolean;
  error: string | null;
  getServiceIcon: (service: Service) => JSX.Element;
  calculateEstimatedPrice: (basePrice: number) => number;
}

const AllServicesSection: React.FC<AllServicesSectionProps> = ({
  services,
  selectedService,
  onSelectService,
  loading,
  error,
  getServiceIcon,
  calculateEstimatedPrice
}) => {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-3">Tous les services</h3>
      <ServicesList
        services={services}
        selectedService={selectedService}
        onSelectService={onSelectService}
        loading={loading}
        error={error}
        getServiceIcon={getServiceIcon}
        calculateEstimatedPrice={calculateEstimatedPrice}
      />
    </div>
  );
};

export default AllServicesSection;
