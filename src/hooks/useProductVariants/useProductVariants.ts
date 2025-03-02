
import { useState, useEffect } from "react";
import { Product, ProductVariant } from "@/types";
import { useVariantFetching } from "./useVariantFetching";
import { useCombinationGenerator } from "./useCombinationGenerator";
import { useVariantOperations } from "./useVariantOperations";
import { VariantCombination, UseProductVariantsReturn } from "./types";

export function useProductVariants(
  product: Product,
  onProductUpdated?: () => void
): UseProductVariantsReturn {
  const [variantTypes, setVariantTypes] = useState<Map<string, string[]>>(new Map());
  const [combinations, setCombinations] = useState<VariantCombination[]>([]);
  
  // Initialize the hooks
  const { 
    variants, 
    loading, 
    error, 
    fetchVariants, 
    setError 
  } = useVariantFetching(product, setVariantTypes, setCombinations);
  
  const { generateCombinations } = useCombinationGenerator(
    product, 
    variantTypes, 
    combinations, 
    setCombinations
  );
  
  const { 
    updateCombination, 
    deleteCombination, 
    saveVariants,
    saving
  } = useVariantOperations(
    product, 
    variants, 
    combinations,
    setCombinations,
    fetchVariants, 
    onProductUpdated
  );

  // Generate combinations when variant types change
  useEffect(() => {
    generateCombinations();
  }, [variantTypes]);

  return {
    variants,
    variantTypes,
    combinations,
    loading,
    saving,
    error,
    fetchVariants,
    setVariantTypes,
    setCombinations,
    updateCombination,
    deleteCombination,
    saveVariants,
    generateCombinations
  };
}
