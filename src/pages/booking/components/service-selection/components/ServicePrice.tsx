
import type { Service } from "../types";

interface ServicePriceProps {
  service: Service;
  calculateEstimatedPrice: (basePrice: number) => number;
}

const ServicePrice = ({ service, calculateEstimatedPrice }: ServicePriceProps) => {
  if (service.discount_percentage) {
    return (
      <div className="flex flex-col">
        <span className="text-sm line-through text-gray-400">
          {parseInt(service.price.toString()).toLocaleString()} FCFA
        </span>
        <span>
          {parseInt((calculateEstimatedPrice(service.price * (1 - service.discount_percentage / 100))).toString()).toLocaleString()} FCFA
        </span>
      </div>
    );
  }
  
  return (
    <span>
      {parseInt(calculateEstimatedPrice(service.price).toString()).toLocaleString()} FCFA
    </span>
  );
};

export default ServicePrice;
