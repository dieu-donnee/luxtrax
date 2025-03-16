
import { useState } from "react";
import { NavigateFunction } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Service } from "../components/service-selection/types";

interface UseBookingSubmitProps {
  selectedService: Service | null;
  selectedDate: Date | undefined;
  selectedTime: string;
  selectedAddress: string;
  notes: string;
  toast: any;
  navigate: NavigateFunction;
}

export const useBookingSubmit = ({
  selectedService,
  selectedDate,
  selectedTime,
  selectedAddress,
  notes,
  toast,
  navigate
}: UseBookingSubmitProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user || !selectedService || !selectedDate || !selectedTime || !selectedAddress) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Format the date and time for the database
      const scheduledDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':').map(Number);
      scheduledDateTime.setHours(hours, minutes);

      const { data, error } = await supabase.from('bookings').insert({
        user_id: user.id,
        service_id: selectedService.id,
        scheduled_date: scheduledDateTime.toISOString(),
        address: selectedAddress,
        notes: notes,
        status: 'pending',
      }).select();

      if (error) {
        throw error;
      }

      toast({
        title: "Réservation confirmée !",
        description: "Votre réservation a été enregistrée avec succès",
      });

      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Erreur",
        description: "Un problème est survenu lors de la création de votre réservation",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
};
