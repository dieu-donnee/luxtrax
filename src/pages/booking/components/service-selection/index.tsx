
import { useState } from "react";
import { useServices } from "./hooks/useServices";
import ServiceSelectionView from "./ServiceSelectionView";
import type { Service, ServiceSelectionProps } from "./types";

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
