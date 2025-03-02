
import { useState, useCallback } from 'react';
import { VariantType, VariantCombination } from './types';

export const useCombinationGenerator = (
  variantTypes: VariantType[],
  currentCombinations: VariantCombination[],
  setCombinations: React.Dispatch<React.SetStateAction<VariantCombination[]>>,
  productId: string,
  basePrice: number
) => {
  const generateCombinations = useCallback(() => {
    if (variantTypes.length === 0) {
      return;
    }

    // Create all possible combinations
    const generateCombinationsRecursive = (
      current: Record<string, string>,
      typeIndex: number
    ): Record<string, string>[] => {
      if (typeIndex >= variantTypes.length) {
        return [current];
      }

      const type = variantTypes[typeIndex];
      const results: Record<string, string>[] = [];

      for (const value of type.values) {
        const newCurrent = { ...current, [type.name]: value };
        results.push(...generateCombinationsRecursive(newCurrent, typeIndex + 1));
      }

      return results;
    };

    const attributeCombinations = generateCombinationsRecursive({}, 0);

    // Generate an SKU prefix from product ID or name
    const skuPrefix = productId.substring(0, 3).toUpperCase();

    // Convert attribute combinations to variant combinations
    const newCombinations: VariantCombination[] = attributeCombinations.map((attributes, index) => {
      // Check if we already have this combination
      const existingIndex = currentCombinations.findIndex(combination => {
        return Object.entries(attributes).every(([key, value]) => 
          combination.attributes[key] === value
        );
      });

      if (existingIndex !== -1) {
        // Use existing values
        return currentCombinations[existingIndex];
      }

      // Generate a new sku
      const sku = `${skuPrefix}-${Object.values(attributes).join('-')}`;
      
      return {
        product_id: productId,
        sku,
        price: basePrice,
        stock_count: 0,
        color: attributes.color,
        size: attributes.size,
        flavor: attributes.flavor,
        attributes
      };
    });

    setCombinations(newCombinations);
  }, [variantTypes, currentCombinations, setCombinations, productId, basePrice]);

  return {
    generateCombinations
  };
};
