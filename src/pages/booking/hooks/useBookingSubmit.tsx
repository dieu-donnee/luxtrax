
import { useState, useCallback } from "react";
import { NavigateFunction } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface BookingSubmitProps {
  selectedDate: Date | undefined;
  selectedTime: string;
  selectedAddress: string;
  notes: string;
  selectedServiceId: string;
  toast: any;
  navigate: NavigateFunction;
}

export const useBookingSubmit = ({
  selectedDate,
  selectedTime,
  selectedAddress,
  notes,
  selectedServiceId,
  toast,
  navigate
}: BookingSubmitProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  // Use useCallback to memoize the submit function
  const handleSubmit = useCallback(async () => {
    if (!selectedDate || !selectedTime || !selectedAddress || !selectedServiceId || !user) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Combine date and time into a single Date object efficiently
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const scheduledDate = new Date(selectedDate);
      scheduledDate.setHours(hours, minutes);

      // Get the service UUID directly - no need to search by name since selectedServiceId is already a proper service ID
      let serviceUuid = selectedServiceId;
      
      // If selectedServiceId is still using the old plan names, map them to actual service IDs
      if (selectedServiceId === "plan-complet" || selectedServiceId === "plan-mensuel") {
        const { data: serviceData, error: serviceError } = await (supabase
          .from("services") as any)
          .select("id, name")
          .limit(1);

        if (serviceError || !serviceData || serviceData.length === 0) {
          throw new Error("Aucun service disponible");
        }
        
        // Use the first available service as fallback
        serviceUuid = serviceData[0].id;
      }

      // Create the booking
      const { error } = await (supabase
        .from("bookings") as any)
        .insert({
          user_id: user.id,
          scheduled_date: scheduledDate.toISOString(),
          address: selectedAddress,
          notes: notes || null,
          service_id: serviceUuid
        });

      if (error) throw error;

      toast({
        title: "Réservation confirmée",
        description: "Votre réservation a été enregistrée avec succès",
      });
      
      // Use replace to avoid adding to history stack for better navigation
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de votre réservation",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedDate, selectedTime, selectedAddress, notes, selectedServiceId, user, toast, navigate]);

  return { handleSubmit, isSubmitting };
};
