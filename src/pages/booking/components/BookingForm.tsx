
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import DateTimeSelection from "./DateTimeSelection";
import ServiceSelection from "./ServiceSelection";
import AddressSelection from "./AddressSelection";
import BookingSummary from "./BookingSummary";
import PaymentSelection from "./PaymentSelection";
import type { BookingStep, ServicePlan } from "../types";

interface BookingFormProps {
  currentStep: BookingStep;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  selectedAddress: string;
  setSelectedAddress: (address: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  selectedServiceId: string;
  setSelectedServiceId: (serviceId: string) => void;
  services: ServicePlan[];
  selectedService: ServicePlan | undefined;
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (method: string) => void;
  handlePrevious: () => void;
  handleNext: () => void;
  handleSubmit: () => Promise<void>;
  isSubmitting: boolean;
  canProceed: () => boolean;
}

const BookingForm = ({
  currentStep,
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
  handlePrevious,
  handleNext,
  handleSubmit,
  isSubmitting,
  canProceed
}: BookingFormProps) => {
  const title = currentStep === "datetime" ? "When?" :
    currentStep === "service" ? "What?" :
      currentStep === "address" ? "Where?" :
        currentStep === "summary" ? "Almost there" :
          "Select Payment";

  return (
    <>
      <Card className="bg-white border-none rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-700">
        <CardHeader className="p-8 pb-4">
          <CardTitle className="text-2xl font-black text-[#1A1A1A] tracking-tight">
            {title}
          </CardTitle>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.1em] mt-1">
            Step {currentStep === "datetime" ? "1" : currentStep === "service" ? "2" : currentStep === "address" ? "3" : currentStep === "summary" ? "4" : "5"} of 5
          </p>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <Tabs value={currentStep} className="w-full">
            <TabsContent value="datetime" className="mt-0 animate-in fade-in slide-in-from-right-4 duration-500">
              <DateTimeSelection
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onSelectDate={setSelectedDate}
                onSelectTime={setSelectedTime}
              />
            </TabsContent>
            <TabsContent value="service" className="mt-0 animate-in fade-in slide-in-from-right-4 duration-500">
              <ServiceSelection
                services={services}
                selectedServiceId={selectedServiceId}
                onSelectService={setSelectedServiceId}
              />
            </TabsContent>
            <TabsContent value="address" className="mt-0 animate-in fade-in slide-in-from-right-4 duration-500">
              <AddressSelection
                address={selectedAddress}
                notes={notes}
                onAddressChange={setSelectedAddress}
                onNotesChange={setNotes}
              />
            </TabsContent>
            <TabsContent value="summary" className="mt-0 animate-in fade-in slide-in-from-right-4 duration-500">
              <BookingSummary
                date={selectedDate}
                time={selectedTime}
                address={selectedAddress}
                notes={notes}
                selectedService={selectedService}
              />
            </TabsContent>
            <TabsContent value="payment" className="mt-0 animate-in fade-in slide-in-from-right-4 duration-500">
              <PaymentSelection
                selectedMethod={selectedPaymentMethod}
                onSelectMethod={setSelectedPaymentMethod}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="mt-10 flex gap-4">
        {currentStep !== "datetime" && (
          <Button
            onClick={handlePrevious}
            variant="ghost"
            className="h-14 w-14 rounded-2xl flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/5 transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}

        {currentStep === "payment" ? (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !canProceed()}
            className="flex-1 h-14 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
          >
            {isSubmitting ? "Processing..." : "Confirm & Pay"}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1 h-14 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] disabled:opacity-40 transition-all flex items-center justify-center gap-3"
          >
            {currentStep === "summary" ? "Go to Payment" : "Continue"} <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </>
  );
};

export default BookingForm;
