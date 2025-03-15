
import React from "react";
import RecentServices from "../RecentServices";
import type { Service } from "../types";

interface RecentServicesSectionProps {
  recentServices: Service[];
  selectedService: Service | null;
  onSelectService: (service: Service) => void;
  getServiceIcon: (service: Service) => JSX.Element;
  calculateEstimatedPrice: (basePrice: number) => number;
}

const RecentServicesSection: React.FC<RecentServicesSectionProps> = ({
  recentServices,
  selectedService,
  onSelectService,
  getServiceIcon,
  calculateEstimatedPrice
}) => {
  return (
    <RecentServices
      recentServices={recentServices}
      selectedService={selectedService}
      onSelectService={onSelectService}
      getServiceIcon={getServiceIcon}
      calculateEstimatedPrice={calculateEstimatedPrice}
    />
  );
};

export default RecentServicesSection;
