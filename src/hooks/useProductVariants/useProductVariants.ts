
import { useState, useEffect } from "react";
import { Product, ProductVariant } from "@/types";
import { useVariantFetching } from "./useVariantFetching";
import { useCombinationGenerator } from "./useCombinationGenerator";
import { useVariantOperations } from "./useVariantOperations";
import { VariantType, VariantCombination } from "./types";

export interface UseProductVariantsReturn {
  variants: ProductVariant[];
  variantTypes: VariantType[];
  combinations: VariantCombination[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  fetchVariants: () => Promise<void>;
  setVariantTypes: React.Dispatch<React.SetStateAction<VariantType[]>>;
  setCombinations: React.Dispatch<React.SetStateAction<VariantCombination[]>>;
  updateCombination: (index: number, updates: Partial<VariantCombination>) => void;
  deleteCombination: (index: number) => void;
  saveVariants: () => Promise<boolean>;
  generateCombinations: () => void;
}

export function useProductVariants(
  product: Product,
  onProductUpdated?: () => void
): UseProductVariantsReturn {
  const [variantTypes, setVariantTypes] = useState<VariantType[]>([]);
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
