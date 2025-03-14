
import { Check } from "lucide-react";
import { ReactNode } from "react";
import type { Service } from "../types";

interface ServiceFeaturesProps {
  service: Service;
}

const ServiceFeatures = ({ service }: ServiceFeaturesProps) => {
  if (!service.details) return null;
  
  try {
    const features = JSON.parse(service.details);
    if (Array.isArray(features)) {
      return (
        <ul className="space-y-1 mt-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      );
    }
    
    // Check for monthly subscription
    if (features.monthlyPrice) {
      return (
        <>
          <p className="text-sm text-gray-600 mt-2">{service.details}</p>
          {renderMonthlySubscription(features)}
        </>
      );
    }
  } catch (e) {
    // If not JSON, display as regular text
    return <p className="text-sm text-gray-600 mt-2">{service.details}</p>;
  }
  
  // Fallback if details is not an array or parse fails
  return <p className="text-sm text-gray-600 mt-2">{service.details}</p>;
};

// Helper function to render monthly subscription if available
const renderMonthlySubscription = (details: any): ReactNode => {
  if (!details.monthlyPrice) return null;
  
  return (
    <div className="mt-3 pt-3 border-t border-gray-200">
      <p className="text-sm font-medium text-blue-800">Forfait mensuel:</p>
      <p className="text-sm font-bold text-blue-600">
        {details.monthlyPrice.toLocaleString()} FCFA 
        <span className="text-xs ml-1 text-gray-600">
          ({details.monthlyDetails})
        </span>
      </p>
    </div>
  );
};

export default ServiceFeatures;
