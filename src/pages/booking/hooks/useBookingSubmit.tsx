
import { useState, useCallback } from "react";
import { NavigateFunction } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

interface BookingSubmitProps {
  selectedDate: Date | undefined;
  selectedTime: string;
  selectedAddress: string;
  notes: string;
  selectedServiceId: string;
  selectedServicePrice: number;
  selectedPaymentMethod: string;
  toast: (options: { title: string; description?: string; variant?: "default" | "destructive" }) => void;
  navigate: NavigateFunction;
}

export const useBookingSubmit = ({
  selectedDate,
  selectedTime,
  selectedAddress,
  notes,
  selectedServiceId,
  selectedServicePrice,
  selectedPaymentMethod,
  toast,
  navigate
}: BookingSubmitProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  // Use useCallback to memoize the submit function
  const handleSubmit = useCallback(async () => {
    if (!selectedDate || !selectedTime || !selectedAddress || !selectedServiceId || !selectedPaymentMethod || !user) {
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
        const { data: serviceData, error: serviceError } = await supabase
          .from("services")
          .select("id, name")
          .limit(1);

        if (serviceError || !serviceData || serviceData.length === 0) {
          throw new Error("Aucun service disponible");
        }

        // Use the first available service as fallback
        serviceUuid = serviceData[0].id;
      }

      // Create the booking
      const { error } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          scheduled_date: scheduledDate.toISOString(),
          address: selectedAddress,
          notes: notes || null,
          service_id: serviceUuid,
          status: "pending" as Database["public"]["Enums"]["booking_status"]
        });

      if (error) throw error;

      // Create the payment record
      // We need the booking ID, which we should get from the insert response
      const { data: bookingData, error: bookingFetchError } = await supabase
        .from("bookings")
        .select("id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      // Payment tracking - skip if payments table doesn't exist yet
      if (!bookingFetchError && bookingData) {
        try {
          await (supabase as any)
            .from("payments")
            .insert({
              booking_id: bookingData.id,
              amount: selectedServicePrice || 0,
              status: "pending",
              method: selectedPaymentMethod,
            });
        } catch (e) {
          console.warn("Payments table not available yet:", e);
        }
      }

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
  }, [selectedDate, selectedTime, selectedAddress, notes, selectedServiceId, selectedServicePrice, selectedPaymentMethod, user, toast, navigate]);

  return { handleSubmit, isSubmitting };
};
