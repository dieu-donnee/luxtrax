
import React, { ReactElement } from "react";
import { categories } from "./ServiceCategories";
import type { Database } from "@/integrations/supabase/types";

type Service = Database["public"]["Tables"]["services"]["Row"] & {
  is_popular?: boolean;
  category?: string;
  estimated_duration?: number;
};

type VehicleType = Database["public"]["Enums"]["vehicle_type"] | string;

export const getServiceIcon = (service: Service): ReactElement => {
  const category = categories.find(c => c.id === service.category) || categories[0];
  const Icon = category.icon;
  return <Icon className="h-5 w-5" />;
};

export const calculateEstimatedPrice = (basePrice: number, vehicleType: VehicleType): number => {
  const multipliers: Record<string, number> = {
    sedan: 1,
    suv: 1.2,
    truck: 1.5,
    van: 1.3,
    motorcycle: 0.7,
    berline: 1,
    citadine: 0.9,
    utilitaire: 1.4,
    autre: 1.1
  };
  
  return basePrice * (multipliers[vehicleType] || 1);
};

export const enhanceServices = (services: Database["public"]["Tables"]["services"]["Row"][]): Service[] => {
  return services.map(service => ({
    ...service,
    category: service.type === 'carwash' ? 'standard' : 'premium',
    is_popular: service.is_vip || (service.discount_percentage || 0) > 0,
    estimated_duration: service.type === 'carwash' ? 30 : 60
  }));
};
