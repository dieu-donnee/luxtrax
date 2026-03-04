
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import BookingLayout from "./components/BookingLayout";
import BookingSteps from "./components/BookingSteps";
import BookingForm from "./components/BookingForm";
import { useBookingState } from "./hooks/useBookingState";
import { useBookingSubmit } from "./hooks/useBookingSubmit";
import type { BookingStep } from "./types";

const BookingPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<BookingStep>("datetime");

  const {
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
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    steps,
    canProceed
  } = useBookingState(currentStep);

  const { handleSubmit, isSubmitting } = useBookingSubmit({
    selectedDate,
    selectedTime,
    selectedAddress,
    notes,
    selectedServiceId,
    selectedServicePrice: selectedService?.price || 0,
    selectedPaymentMethod,
    toast,
    navigate
  });

  const handleNext = () => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  return (
    <BookingLayout>
      <BookingSteps
        steps={steps}
        currentStep={currentStep}
      />

      <BookingForm
        currentStep={currentStep}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
        notes={notes}
        setNotes={setNotes}
        selectedServiceId={selectedServiceId}
        setSelectedServiceId={setSelectedServiceId}
        services={services}
        selectedService={selectedService}
        selectedPaymentMethod={selectedPaymentMethod}
        setSelectedPaymentMethod={setSelectedPaymentMethod}
        handlePrevious={handlePrevious}
        handleNext={handleNext}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        canProceed={canProceed}
      />
    </BookingLayout>
  );
};

export default BookingPage;
