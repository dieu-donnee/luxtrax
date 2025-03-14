
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { enhanceServices, lustraxServicePlans } from "../utils";
import type { Service } from "../types";
import type { Database } from "@/integrations/supabase/types";

// Define the correct type for service_type
type ServiceType = Database["public"]["Enums"]["service_type"];

export const useServices = (categoryFilter: string | null) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentServices, setRecentServices] = useState<Service[]>([]);
  const [servicesUpdated, setServicesUpdated] = useState(false);

  // Check and update services if needed
  useEffect(() => {
    const checkAndUpdateServices = async () => {
      try {
        // First check if we have all the LustraX plans in the database
        const { data: existingServices, error: fetchError } = await supabase
          .from('services')
          .select('*')
          .in('name', lustraxServicePlans.map(plan => plan.name));

        if (fetchError) throw fetchError;

        // If we don't have all four plans, insert the missing ones
        if (!existingServices || existingServices.length < lustraxServicePlans.length) {
          const existingNames = existingServices?.map(s => s.name) || [];
          const missingPlans = lustraxServicePlans.filter(plan => !existingNames.includes(plan.name));

          // Insert missing plans
          for (const plan of missingPlans) {
            const { error: insertError } = await supabase
              .from('services')
              .insert({
                name: plan.name,
                description: plan.description,
                details: JSON.stringify({
                  features: JSON.parse(plan.details),
                  monthlyPrice: plan.monthly.price,
                  monthlyDetails: plan.monthly.details
                }),
                price: plan.price,
                type: plan.type as ServiceType,
                is_vip: plan.is_vip
              });

            if (insertError) {
              console.error('Error inserting service plan:', insertError);
            }
          }

          // Update any existing plans to match current data
          for (const existingService of existingServices || []) {
            const matchingPlan = lustraxServicePlans.find(plan => plan.name === existingService.name);
            if (matchingPlan) {
              const { error: updateError } = await supabase
                .from('services')
                .update({
                  description: matchingPlan.description,
                  details: JSON.stringify({
                    features: JSON.parse(matchingPlan.details),
                    monthlyPrice: matchingPlan.monthly.price,
                    monthlyDetails: matchingPlan.monthly.details
                  }),
                  price: matchingPlan.price,
                  type: matchingPlan.type as ServiceType,
                  is_vip: matchingPlan.is_vip
                })
                .eq('id', existingService.id);

              if (updateError) {
                console.error('Error updating service plan:', updateError);
              }
            }
          }

          setServicesUpdated(true);
          toast({
            title: "Services mis à jour",
            description: "Les plans de service ont été mis à jour avec succès.",
          });
        }
      } catch (error) {
        console.error('Error checking/updating services:', error);
      }
    };

    checkAndUpdateServices();
  }, [toast]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        let query = supabase
          .from('services')
          .select('*');
          
        if (categoryFilter) {
          // Map UI category to database service type or other criteria
          if (categoryFilter === 'standard') {
            query = query.eq('type', 'carwash' as ServiceType)
                         .or(`name.ilike.%Standard%,details.ilike.%Standard%`);
          } else if (categoryFilter === 'premium') {
            query = query.or(`name.ilike.%Premium%,details.ilike.%Premium%`);
          } else if (categoryFilter === 'eco') {
            query = query.or(`name.ilike.%Écologique%,name.ilike.%Ecologique%,details.ilike.%Écologique%`);
          } else if (categoryFilter === 'special') {
            query = query.or(`name.ilike.%Spécial%,name.ilike.%Special%,details.ilike.%Spécial%`);
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

    // Fetch services when component loads or when category filter changes
    // or after services have been updated
    fetchServices();
  }, [categoryFilter, servicesUpdated]);

  return {
    services,
    recentServices,
    loading,
    error
  };
};
