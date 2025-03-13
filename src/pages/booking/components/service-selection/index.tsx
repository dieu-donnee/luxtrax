
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ServiceCategories from "./ServiceCategories";
import RecentServices from "./RecentServices";
import ServicesList from "./ServicesList";
import { getServiceIcon, calculateEstimatedPrice, enhanceServices } from "./utils";
import type { Service, ServiceSelectionProps } from "./types";
import type { Database } from "@/integrations/supabase/types";

// Define the correct type for service_type
type ServiceType = Database["public"]["Enums"]["service_type"];

const ServiceSelection = ({ selectedService, onSelectService }: ServiceSelectionProps) => {
  const { profile } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentServices, setRecentServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        let query = supabase
          .from('services')
          .select('*');
          
        if (categoryFilter) {
          // Map UI category to database service type
          let serviceType: ServiceType | null = null;
          
          if (categoryFilter === 'standard') {
            serviceType = 'carwash';
          } else if (categoryFilter === 'premium') {
            serviceType = 'laundry';
          }
          
          if (serviceType) {
            query = query.eq('type', serviceType);
          }
        }
        
        const { data, error } = await query.order('price', { ascending: true });

        if (error) {
          throw error;
        }

        // Enhance services with additional properties
        const enhancedServices = enhanceServices(data);

        setServices(enhancedServices);
        
        // Set recently used services
        if (enhancedServices.length > 0) {
          const recent = enhancedServices.filter(service => service.is_popular).slice(0, 2);
          setRecentServices(recent);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        setError('Impossible de charger les services. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [categoryFilter]);

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
  );
};

export default ServiceSelection;
