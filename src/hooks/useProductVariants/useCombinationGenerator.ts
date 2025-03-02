
import { useState, useCallback } from 'react';
import { Product } from '@/api/types/inventoryTypes';
import { VariantType, VariantCombination } from './types';

export const useCombinationGenerator = (
  variantTypes: VariantType[],
  setCombinations: React.Dispatch<React.SetStateAction<VariantCombination[]>>,
  product: Product
) => {
  // Generate all combinations of variant values
  const generateCombinations = useCallback(() => {
    if (variantTypes.length === 0) {
      setCombinations([]);
      return;
    }

    // Function to generate attribute combinations recursively
    const generateAttributeCombinations = (
      variantTypeIndex: number, 
      currentAttributes: Record<string, string> = {}
    ): Record<string, string>[] => {
      // Base case: we've processed all variant types
      if (variantTypeIndex >= variantTypes.length) {
        return [currentAttributes];
      }

      const currentVariantType = variantTypes[variantTypeIndex];
      const { name, values } = currentVariantType;
      
      // Generate combinations for each value of the current variant type
      const allCombinations: Record<string, string>[] = [];
      
      for (const value of values) {
        const newAttributes = { ...currentAttributes, [name]: value };
        const nextCombinations = generateAttributeCombinations(variantTypeIndex + 1, newAttributes);
        allCombinations.push(...nextCombinations);
      }
      
      return allCombinations;
    };

    // Generate all attribute combinations
    const attributeCombinations = generateAttributeCombinations(0);
    
    // Create variant combinations with default values
    const skuPrefix = product.sku || 
      product.name.split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('')
        .substring(0, 3);
    
    const newCombinations: VariantCombination[] = attributeCombinations.map((attributes, index) => {
      // Generate a unique SKU
      const variantSuffix = Object.values(attributes).join('-');
      const sku = `${skuPrefix}-${variantSuffix}`;
      
      return {
        product_id: product.id,
        sku,
        price: product.price,
        stock_count: 0,
        color: attributes.color,
        size: attributes.size,
        flavor: attributes.flavor,
        attributes
      };
    });
    
    setCombinations(newCombinations);
  }, [variantTypes, setCombinations, product]);

  return { generateCombinations };
};
