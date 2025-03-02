
import { useState } from "react";
import { Product } from "@/types";
import { ProductVariant } from "@/api/inventoryApi";

export function useVariantForm(product: Product) {
  const [showAddVariant, setShowAddVariant] = useState(false);
  const [mode, setMode] = useState<"single" | "bulk">("single");
  
  // New variant state
  const [newVariant, setNewVariant] = useState<ProductVariant>({
    id: '',
    product_id: product.id,
    sku: "",
    color: "",
    size: "",
    price: product.price,
    stock_count: 0,
    variant_attributes: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  
  // Reset the form to initial state
  const resetForm = () => {
    setNewVariant({
      id: '',
      product_id: product.id,
      sku: "",
      color: "",
      size: "",
      price: product.price,
      stock_count: 0,
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
