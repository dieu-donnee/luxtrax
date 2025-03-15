
import { Check, X } from "lucide-react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { Service } from "../types";

interface ServiceTableProps {
  services: Array<{
    name: string;
    features: Record<string, boolean | string | number>;
    price: number;
    duration?: number | string;
    cta?: string;
  }>;
  onSelectService?: (service: Service) => void;
  currentService?: Service;
}

const ServiceTable = ({ services, onSelectService, currentService }: ServiceTableProps) => {
  // Get all unique feature keys from all services
  const allFeatureKeys = Array.from(
    new Set(
      services.flatMap(service => 
        Object.keys(service.features).filter(key => 
          key !== 'price' && key !== 'duration' && key !== 'cta'
        )
      )
    )
  );

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Pack</TableHead>
            {services.map((service, index) => (
              <TableHead key={index} className="text-center">
                {service.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {allFeatureKeys.map(featureKey => (
            <TableRow key={featureKey}>
              <TableCell className="font-medium capitalize">
                {featureKey.replace(/_/g, ' ')}
              </TableCell>
              {services.map((service, index) => (
                <TableCell key={index} className="text-center">
                  {typeof service.features[featureKey] === 'boolean' ? (
                    service.features[featureKey] === true ? (
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    )
                  ) : (
                    <span>{service.features[featureKey]}</span>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}

          {/* Time row */}
          <TableRow>
            <TableCell className="font-medium">Temps d'intervention</TableCell>
            {services.map((service, index) => (
              <TableCell key={index} className="text-center">
                {service.duration || "-"}
              </TableCell>
            ))}
          </TableRow>

          {/* Price row */}
          <TableRow>
            <TableCell className="font-medium">Prix</TableCell>
            {services.map((service, index) => (
              <TableCell key={index} className="text-center font-bold">
                {typeof service.price === 'number' 
                  ? `${service.price.toLocaleString()} FCFA` 
                  : service.price}
              </TableCell>
            ))}
          </TableRow>

          {/* CTA Buttons */}
          <TableRow>
            <TableCell></TableCell>
            {services.map((service, index) => (
              <TableCell key={index} className="text-center">
                {onSelectService && (
                  <Button 
                    onClick={() => onSelectService(service as any)}
                    variant={currentService?.name === service.name ? "default" : "outline"}
                    className="w-full"
                  >
                    {service.cta || "Choisir ce pack"}
                  </Button>
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default ServiceTable;
