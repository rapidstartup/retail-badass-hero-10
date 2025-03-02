
import { useState } from "react";
import { Product, ProductVariant } from "@/types";
import { VariantCombination } from "./types";
import { 
  createVariant, 
  updateVariant, 
  deleteVariant, 
  updateProduct 
} from "@/api/inventoryApi";
import { toast } from "sonner";

export function useVariantOperations(
  product: Product,
  variants: ProductVariant[],
  combinations: VariantCombination[],
  setCombinations: React.Dispatch<React.SetStateAction<VariantCombination[]>>,
  fetchVariants: () => Promise<void>,
  onProductUpdated?: () => void
) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const deleteCombination = (index: number) => {
    setCombinations(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

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
            variant_attributes: combination.attributes,
            color: combination.color || null,
            size: combination.size || null,
            flavor: combination.flavor || null
          });
          processedVariantIds.add(existingId);
        } else {
          // Create new variant with flavor included
          await createVariant({
            product_id: product.id,
            sku: combination.sku,
            price: combination.price,
            stock_count: combination.stock_count,
            variant_attributes: combination.attributes,
            // Extract color, size, and flavor from attributes if they exist
            color: combination.attributes.Color || combination.attributes.color || combination.color || null,
            size: combination.attributes.Size || combination.attributes.size || combination.size || null,
            flavor: combination.attributes.Flavor || combination.attributes.flavor || combination.flavor || null
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

  return {
    updateCombination,
    deleteCombination,
    saveVariants,
    saving,
    error,
    setError
  };
}
