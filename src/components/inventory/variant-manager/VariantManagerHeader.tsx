
import React from "react";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Product } from "@/types";

interface VariantManagerHeaderProps {
  product: Product;
}

const VariantManagerHeader = ({ product }: VariantManagerHeaderProps) => {
  return (
    <DialogHeader>
      <DialogTitle>
        Variants for {product.name}
      </DialogTitle>
      <DialogDescription>
        Manage different product options like size, color, and other attributes
      </DialogDescription>
    </DialogHeader>
  );
};

export default VariantManagerHeader;
