
import { useState, useCallback, useMemo, useEffect } from "react";
import { Clock, CircleDollarSign, MapPin, ReceiptText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { BookingStep, StepInfo, ServicePlan } from "../types";

export const useBookingState = (currentStep: BookingStep) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [services, setServices] = useState<ServicePlan[]>([]);

  // Fetch services from database
  useEffect(() => {
    const fetchServices = async () => {
      const { data: servicesData, error } = await supabase
        .from("services")
        .select("id, name, price, description");

      if (error) {
        console.error("Error fetching services:", error);
        return;
      }

      if (servicesData && servicesData.length > 0) {
        const mappedServices: ServicePlan[] = servicesData.map(service => ({
          id: service.id,
          name: service.name,
          price: Number(service.price),
          description: service.description || ""
        }));

        setServices(mappedServices);
        // Set first service as default if none selected
        if (!selectedServiceId) {
          setSelectedServiceId(mappedServices[0].id);
        }
      }
    };

    fetchServices();
  }, [selectedServiceId]);

  // Get the selected service
  const selectedService = useMemo(() => {
    return services.find(service => service.id === selectedServiceId);
  }, [services, selectedServiceId]);

  // Define booking steps
  const steps: StepInfo[] = useMemo(() => [
    { id: "datetime", label: "Date et heure", icon: Clock },
    { id: "service", label: "Service", icon: CircleDollarSign },
    { id: "address", label: "Adresse", icon: MapPin },
    { id: "summary", label: "Récapitulatif", icon: ReceiptText }
  ], []);

  // Check if user can proceed to next step
  const canProceed = useCallback(() => {
    switch (currentStep) {
      case "datetime":
        return !!selectedDate && !!selectedTime;
      case "service":
        return !!selectedServiceId;
      case "address":
        return !!selectedAddress;
      case "summary":
        return true;
      default:
        return false;
    }
  }, [currentStep, selectedDate, selectedTime, selectedServiceId, selectedAddress]);

  return {
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    selectedAddress,
    setSelectedAddress,
    notes,
    setNotes,
    selectedServiceId,
    setSelectedServiceId,
    services,
    selectedService,
    steps,
    canProceed
  };
};
