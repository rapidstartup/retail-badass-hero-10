import { Product } from "@/types";
import { VariantType, VariantCombination } from "./types";

export function useCombinationGenerator(
  product: Product,
  variantTypes: VariantType[],
  combinations: VariantCombination[],
  setCombinations: React.Dispatch<React.SetStateAction<VariantCombination[]>>
) {
  // Generate all possible combinations of variant types and values
  const generateCombinations = () => {
    // If no variant types, return empty array
    if (variantTypes.length === 0) {
      setCombinations([]);
      return;
    }

    // Filter out any variant types with no values
    const typesArray = variantTypes.filter(
      (type) => type.values.length > 0
    );
    
    if (typesArray.length === 0) {
      setCombinations([]);
      return;
    }

    // Generate all possible combinations recursively
    const generateAttributeCombinations = (
      index: number,
      currentCombination: Record<string, string>
    ): Record<string, string>[] => {
      // Base case: we've processed all types
      if (index === typesArray.length) {
        return [{ ...currentCombination }];
      }

      const type = typesArray[index];
      const result: Record<string, string>[] = [];

      // For each possible value of the current type
      for (const value of type.values) {
        // Add this value to the current combination
        const newCombination = {
          ...currentCombination,
          [type.name]: value,
        };

        // Recursively generate combinations for the remaining types
        const combinations = generateAttributeCombinations(
          index + 1,
          newCombination
        );
        result.push(...combinations);
      }

      return result;
    };

    // Start the recursive combination generation
    const attributeCombinations = generateAttributeCombinations(0, {});

    // Convert attribute combinations to VariantCombination objects
    const newCombinations: VariantCombination[] = attributeCombinations.map(
      (attrs) => {
        // Try to find an existing combination with these attributes
        const existingCombination = combinations.find((c) => {
          return Object.entries(attrs).every(
            ([key, value]) => c.attributes[key] === value
          );
        });

        // If we found an existing combination, use its values
        if (existingCombination) {
          return { ...existingCombination };
        }

        // Otherwise, create a new combination
        return {
          product_id: product.id,
          sku: "", // This will be auto-generated later
          price: product.price,
          stock_count: 0,
          color: attrs["Color"] || attrs["color"],
          size: attrs["Size"] || attrs["size"],
          flavor: attrs["Flavor"] || attrs["flavor"],
          attributes: { ...attrs },
        };
      }
    );

    setCombinations(newCombinations);
  };

  return { generateCombinations };
}
