
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import DateTimeSelection from "./DateTimeSelection";
import AddressSelection from "./AddressSelection";
import BookingSummary from "./BookingSummary";
import type { BookingStep } from "../types";

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
  handlePrevious,
  handleNext,
  handleSubmit,
  isSubmitting,
  canProceed
}: BookingFormProps) => {
  return (
    <>
      <Card className="shadow-xl border-0">
        <CardHeader className="border-b">
          <CardTitle>
            {currentStep.charAt(0).toUpperCase() + currentStep.slice(1)}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={currentStep} className="w-full">
            <TabsContent value="datetime" className="mt-0">
              <DateTimeSelection
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onSelectDate={setSelectedDate}
                onSelectTime={setSelectedTime}
              />
            </TabsContent>
            <TabsContent value="address" className="mt-0">
              <AddressSelection
                address={selectedAddress}
                notes={notes}
                onAddressChange={setSelectedAddress}
                onNotesChange={setNotes}
              />
            </TabsContent>
            <TabsContent value="summary" className="mt-0">
              <BookingSummary
                date={selectedDate}
                time={selectedTime}
                address={selectedAddress}
                notes={notes}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="mt-8 flex justify-between">
        <Button 
          onClick={handlePrevious}
          disabled={currentStep === "datetime"}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Précédent
        </Button>

        {currentStep === "summary" ? (
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || !canProceed()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? "Envoi en cours..." : "Confirmer la réservation"} 
            {!isSubmitting && <Check className="h-4 w-4" />}
          </Button>
        ) : (
          <Button 
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            Suivant <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </>
  );
};

export default BookingForm;
