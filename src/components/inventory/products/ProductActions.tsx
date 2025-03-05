
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
          e.preventDefault();
          e.stopPropagation();
          handleAddProduct(e);
        }}
        className="flex items-center gap-1"
        type="button"
      >
        <Plus className="h-4 w-4" />
        Add Product
      </Button>
      <Button 
        variant="outline" 
        onClick={(e) => {
          e.preventDefault();
          refreshProducts();
        }} 
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
