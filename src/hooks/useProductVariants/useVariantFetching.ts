
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Product, ProductVariant } from "@/types";
import { fetchVariantsByProductId } from "@/api/inventoryApi";
import { VariantCombination, VariantType } from "./types";

export function useVariantFetching(
  product: Product,
  setVariantTypes: Dispatch<SetStateAction<VariantType[]>>,
  setCombinations: Dispatch<SetStateAction<VariantCombination[]>>
) {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVariants = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchVariantsByProductId(product.id);
      setVariants(data);
      
      // Extract variant types and values from existing variants
      const typesMap = new Map<string, Set<string>>();
      
      data.forEach(variant => {
        if (variant.variant_attributes) {
          Object.entries(variant.variant_attributes).forEach(([key, value]) => {
            if (typeof value === 'string') {
              if (!typesMap.has(key)) {
                typesMap.set(key, new Set<string>());
              }
              typesMap.get(key)?.add(value);
            }
          });
        }
      });
      
      // Convert Map to array of VariantType
      const variantTypeArray: VariantType[] = Array.from(typesMap.entries()).map(([name, valuesSet]) => ({
        name,
        values: Array.from(valuesSet)
      }));
      
      setVariantTypes(variantTypeArray);
      
      // If there are existing variants, also create combinations
      if (data.length > 0) {
        const existingCombinations = data.map(variant => ({
          id: variant.id,
          product_id: product.id,
          attributes: variant.variant_attributes as Record<string, string> || {},
          sku: variant.sku || '',
          price: variant.price || product.price,
          stock_count: variant.stock_count || 0,
          color: variant.color || undefined,
          size: variant.size || undefined,
          flavor: variant.flavor || undefined,
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

  useEffect(() => {
    fetchVariants();
  }, [product.id]);

  return {
    variants,
    loading,
    error,
    fetchVariants,
    setError
  };
}
