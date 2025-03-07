
import React from "react";
import { formatCurrency } from "@/utils/formatters";
import { ProductVariant } from "@/hooks/pos/types/cartTypes";

interface VariantDetailsProps {
  variant: ProductVariant;
}

const VariantDetails: React.FC<VariantDetailsProps> = ({ variant }) => {
  return (
    <div className="pt-4 space-y-2 border-t">
      <div className="flex justify-between">
        <span className="font-medium">Price:</span>
        <span>{formatCurrency(variant.price)}</span>
      </div>
      
      {variant.stock_count !== null && (
        <div className="flex justify-between">
          <span className="font-medium">Stock:</span>
          <span className={variant.stock_count <= 5 ? "text-red-500 font-medium" : ""}>
            {variant.stock_count} available
          </span>
        </div>
      )}
      
      {variant.sku && (
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>SKU:</span>
          <span>{variant.sku}</span>
        </div>
      )}
    </div>
  );
};

export default VariantDetails;
