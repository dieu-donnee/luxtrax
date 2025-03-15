
import { Check } from "lucide-react";
import { ReactNode } from "react";
import type { Service } from "../types";

interface ServiceFeaturesProps {
  service: Service;
}

const ServiceFeatures = ({ service }: ServiceFeaturesProps) => {
  if (!service.details) return null;
  
  try {
    // Essayons de parser les détails comme JSON
    const details = JSON.parse(service.details);
    
    // Si details est un tableau, c'est une liste de caractéristiques
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
    
    // Si details a une propriété 'features', utilisons-la
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
          
          {/* Afficher les informations d'abonnement mensuel si disponibles */}
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
    
    // Si nous avons un autre format d'objet JSON, affichons-le comme texte
    return <p className="text-sm text-gray-600 mt-2">{JSON.stringify(details)}</p>;
    
  } catch (e) {
    // Si le parsing JSON échoue, afficher comme texte ordinaire
    return <p className="text-sm text-gray-600 mt-2">{service.details}</p>;
  }
};

export default ServiceFeatures;
