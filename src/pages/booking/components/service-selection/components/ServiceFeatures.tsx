
import { Check } from "lucide-react";
import { ReactNode } from "react";
import type { Service } from "../types";
import ServiceTable from "./ServiceTable";

interface ServiceFeaturesProps {
  service: Service;
  onSelectService?: (service: Service) => void;
  currentService?: Service;
}

const ServiceFeatures = ({ service, onSelectService, currentService }: ServiceFeaturesProps) => {
  if (!service.details) return null;
  
  try {
    // Try to parse the details as JSON
    const details = JSON.parse(service.details);
    
    // Check if this is a comparison table format
    if (details.tableView && Array.isArray(details.services)) {
      return (
        <ServiceTable 
          services={details.services} 
          onSelectService={onSelectService}
          currentService={currentService}
        />
      );
    }
    
    // If details is an array, it's a list of features
    if (Array.isArray(details)) {
      return (
        <ul className="space-y-1 mt-2">
          {details.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      );
    }
    
    // If details has a property 'features', use it
    if (details.features && Array.isArray(details.features)) {
      return (
        <div>
          <ul className="space-y-1 mt-2">
            {details.features.map((feature: string, index: number) => (
              <li key={index} className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
          
          {/* Display monthly subscription information if available */}
          {details.monthlyPrice && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm font-medium text-blue-800">Forfait mensuel:</p>
              <p className="text-sm font-bold text-blue-600">
                {parseInt(details.monthlyPrice.toString()).toLocaleString()} FCFA 
                {details.monthlyDetails && (
                  <span className="text-xs ml-1 text-gray-600">
                    ({details.monthlyDetails})
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      );
    }
    
    // If we have another JSON object format, display it as formatted text
    return (
      <div className="mt-2">
        {Object.entries(details).map(([key, value], index) => (
          <div key={index} className="text-sm mb-1">
            <span className="font-medium text-gray-700">{key}: </span>
            <span className="text-gray-600">{typeof value === 'object' ? JSON.stringify(value) : value?.toString()}</span>
          </div>
        ))}
      </div>
    );
    
  } catch (e) {
    // If JSON parsing fails, display as ordinary text
    return <p className="text-sm text-gray-600 mt-2">{service.details}</p>;
  }
};

export default ServiceFeatures;
