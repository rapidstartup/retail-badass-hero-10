
import { useState } from "react";
import { ProductVariant } from "@/api/types/variantTypes";

export function useVariantForm(productId: string, initialPrice: number = 0) {
  const [showAddVariant, setShowAddVariant] = useState(false);
  const [mode, setMode] = useState<"single" | "bulk">("single");
  
  // New variant state
  const [newVariant, setNewVariant] = useState<ProductVariant>({
    id: '',
    product_id: productId,
    sku: "",
    price: initialPrice,
    stock_count: 0,
    color: "",
    size: "",
    flavor: "",
    variant_attributes: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  
  // Reset the form to initial state
  const resetForm = () => {
    setNewVariant({
      id: '',
      product_id: productId,
      sku: "",
      price: initialPrice,
      stock_count: 0,
      color: "",
      size: "",
      flavor: "",
      variant_attributes: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  };

  return {
    showAddVariant,
    setShowAddVariant,
    mode,
    setMode,
    newVariant,
    setNewVariant,
    resetForm
  };
}
