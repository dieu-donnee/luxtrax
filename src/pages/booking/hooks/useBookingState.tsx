
import { useState, useCallback, useMemo } from "react";
import { Clock, CircleDollarSign, MapPin, ReceiptText } from "lucide-react";
import type { BookingStep, StepInfo, ServicePlan } from "../types";

export const useBookingState = (currentStep: BookingStep) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [selectedServiceId, setSelectedServiceId] = useState<string>("plan-complet");

  // Define service plans
  const services: ServicePlan[] = useMemo(() => [
    {
      id: "plan-complet",
      name: "Plan Complet",
      price: 2000,
      description: "Forfait complet pour un service unique."
    },
    {
      id: "plan-mensuel",
      name: "Plan Mensuel",
      price: 7000,
      description: "Forfait mensuel avec services illimités pendant 30 jours."
    }
  ], []);

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
