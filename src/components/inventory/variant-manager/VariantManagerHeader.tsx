
import React from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
    </DialogHeader>
  );
};

export default VariantManagerHeader;
