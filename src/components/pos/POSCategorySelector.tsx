
import React from "react";
import { Button } from "@/components/ui/button";

interface POSCategorySelectorProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const POSCategorySelector: React.FC<POSCategorySelectorProps> = ({
  categories,
  activeCategory,
  setActiveCategory
}) => {
  return (
    <div className="flex gap-2 mb-4 overflow-x-auto pb-2 sticky top-[48px] z-10 bg-background">
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "default" : "outline"}
          onClick={() => setActiveCategory(category)}
          className="whitespace-nowrap"
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default POSCategorySelector;
