import React, { ReactElement } from "react";
import { categories } from "./ServiceCategories";
import { Car, Sparkles, Leaf, SprayCan } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Service = Database["public"]["Tables"]["services"]["Row"] & {
  is_popular?: boolean;
  category?: string;
  estimated_duration?: number;
};

type VehicleType = Database["public"]["Enums"]["vehicle_type"] | string;

// Updated service categories with icons
export const serviceCategories = [
  { id: 'standard', name: 'Standard', icon: Car },
  { id: 'premium', name: 'Premium', icon: Sparkles },
  { id: 'eco', name: 'Écologique', icon: Leaf },
  { id: 'special', name: 'Spécial', icon: SprayCan },
];

export const getServiceIcon = (service: Service): ReactElement => {
  // First try to match with the category property
  if (service.category) {
    const category = serviceCategories.find(c => c.id === service.category.toLowerCase());
    if (category) {
      const Icon = category.icon;
      return <Icon className="h-5 w-5" />;
    }
  }
  
  // Then try to match with the name
  const serviceName = service.name.toLowerCase();
  if (serviceName.includes('standard')) return <Car className="h-5 w-5" />;
  if (serviceName.includes('premium')) return <Sparkles className="h-5 w-5" />;
  if (serviceName.includes('écologique') || serviceName.includes('ecologique')) return <Leaf className="h-5 w-5" />;
  if (serviceName.includes('spécial') || serviceName.includes('special')) return <SprayCan className="h-5 w-5" />;
  
  // Default icon based on service type
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
  return services.map(service => {
    // Determine the category based on service name or type
    let category;
    const serviceName = service.name.toLowerCase();
    
    if (serviceName.includes('standard')) {
      category = 'standard';
    } else if (serviceName.includes('premium')) {
      category = 'premium';
    } else if (serviceName.includes('écologique') || serviceName.includes('ecologique')) {
      category = 'eco';
    } else if (serviceName.includes('spécial') || serviceName.includes('special')) {
      category = 'special';
    } else {
      // Default behavior as before
      category = service.type === 'carwash' ? 'standard' : 'premium';
    }

    // Determine duration based on service type and category
    let duration;
    if (category === 'standard') {
      duration = 30;
    } else if (category === 'premium') {
      duration = 60;
    } else if (category === 'eco') {
      duration = 45;
    } else if (category === 'special') {
      duration = 90;
    } else {
      duration = service.type === 'carwash' ? 30 : 60;
    }

    return {
      ...service,
      category,
      is_popular: service.is_vip || (service.discount_percentage || 0) > 0,
      estimated_duration: duration
    };
  });
};

// Helper function to create or update services in the database
export const lustraxServicePlans = [
  {
    name: "PLAN STANDARD",
    description: "Un lavage extérieur rapide et efficace pour une voiture propre en un rien de temps !",
    details: JSON.stringify([
      "Lavage extérieur complet",
      "Nettoyage des jantes",
      "Séchage à la microfibre",
      "Finitions éclatantes"
    ]),
    price: 19900,
    type: "carwash",
    is_vip: false,
    monthly: {
      price: 69900,
      details: "4 lavages/mois – Économisez 20% !"
    }
  },
  {
    name: "PLAN PREMIUM",
    description: "Une propreté impeccable, intérieur & extérieur, pour un confort optimal.",
    details: JSON.stringify([
      "Lavage extérieur complet",
      "Nettoyage intérieur (aspiration, vitres, plastiques)",
      "Protection carrosserie",
      "Désinfection des surfaces"
    ]),
    price: 32900,
    type: "laundry",
    is_vip: true,
    monthly: {
      price: 112900,
      details: "4 lavages/mois – Économisez 30% !"
    }
  },
  {
    name: "PLAN ÉCOLOGIQUE",
    description: "Un lavage sans eau avec des produits 100% écologiques.",
    details: JSON.stringify([
      "Nettoyage extérieur sans eau",
      "Brillance longue durée",
      "Aucun impact sur l'environnement",
      "Finitions haut de gamme"
    ]),
    price: 25900,
    type: "carwash",
    is_vip: false,
    monthly: {
      price: 89900,
      details: "4 lavages/mois – Respectez la planète en économisant 20% !"
    }
  },
  {
    name: "PLAN SPÉCIAL",
    description: "Le luxe absolu pour votre voiture avec un nettoyage en profondeur.",
    details: JSON.stringify([
      "Nettoyage intérieur et extérieur complet",
      "Traitement céramique express",
      "Shampoing des sièges & tapis",
      "Parfum exclusif"
    ]),
    price: 52900,
    type: "laundry",
    is_vip: true,
    monthly: {
      price: 169900,
      details: "4 lavages/mois – Un soin premium toute l'année !"
    }
  }
];
