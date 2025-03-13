
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ArrowRight, Calendar, Car, Check, MapPin } from "lucide-react";
import ServiceSelection from "./components/service-selection";
import DateTimeSelection from "./components/DateTimeSelection";
import AddressSelection from "./components/AddressSelection";
import BookingSummary from "./components/BookingSummary";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Service = Database["public"]["Tables"]["services"]["Row"];
type BookingStep = "service" | "datetime" | "address" | "summary";

const BookingPage = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<BookingStep>("service");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<string>(profile?.default_address || "");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps: { id: BookingStep; label: string; icon: React.ElementType }[] = [
    { id: "service", label: "Service", icon: Car },
    { id: "datetime", label: "Date & Heure", icon: Calendar },
    { id: "address", label: "Adresse", icon: MapPin },
    { id: "summary", label: "Récapitulatif", icon: Check },
  ];

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

  const canProceed = () => {
    switch (currentStep) {
      case "service":
        return !!selectedService;
      case "datetime":
        return !!selectedDate && !!selectedTime;
      case "address":
        return !!selectedAddress;
      case "summary":
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Réserver un service</h1>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="hidden sm:block">
            <nav className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div 
                  key={step.id} 
                  className={`flex flex-col items-center space-y-2 ${
                    currentStep === step.id ? "text-blue-600" : 
                    steps.findIndex(s => s.id === currentStep) > index ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep === step.id ? "bg-blue-100 border-2 border-blue-600" : 
                    steps.findIndex(s => s.id === currentStep) > index ? "bg-green-100 border-2 border-green-600" : "bg-gray-100"
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">{step.label}</span>
                </div>
              ))}
              <div className="absolute left-0 right-0 top-1/2 -mt-px h-0.5 bg-gray-200 -z-10"></div>
            </nav>
          </div>
          <div className="sm:hidden">
            <p className="text-sm font-medium text-blue-600">
              Étape {steps.findIndex(s => s.id === currentStep) + 1} sur {steps.length}: {steps.find(s => s.id === currentStep)?.label}
            </p>
          </div>
        </div>

        {/* Main content */}
        <Card className="shadow-xl border-0">
          <CardHeader className="border-b">
            <CardTitle>
              {steps.find((step) => step.id === currentStep)?.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={currentStep} className="w-full">
              <TabsContent value="service" className="mt-0">
                <ServiceSelection
                  selectedService={selectedService}
                  onSelectService={setSelectedService}
                />
              </TabsContent>
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
                  service={selectedService}
                  date={selectedDate}
                  time={selectedTime}
                  address={selectedAddress}
                  notes={notes}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Navigation buttons */}
        <div className="mt-8 flex justify-between">
          <Button 
            onClick={handlePrevious}
            disabled={currentStep === "service"}
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
      </div>
    </div>
  );
};

export default BookingPage;
