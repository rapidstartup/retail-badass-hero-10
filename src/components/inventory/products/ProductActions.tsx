
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

interface ProductActionsProps {
  handleAddProduct: (e: React.MouseEvent<HTMLButtonElement>) => void;
  refreshProducts: () => void;
}

const ProductActions = ({ handleAddProduct, refreshProducts }: ProductActionsProps) => {
  return (
    <div className="flex space-x-2">
      <Button 
        onClick={(e) => {
          console.log("Add Product button clicked");
          e.preventDefault(); // Prevent any default navigation
          e.stopPropagation(); // Stop event propagation
          handleAddProduct(e);
        }} 
        className="flex items-center gap-1"
      >
        <Plus className="h-4 w-4" />
        Add Product
      </Button>
      <Button variant="outline" onClick={refreshProducts} className="flex items-center gap-1">
        <RefreshCw className="h-4 w-4" />
        Refresh
      </Button>
    </div>
  );
};

export default ProductActions;
