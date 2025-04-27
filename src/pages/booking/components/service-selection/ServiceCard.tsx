
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ServicePlan } from "../../types";

interface ServiceCardProps {
  service: ServicePlan;
  isSelected: boolean;
  onSelect: () => void;
}

const ServiceCard = ({ service, isSelected, onSelect }: ServiceCardProps) => {
  return (
    <Card 
      className={`border-2 cursor-pointer transition-all ${
        isSelected 
          ? "border-blue-500 bg-blue-50" 
          : "border-gray-200 hover:border-blue-200"
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-lg">{service.name}</h4>
              <Badge className="bg-blue-600">
                {service.price.toLocaleString('fr-FR')}F
              </Badge>
            </div>
            <p className="text-gray-600 text-sm">{service.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
