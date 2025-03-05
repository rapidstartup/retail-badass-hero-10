
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

interface ProductActionsProps {
  handleAddProduct: (e: React.MouseEvent<HTMLButtonElement>) => void;
  refreshProducts: () => void;
}

const ProductActions = ({ handleAddProduct, refreshProducts }: ProductActionsProps) => {
  const handleAddClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Add Product button clicked");
    // Prevent any default navigation and event bubbling
    e.preventDefault();
    e.stopPropagation();
    // Call the provided handler
    handleAddProduct(e);
  };

  return (
    <div className="flex space-x-2">
      <Button 
        onClick={handleAddClick}
        className="flex items-center gap-1"
        type="button"
      >
        <Plus className="h-4 w-4" />
        Add Product
      </Button>
      <Button 
        variant="outline" 
        onClick={refreshProducts} 
        className="flex items-center gap-1"
        type="button"
      >
        <RefreshCw className="h-4 w-4" />
        Refresh
      </Button>
    </div>
  );
};

export default ProductActions;
