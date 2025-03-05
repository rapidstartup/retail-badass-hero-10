
import React from "react";
import { Package } from "lucide-react";
import ProductActions from "./ProductActions";

interface ProductHeaderProps {
  handleAddProduct: (e: React.MouseEvent<HTMLButtonElement>) => void;
  refreshProducts: () => void;
}

const ProductHeader = ({ handleAddProduct, refreshProducts }: ProductHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Package className="h-5 w-5" />
        <h2 className="text-xl font-bold">Products</h2>
      </div>
      <ProductActions 
        handleAddProduct={handleAddProduct} 
        refreshProducts={refreshProducts} 
      />
    </div>
  );
};

export default ProductHeader;
