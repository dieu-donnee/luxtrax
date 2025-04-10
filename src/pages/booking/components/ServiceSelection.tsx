
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CircleDollarSign } from "lucide-react";
import type { ServicePlan } from "../types";

interface ServiceSelectionProps {
  services: ServicePlan[];
  selectedServiceId: string;
  onSelectService: (serviceId: string) => void;
}

const ServiceSelection = ({ 
  services, 
  selectedServiceId, 
  onSelectService 
}: ServiceSelectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Choisissez votre plan de service</h3>
      <p className="text-sm text-gray-600 mb-4">
        Sélectionnez le forfait qui convient le mieux à vos besoins.
      </p>

      <RadioGroup 
        value={selectedServiceId} 
        onValueChange={onSelectService}
        className="space-y-4"
      >
        {services.map((service) => (
          <div key={service.id} className="rounded-lg overflow-hidden">
            <Label
              htmlFor={`service-${service.id}`}
              className="cursor-pointer block"
            >
              <Card className={`border-2 transition-all ${
                selectedServiceId === service.id 
                  ? "border-blue-600 bg-blue-50/50" 
                  : "border-gray-200 hover:border-blue-200"
              }`}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-lg">{service.name}</h4>
                      <Badge className="bg-blue-600">
                        {service.price.toLocaleString('fr-FR')}F
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm">{service.description}</p>
                  </div>
                  <div className="flex items-center justify-center h-6 w-6">
                    <RadioGroupItem 
                      value={service.id} 
                      id={`service-${service.id}`}
                      className="h-5 w-5"
                    />
                  </div>
                </CardContent>
              </Card>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default ServiceSelection;
