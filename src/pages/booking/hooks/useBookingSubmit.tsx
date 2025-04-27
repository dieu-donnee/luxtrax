
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

      // Fetch the actual UUID for the selected service plan
      const { data: serviceData, error: serviceError } = await supabase
        .from("services")
        .select("id")
        .eq("name", selectedServiceId === "plan-complet" ? "Plan Complet" : "Plan Mensuel")
        .single();

      if (serviceError || !serviceData) {
        throw new Error("Service non trouvé");
      }

      // Use the actual UUID from the services table
      const { error } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          scheduled_date: scheduledDate.toISOString(),
          address: selectedAddress,
          notes: notes || null,
          service_id: serviceData.id
        }) as any;

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
