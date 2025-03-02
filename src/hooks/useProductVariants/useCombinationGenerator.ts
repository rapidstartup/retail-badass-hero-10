
import { Product } from "@/types";
import { VariantCombination } from "./types";

export function useCombinationGenerator(
  product: Product,
  variantTypes: Map<string, string[]>,
  combinations: VariantCombination[],
  setCombinations: React.Dispatch<React.SetStateAction<VariantCombination[]>>
) {
  // Generate all possible combinations of variant types and values
  const generateCombinations = () => {
    // If no variant types, return empty array
    if (variantTypes.size === 0) {
      setCombinations([]);
      return;
    }

    // Convert Map to array for easier processing
    const typesArray = Array.from(variantTypes.entries()).filter(
      ([_, values]) => values.length > 0
    );
    
    if (typesArray.length === 0) {
      setCombinations([]);
      return;
    }

    // Helper function to generate combinations recursively
    const generateHelper = (
      index: number,
      currentCombination: Record<string, string>
    ): Record<string, string>[] => {
      // Base case: we've assigned a value for each type
      if (index === typesArray.length) {
        return [{ ...currentCombination }];
      }

      const [type, values] = typesArray[index];
      const result: Record<string, string>[] = [];

      // For each possible value of the current type
      for (const value of values) {
        // Add this value to the current combination
        const newCombination = {
          ...currentCombination,
          [type]: value,
        };

        // Recursively generate combinations for the remaining types
        const subCombinations = generateHelper(index + 1, newCombination);
        result.push(...subCombinations);
      }

      return result;
    };

    // Start the recursion with an empty combination
    const attributeCombinations = generateHelper(0, {});

    // Generate a SKU prefix based on the product name
    const skuPrefix = product.sku || 
      product.name.split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('')
        .substring(0, 3);

    // Map attribute combinations to full variant combinations
    const newCombinations = attributeCombinations.map((attributes) => {
      // Generate a SKU based on the attributes
      const attributeParts = Object.values(attributes)
        .map(val => val.substring(0, 3).toUpperCase())
        .join('-');
      
      const sku = `${skuPrefix}-${attributeParts}`;

      // Check if this combination already exists
      const existingCombination = combinations.find(comb => {
        return Object.entries(attributes).every(([key, value]) => 
          comb.attributes[key] === value
        );
      });

      // Either use existing data or create new
      return existingCombination || {
        attributes,
        sku,
        price: product.price,
        stock_count: 0,
        product_id: product.id
      };
    });

    setCombinations(newCombinations);
  };

  return { generateCombinations };
}
