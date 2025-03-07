
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

interface ProductActionsProps {
  handleAddProduct: (e: React.MouseEvent<HTMLButtonElement>) => void;
  refreshProducts: () => void;
}

const ProductActions = ({ handleAddProduct, refreshProducts }: ProductActionsProps) => {
  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Add Product button clicked in ProductActions");
    
    // Call the handler with the event
    handleAddProduct(e);
  };

  const handleRefresh = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Refresh button clicked");
    refreshProducts();
  };

  return (
    <div className="flex space-x-2">
      <Button 
        onClick={handleAdd}
        className="flex items-center gap-1"
        type="button"
      >
        <Plus className="h-4 w-4" />
        Add Product
      </Button>
      <Button 
        variant="outline" 
        onClick={handleRefresh}
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
