
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ProductVariant } from '@/api/types/inventoryTypes';
import { VariantType, VariantCombination, UseProductVariantsReturn } from './types';
import { useCombinationGenerator } from './useCombinationGenerator';
import { useVariantFetching } from './useVariantFetching';
import { useVariantOperations } from './useVariantOperations';

export const useProductVariants = (productId: string, basePrice: number = 0): UseProductVariantsReturn => {
  const [variantTypes, setVariantTypes] = useState<VariantType[]>([]);
  const [combinations, setCombinations] = useState<VariantCombination[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use custom hooks
  const { variants, loading, fetchVariants } = useVariantFetching(productId);
  const { saveVariants } = useVariantOperations(productId, fetchVariants);
  const { generateCombinations } = useCombinationGenerator(
    productId, 
    basePrice, 
    variantTypes, 
    combinations, 
    setCombinations
  );

  // Update combination when a field changes
  const updateCombination = (index: number, updates: Partial<VariantCombination>) => {
    setCombinations(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
  };

  // Delete a combination
  const deleteCombination = (index: number) => {
    setCombinations(prev => prev.filter((_, i) => i !== index));
  };

  // Save all variants
  const saveAllVariants = async () => {
    setSaving(true);
    setError(null);
    try {
      const success = await saveVariants(combinations);
      if (success) {
        toast.success('Variants saved successfully');
        await fetchVariants();
        return true;
      } else {
        setError('Failed to save variants');
        toast.error('Failed to save variants');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast.error(`Error saving variants: ${errorMessage}`);
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (productId) {
      fetchVariants();
    }
  }, [productId]);

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
    saveVariants: saveAllVariants,
    generateCombinations,
  };
};
