
import { Car, Sparkles, Leaf, SprayCan } from "lucide-react";

// Define service categories with icons
export const categories = [
  { id: 'standard', name: 'Standard', icon: Car },
  { id: 'premium', name: 'Premium', icon: Sparkles },
  { id: 'eco', name: 'Écologique', icon: Leaf },
  { id: 'special', name: 'Spécial', icon: SprayCan },
];

interface ServiceCategoriesProps {
  categoryFilter: string | null;
  setCategoryFilter: (category: string | null) => void;
}

const ServiceCategories = ({ 
  categoryFilter, 
  setCategoryFilter 
}: ServiceCategoriesProps) => {
  return (
    <div className="flex overflow-x-auto gap-3 pb-2">
      <button
        className={`flex items-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
          categoryFilter === null ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        onClick={() => setCategoryFilter(null)}
      >
        Tous
      </button>
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <button
            key={category.id}
            className={`flex items-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              categoryFilter === category.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setCategoryFilter(category.id)}
          >
            <Icon className="h-4 w-4 mr-2" />
            {category.name}
          </button>
        );
      })}
    </div>
  );
};

export default ServiceCategories;
