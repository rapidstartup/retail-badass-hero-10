
import { useState, useEffect, useCallback } from 'react';
import { Product, ProductVariant } from '@/api/types/inventoryTypes';
import { useVariantFetching } from './useVariantFetching';
import { useVariantOperations } from './useVariantOperations';
import { useCombinationGenerator } from './useCombinationGenerator';
import { VariantType, VariantCombination, UseProductVariantsReturn } from './types';

export const useProductVariants = (
  product: Product, 
  onProductUpdated?: () => void
): UseProductVariantsReturn => {
  // Custom hooks for variant functionality
  const { variants, fetchVariants, loading } = useVariantFetching(product.id);
  const { saving, error, saveVariants: saveVariantsToDatabase } = useVariantOperations(product.id, onProductUpdated);
  
  // Local state for variant types and combinations
  const [variantTypes, setVariantTypes] = useState<VariantType[]>([]);
  const [combinations, setCombinations] = useState<VariantCombination[]>([]);

  // Generate combinations when variant types change
  const { generateCombinations: genCombinations } = useCombinationGenerator(
    variantTypes, 
    combinations,
    setCombinations, 
    product.id,
    product.price
  );

  // Initialize variantTypes from existing variants
  useEffect(() => {
    if (variants.length > 0) {
      // Extract unique colors, sizes, and flavors
      const uniqueColors = Array.from(new Set(variants.filter(v => v.color).map(v => v.color as string)));
      const uniqueSizes = Array.from(new Set(variants.filter(v => v.size).map(v => v.size as string)));
      const uniqueFlavors = Array.from(new Set(variants.filter(v => v.flavor).map(v => v.flavor as string)));
      
      const newVariantTypes: VariantType[] = [];
      
      if (uniqueColors.length > 0) {
        newVariantTypes.push({ name: 'color', values: uniqueColors });
      }
      
      if (uniqueSizes.length > 0) {
        newVariantTypes.push({ name: 'size', values: uniqueSizes });
      }
      
      if (uniqueFlavors.length > 0) {
        newVariantTypes.push({ name: 'flavor', values: uniqueFlavors });
      }
      
      setVariantTypes(newVariantTypes);
      
      // Convert variants to combinations
      const newCombinations = variants.map(variant => ({
        id: variant.id,
        product_id: variant.product_id,
        sku: variant.sku || '',
        price: variant.price || 0,
        stock_count: variant.stock_count || 0,
        color: variant.color || undefined,
        size: variant.size || undefined,
        flavor: variant.flavor || undefined,
        attributes: {
          ...(variant.color ? { color: variant.color } : {}),
          ...(variant.size ? { size: variant.size } : {}),
          ...(variant.flavor ? { flavor: variant.flavor } : {}),
          ...((variant.variant_attributes as Record<string, string>) || {})
        }
      }));
      
      setCombinations(newCombinations);
    }
  }, [variants]);

  // Update a single combination
  const updateCombination = (index: number, updates: Partial<VariantCombination>) => {
    setCombinations(prevCombinations => {
      const newCombinations = [...prevCombinations];
      newCombinations[index] = { ...newCombinations[index], ...updates };
      return newCombinations;
    });
  };

  // Delete a combination
  const deleteCombination = (index: number) => {
    setCombinations(prevCombinations => {
      const newCombinations = [...prevCombinations];
      newCombinations.splice(index, 1);
      return newCombinations;
    });
  };

  // Convert combinations back to variants and save
  const saveVariants = async (): Promise<boolean> => {
    const variantsToSave: Omit<ProductVariant, 'created_at' | 'updated_at'>[] = combinations.map(combination => ({
      id: combination.id || '',
      product_id: product.id,
      sku: combination.sku,
      price: combination.price,
      stock_count: combination.stock_count,
      color: combination.color || null,
      size: combination.size || null,
      flavor: combination.flavor || null,
      variant_attributes: Object.entries(combination.attributes).reduce((acc, [key, value]) => {
        if (!['color', 'size', 'flavor'].includes(key)) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>)
    }));

    return saveVariantsToDatabase(variantsToSave);
  };

  // Generate combinations based on current variant types
  const generateCombinations = () => {
    genCombinations();
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
