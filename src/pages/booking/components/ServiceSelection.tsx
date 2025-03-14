
import { useState, useEffect } from "react";
import { useServices } from "./service-selection/hooks/useServices";
import ServiceSelectionView from "./service-selection/ServiceSelectionView";
import type { Service, ServiceSelectionProps } from "./service-selection/types";

const ServiceSelection = ({ selectedService, onSelectService }: ServiceSelectionProps) => {
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const { services, recentServices, loading, error } = useServices(categoryFilter);

  return (
    <ServiceSelectionView 
      services={services}
      recentServices={recentServices}
      selectedService={selectedService}
      onSelectService={onSelectService}
      categoryFilter={categoryFilter}
      setCategoryFilter={setCategoryFilter}
      loading={loading}
      error={error}
    />
  );
};

export default ServiceSelection;
