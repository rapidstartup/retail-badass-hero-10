
import { useState, useEffect } from "react";
import { Product, ProductVariant } from "@/types";
import { 
  fetchVariantsByProductId, 
  createVariant, 
  updateVariant, 
  deleteVariant,
  updateProduct
} from "@/api/inventoryApi";
import { toast } from "sonner";

interface VariantCombination {
  id?: string;
  attributes: Record<string, string>;
  sku: string;
  price: number;
  stock_count: number;
  product_id: string;
}

interface UseProductVariantsReturn {
  variants: ProductVariant[];
  variantTypes: Map<string, string[]>;
  combinations: VariantCombination[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  fetchVariants: () => Promise<void>;
  setVariantTypes: React.Dispatch<React.SetStateAction<Map<string, string[]>>>;
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
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [variantTypes, setVariantTypes] = useState<Map<string, string[]>>(new Map());
  const [combinations, setCombinations] = useState<VariantCombination[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing variants
  const fetchVariants = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchVariantsByProductId(product.id);
      setVariants(data);
      
      // Extract variant types and values from existing variants
      const typesMap = new Map<string, string[]>();
      
      data.forEach(variant => {
        if (variant.variant_attributes) {
          Object.entries(variant.variant_attributes).forEach(([key, value]) => {
            if (typeof value === 'string') {
              const existingValues = typesMap.get(key) || [];
              if (!existingValues.includes(value)) {
                typesMap.set(key, [...existingValues, value]);
              }
            }
          });
        }
      });
      
      setVariantTypes(typesMap);
      
      // If there are existing variants, also create combinations
      if (data.length > 0) {
        const existingCombinations = data.map(variant => ({
          id: variant.id,
          attributes: variant.variant_attributes as Record<string, string> || {},
          sku: variant.sku || '',
          price: variant.price || product.price,
          stock_count: variant.stock_count || 0,
          product_id: product.id
        }));
        
        setCombinations(existingCombinations);
      }
      
    } catch (err) {
      console.error("Error fetching variants:", err);
      setError("Failed to load existing variants. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Update a specific combination
  const updateCombination = (
    index: number,
    updates: Partial<VariantCombination>
  ) => {
    setCombinations(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        ...updates,
      };
      return updated;
    });
  };

  // Delete a combination
  const deleteCombination = (index: number) => {
    setCombinations(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

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

  // Save variants to the database
  const saveVariants = async (): Promise<boolean> => {
    if (combinations.length === 0) {
      setError("No variant combinations to save. Please add variants first.");
      return false;
    }

    setSaving(true);
    setError(null);
    let success = true;

    try {
      // First ensure product has_variants is set to true
      if (!product.has_variants) {
        await updateProduct(product.id, { has_variants: true });
        
        // Update local product if callback provided
        if (onProductUpdated) {
          onProductUpdated();
        }
      }

      // Create map of existing variants by their attribute signature for easy lookup
      const existingVariantsMap = new Map<string, string>();
      variants.forEach(variant => {
        const signature = JSON.stringify(variant.variant_attributes || {});
        existingVariantsMap.set(signature, variant.id);
      });

      // Track which existing variants have been processed
      const processedVariantIds = new Set<string>();

      // Process each combination
      for (const combination of combinations) {
        const attributesSignature = JSON.stringify(combination.attributes);
        const existingId = existingVariantsMap.get(attributesSignature);

        if (existingId) {
          // Update existing variant
          await updateVariant(existingId, {
            sku: combination.sku,
            price: combination.price,
            stock_count: combination.stock_count,
            variant_attributes: combination.attributes
          });
          processedVariantIds.add(existingId);
        } else {
          // Create new variant
          await createVariant({
            product_id: product.id,
            sku: combination.sku,
            price: combination.price,
            stock_count: combination.stock_count,
            variant_attributes: combination.attributes,
            // Extract color, size, and flavor from attributes if they exist
            color: combination.attributes.Color || combination.attributes.color || null,
            size: combination.attributes.Size || combination.attributes.size || null,
            flavor: combination.attributes.Flavor || combination.attributes.flavor || null
          });
        }
      }

      // Delete any variants that weren't in the combinations
      const variantsToDelete = variants
        .filter(v => !processedVariantIds.has(v.id))
        .map(v => v.id);
      
      for (const variantId of variantsToDelete) {
        await deleteVariant(variantId);
      }

      toast.success("Variants saved successfully");
      await fetchVariants(); // Refresh variants
    } catch (err) {
      console.error("Error saving variants:", err);
      toast.error("Failed to save variants");
      setError("Failed to save variants. Please try again.");
      success = false;
    } finally {
      setSaving(false);
    }

    return success;
  };

  // Generate combinations when variant types change
  useEffect(() => {
    generateCombinations();
  }, [variantTypes]);

  // Fetch variants when product changes
  useEffect(() => {
    fetchVariants();
  }, [product.id]);

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
