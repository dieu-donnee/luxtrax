
import { useState, useCallback, useMemo } from "react";
import { Clock, MapPin, ReceiptText } from "lucide-react";
import type { BookingStep, StepInfo } from "../types";

export const useBookingState = (currentStep: BookingStep) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // Define booking steps
  const steps: StepInfo[] = useMemo(() => [
    { id: "datetime", label: "Date et heure", icon: Clock },
    { id: "address", label: "Adresse", icon: MapPin },
    { id: "summary", label: "Récapitulatif", icon: ReceiptText }
  ], []);

  // Check if user can proceed to next step
  const canProceed = useCallback(() => {
    switch (currentStep) {
      case "datetime":
        return !!selectedDate && !!selectedTime;
      case "address":
        return !!selectedAddress;
      case "summary":
        return true;
      default:
        return false;
    }
  }, [currentStep, selectedDate, selectedTime, selectedAddress]);

  return {
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
