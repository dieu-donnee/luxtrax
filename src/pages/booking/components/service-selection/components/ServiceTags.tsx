
import type { Service } from "../types";

interface ServiceTagsProps {
  service: Service;
}

const ServiceTags = ({ service }: ServiceTagsProps) => {
  return (
    <div className="flex gap-2 flex-wrap mt-4">
      <div className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium ${
        service.type === 'carwash' 
          ? 'bg-blue-100 text-blue-800' 
          : 'bg-purple-100 text-purple-800'
      }`}>
        {service.type === 'carwash' ? 'Lavage Auto' : 'Nettoyage Intérieur'}
      </div>
      
      {service.is_popular && (
        <div className="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium bg-green-100 text-green-800">
          Populaire
        </div>
      )}
      
      {service.estimated_duration && (
        <div className="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800">
          {service.estimated_duration} min
        </div>
      )}
    </div>
  );
};

export default ServiceTags;
