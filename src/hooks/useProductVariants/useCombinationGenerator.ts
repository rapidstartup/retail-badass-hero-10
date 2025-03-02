
import { useState, useCallback } from 'react';
import { VariantType, VariantCombination } from './types';

export const useCombinationGenerator = (
  variantTypes: VariantType[],
  combinations: VariantCombination[],
  setCombinations: React.Dispatch<React.SetStateAction<VariantCombination[]>>,
  productId: string,
  basePrice: number
) => {
  const generateCombinations = useCallback(() => {
    if (variantTypes.length === 0) return;

    // Get arrays of all values for each variant type
    const valuesByCategoryName: Record<string, string[]> = {};
    variantTypes.forEach(variantType => {
      valuesByCategoryName[variantType.name] = variantType.values;
    });

    // Function to generate combinations recursively
    const generateVariantCombinations = (
      categories: string[],
      currentIndex: number,
      currentAttributes: Record<string, string> = {},
      results: Record<string, string>[] = []
    ): Record<string, string>[] => {
      if (currentIndex === categories.length) {
        results.push({ ...currentAttributes });
        return results;
      }

      const currentCategory = categories[currentIndex];
      const values = valuesByCategoryName[currentCategory] || [];

      if (values.length === 0) {
        return generateVariantCombinations(
          categories,
          currentIndex + 1,
          { ...currentAttributes },
          results
        );
      }

      for (const value of values) {
        generateVariantCombinations(
          categories,
          currentIndex + 1,
          { ...currentAttributes, [currentCategory]: value },
          results
        );
      }

      return results;
    };

    const categories = variantTypes.map(vt => vt.name);
    const attributeCombinations = generateVariantCombinations(categories, 0);

    // Filter out combinations that already exist (preserve existing data)
    const existingAttributeKeys = new Set(
      combinations.map(c => {
        const key = Object.entries(c.attributes)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([k, v]) => `${k}:${v}`)
          .join('|');
        return key;
      })
    );

    // Create new combinations for ones that don't exist yet
    const newCombinations = attributeCombinations
      .filter(attrs => {
        const key = Object.entries(attrs)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([k, v]) => `${k}:${v}`)
          .join('|');
        return !existingAttributeKeys.has(key);
      })
      .map(attrs => {
        // Generate an SKU based on the first letter of each attribute
        const skuSuffix = Object.entries(attrs)
          .map(([_, value]) => value.substring(0, 1).toUpperCase())
          .join('');

        return {
          product_id: productId,
          sku: `VAR-${skuSuffix}`,
          price: basePrice,
          stock_count: 0,
          color: attrs.color,
          size: attrs.size,
          flavor: attrs.flavor,
          attributes: attrs
        };
      });

    setCombinations(prev => [...prev, ...newCombinations]);
  }, [variantTypes, combinations, setCombinations, productId, basePrice]);

  return { generateCombinations };
};
