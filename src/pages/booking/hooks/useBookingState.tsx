
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Car, Calendar, MapPin, Check } from "lucide-react";
import type { Service } from "../components/service-selection/types";
import type { BookingStep, StepInfo } from "../types";

export const useBookingState = (currentStep: BookingStep) => {
  const { profile } = useAuth();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<string>(profile?.default_address || "");
  const [notes, setNotes] = useState<string>("");

  const steps: StepInfo[] = [
    { id: "service", label: "Service", icon: Car },
    { id: "datetime", label: "Date & Heure", icon: Calendar },
    { id: "address", label: "Adresse", icon: MapPin },
    { id: "summary", label: "Récapitulatif", icon: Check },
  ];

  const canProceed = () => {
    switch (currentStep) {
      case "service":
        return !!selectedService;
      case "datetime":
        return !!selectedDate && !!selectedTime;
      case "address":
        return !!selectedAddress;
      case "summary":
        return true;
      default:
        return false;
    }
  };

  return {
    selectedService,
    setSelectedService,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    selectedAddress,
    setSelectedAddress,
    notes,
    setNotes,
    steps,
    canProceed
  };
};
