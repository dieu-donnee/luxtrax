
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

const serviceImages: Record<string, string> = {
  "std": "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=400&auto=format&fit=crop",
  "prm": "https://images.unsplash.com/photo-1601362840469-51e4d8d59085?q=80&w=400&auto=format&fit=crop",
  "int": "https://images.unsplash.com/photo-1507133366044-c99002c10223?q=80&w=400&auto=format&fit=crop"
};

const ServiceSelection = ({
  services,
  selectedServiceId,
  onSelectService
}: ServiceSelectionProps) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">
          Select Service
        </label>

        <RadioGroup
          value={selectedServiceId}
          onValueChange={onSelectService}
          className="space-y-4"
        >
          {services.map((service) => {
            const isSelected = selectedServiceId === service.id;
            return (
              <Label
                key={service.id}
                htmlFor={`service-${service.id}`}
                className="cursor-pointer block group"
              >
                <div className={cn(
                  "relative overflow-hidden transition-all duration-500 rounded-[2rem] border p-1",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-xl shadow-primary/10 scale-[1.02]"
                    : "border-gray-50 bg-white hover:border-gray-200"
                )}>
                  <div className="flex h-36">
                    <div className="w-1/3 relative overflow-hidden rounded-[1.8rem]">
                      <img
                        src={serviceImages[service.id] || "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=400"}
                        alt={service.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/5"></div>
                    </div>
                    <div className="flex-1 p-5 flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-black text-gray-900 leading-tight uppercase tracking-wide text-sm">{service.name}</h4>
                        <div className={cn(
                          "w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-500",
                          isSelected ? "bg-primary border-primary" : "border-gray-200"
                        )}>
                          {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        <RadioGroupItem
                          value={service.id}
                          id={`service-${service.id}`}
                          className="sr-only"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold line-clamp-2 leading-relaxed mb-4">{service.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2.5 py-1 rounded-full">
                          <Clock className="h-2.5 w-2.5" />
                          {service.duration || "45 min"}
                        </div>
                        <div className="text-lg font-black text-gray-900 tracking-tighter">
                          {service.price.toLocaleString('fr-FR')}F
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Label>
            );
          })}
        </RadioGroup>
      </div>
    </div>
  );
};

import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

export default ServiceSelection;
