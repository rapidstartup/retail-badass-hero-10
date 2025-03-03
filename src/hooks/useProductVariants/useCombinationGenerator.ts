
import { Dispatch, SetStateAction } from 'react';
import { VariantType, VariantCombination } from './types';

export const useCombinationGenerator = (
  productId: string,
  basePrice: number,
  variantTypes: VariantType[],
  combinations: VariantCombination[],
  setCombinations: Dispatch<SetStateAction<VariantCombination[]>>
) => {
  // Generate all possible combinations of variant types
  const generateCombinations = () => {
    if (variantTypes.length === 0) return;

    // Helper function to generate cartesian product of arrays
    const cartesian = (...arrays: string[][]): string[][] => {
      return arrays.reduce<string[][]>(
        (acc, array) => 
          acc.flatMap(combo => array.map(item => [...combo, item])),
        [[]]
      );
    };

    // Extract all variant type values
    const variantValues = variantTypes.map(vt => vt.values);
    const variantNames = variantTypes.map(vt => vt.name);

    // Generate all combinations
    const allCombinations = cartesian(...variantValues);

    // Create VariantCombination objects for each combination
    const newCombinations: VariantCombination[] = allCombinations.map(combo => {
      // Create an attributes object from variant names and values
      const attributes: Record<string, string> = {};
      variantNames.forEach((name, index) => {
        attributes[name.toLowerCase()] = combo[index];
      });

      // Create a SKU from the product ID and first letters of each value
      const skuSuffix = combo
        .map(value => value.substring(0, 1).toUpperCase())
        .join('');
      const sku = `${productId.substring(0, 4)}-${skuSuffix}`;

      // Create a new variant combination
      return {
        product_id: productId,
        sku,
        price: basePrice,
        stock_count: 0,
        attributes,
      };
    });

    setCombinations(newCombinations);
  };

  return { generateCombinations };
};
