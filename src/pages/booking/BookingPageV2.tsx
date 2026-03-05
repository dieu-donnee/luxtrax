
import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useBookingFlow, BookingStep } from "./hooks/useBookingFlow";
import HomeHero from "./v2/HomeHero";
import LocationSelectionV2 from "./v2/LocationSelectionV2";
import ServiceSelectionV2 from "./v2/ServiceSelectionV2";
import ScheduleBookingV2 from "./v2/ScheduleBookingV2";
import BookingSummaryV2 from "./v2/BookingSummaryV2";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const BookingPageV2 = () => {
    const {
        currentStep,
        nextStep,
        prevStep,
        selection,
        updateSelection,
        submitBooking,
        isSubmitting,
        setCurrentStep
    } = useBookingFlow();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const step = searchParams.get('step') as BookingStep;
        if (step && ['welcome', 'location', 'service', 'schedule', 'summary'].includes(step)) {
            setCurrentStep(step);
        }
    }, [searchParams, setCurrentStep]);

    const renderStep = () => {
        switch (currentStep) {
            case 'welcome':
                return <HomeHero onStart={nextStep} />;
            case 'location':
                return (
                    <LocationSelectionV2
                        pickup={selection.pickup}
                        destination={selection.destination}
                        onUpdate={updateSelection}
                        onNext={nextStep}
                    />
                );
            case 'service':
                return (
                    <ServiceSelectionV2
                        selectedId={selection.serviceId}
                        onSelect={(id, price) => {
                            updateSelection({ serviceId: id, servicePrice: price });
                            nextStep();
                        }}
                    />
                );
            case 'schedule':
                return (
                    <ScheduleBookingV2
                        date={selection.date}
                        time={selection.time}
                        isRecurring={selection.isRecurring}
                        onUpdate={updateSelection}
                        onNext={nextStep}
                    />
                );
            case 'summary':
                return (
                    <BookingSummaryV2
                        selection={selection}
                        onConfirm={submitBooking}
                        isSubmitting={isSubmitting}
                    />
                );
            default:
                return <HomeHero onStart={nextStep} />;
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Step Header / Progress */}
            {currentStep !== 'welcome' && (
                <div className="sticky top-16 lg:top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-border px-6 py-4 flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={prevStep}
                        className="rounded-xl flex items-center gap-2 text-muted-foreground font-bold uppercase tracking-widest text-[10px]"
                    >
                        <ChevronLeft size={16} /> Retour
                    </Button>

                    <div className="flex gap-2">
                        {['location', 'service', 'schedule', 'summary'].map((step, idx) => (
                            <div
                                key={step}
                                className={`h-1.5 w-12 rounded-full transition-all duration-500 ${['location', 'service', 'schedule', 'summary'].indexOf(currentStep) >= idx
                                    ? "bg-primary"
                                    : "bg-muted"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            )}

            <main className="max-w-7xl mx-auto py-8">
                {renderStep()}
            </main>
        </div>
    );
};

export default BookingPageV2;
