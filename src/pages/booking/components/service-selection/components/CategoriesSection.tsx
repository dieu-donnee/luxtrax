
import React from "react";
import ServiceCategories from "../ServiceCategories";

interface CategoriesSectionProps {
  categoryFilter: string | null;
  setCategoryFilter: (category: string | null) => void;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ 
  categoryFilter, 
  setCategoryFilter 
}) => {
  return (
    <ServiceCategories 
      categoryFilter={categoryFilter} 
      setCategoryFilter={setCategoryFilter}
    />
  );
};

export default CategoriesSection;
