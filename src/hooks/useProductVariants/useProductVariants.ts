
import { useState, useEffect } from 'react';
import { Product, VariantType, VariantCombination, ProductVariant } from '@/types';
import { useVariantFetching } from './useVariantFetching';
import { useVariantOperations } from './useVariantOperations';
import { useCombinationGenerator } from './useCombinationGenerator';

/**
 * Custom hook for managing product variants
 */
export const useProductVariants = (product: Product | null) => {
  // Fix line 18: Pass all required arguments
  const { variants, loading, error, fetchVariants } = useVariantFetching(
    product?.id || '', 
    true,
    true, 
    1000, 
    0
  );
  
  const [variantTypes, setVariantTypes] = useState<VariantType[]>([]);
  const [combinations, setCombinations] = useState<VariantCombination[]>([]);
  const [saving, setSaving] = useState(false);

  // Set up operations
  const { saveVariants, updateVariant, deleteVariant } = useVariantOperations(
    product?.id || '',
    variants,
    setCombinations,
    setSaving
  );

  // Generator for creating combinations
  const { generateCombinations } = useCombinationGenerator(
    variantTypes,
    product?.id || '',
    product?.price || 0
  );

  // Update combination at specific index
  const updateCombination = (index: number, updates: Partial<VariantCombination>) => {
    setCombinations(prev => {
      const newCombinations = [...prev];
      newCombinations[index] = { ...newCombinations[index], ...updates };
      return newCombinations;
    });
  };

  // Delete combination at specific index
  const deleteCombination = (index: number) => {
    // Fix line 47: Call without arguments
    setCombinations(prev => prev.filter((_, i) => i !== index));
  };

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
};
