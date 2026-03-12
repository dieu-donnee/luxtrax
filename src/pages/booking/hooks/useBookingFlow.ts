
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type BookingStep = 'welcome' | 'location' | 'service' | 'schedule' | 'summary';

export const useBookingFlow = () => {
    const [currentStep, setCurrentStep] = useState<BookingStep>('welcome');
    const [selection, setSelection] = useState({
        pickup: "",
        destination: "",
        serviceId: "",
        servicePrice: 0,
        date: undefined as Date | undefined,
        time: "",
        isRecurring: false,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const nextStep = useCallback(() => {
        const steps: BookingStep[] = ['welcome', 'location', 'service', 'schedule', 'summary'];
        const currentIndex = steps.indexOf(currentStep);
        if (currentIndex < steps.length - 1) {
            setCurrentStep(steps[currentIndex + 1]);
        }
    }, [currentStep]);

    const prevStep = useCallback(() => {
        const steps: BookingStep[] = ['welcome', 'location', 'service', 'schedule', 'summary'];
        const currentIndex = steps.indexOf(currentStep);
        if (currentIndex > 0) {
            setCurrentStep(steps[currentIndex - 1]);
        }
    }, [currentStep]);

    const updateSelection = useCallback((updates: Partial<typeof selection>) => {
        setSelection(prev => ({ ...prev, ...updates }));
    }, []);

    const submitBooking = useCallback(async () => {
        if (!user) {
            toast.error("Veuillez vous connecter pour réserver");
            return;
        }

        setIsSubmitting(true);
        try {
            // Logique de soumission (similaire à useBookingSubmit mais centralisée ici)
            // ... (À implémenter lors de l'intégration finale)
            toast.success("Réservation effectuée avec succès !");
            navigate("/");
        } catch (error) {
            console.error(error);
            toast.error("Une erreur est survenue");
        } finally {
            setIsSubmitting(false);
        }
    }, [user, selection, navigate]);

    return {
        currentStep,
        setCurrentStep,
        nextStep,
        prevStep,
        selection,
        updateSelection,
        submitBooking,
        isSubmitting
    };
};
