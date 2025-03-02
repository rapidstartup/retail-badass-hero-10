
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Product, ProductVariant } from "@/types";
import { VariantType, VariantCombination } from "./types";
import { toast } from "sonner";

export function useVariantFetching(
  product: Product,
  setVariantTypes: Dispatch<SetStateAction<VariantType[]>>,
  setCombinations: Dispatch<SetStateAction<VariantCombination[]>>
) {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVariants = async () => {
    if (!product || !product.id) {
      setVariants([]);
      setError("No product provided");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // This would be a real API call in production
      // const response = await fetch(`/api/products/${product.id}/variants`);
      // const data = await response.json();
      
      // For now, we'll simulate the API response
      const mockVariants = []; // Mock data would go here
      
      setVariants(mockVariants);

      // Extract variant types from the variants
      // In a real implementation, this would parse the returned variants
      const extractedTypes: VariantType[] = [];
      const typesMap = new Map<string, Set<string>>();

      // Populate the Map with values from variants
      for (const variant of mockVariants) {
        if (variant.variant_attributes) {
          for (const [key, value] of Object.entries(variant.variant_attributes)) {
            if (!typesMap.has(key)) {
              typesMap.set(key, new Set());
            }
            typesMap.get(key)?.add(value as string);
          }
        }
        
        // Handle special attributes (color, size, flavor)
        if (variant.color) {
          if (!typesMap.has('Color')) {
            typesMap.set('Color', new Set());
          }
          typesMap.get('Color')?.add(variant.color);
        }
        
        if (variant.size) {
          if (!typesMap.has('Size')) {
            typesMap.set('Size', new Set());
          }
          typesMap.get('Size')?.add(variant.size);
        }
        
        if (variant.flavor) {
          if (!typesMap.has('Flavor')) {
            typesMap.set('Flavor', new Set());
          }
          typesMap.get('Flavor')?.add(variant.flavor);
        }
      }

      // Convert the Map to an array of VariantType objects
      for (const [name, valuesSet] of typesMap.entries()) {
        extractedTypes.push({
          name,
          values: Array.from(valuesSet)
        });
      }

      setVariantTypes(extractedTypes);

      // Extract combinations from the variants
      const extractedCombinations = mockVariants.map(variant => {
        const attributes: Record<string, string> = { ...variant.variant_attributes as Record<string, string> };
        
        // Add color, size, flavor if they exist
        if (variant.color) attributes['Color'] = variant.color;
        if (variant.size) attributes['Size'] = variant.size;
        if (variant.flavor) attributes['Flavor'] = variant.flavor;
        
        return {
          id: variant.id,
          sku: variant.sku || '',
          price: variant.price || 0,
          stock_count: variant.stock_count || 0,
          product_id: variant.product_id,
          color: variant.color,
          size: variant.size,
          flavor: variant.flavor,
          attributes
        };
      });

      setCombinations(extractedCombinations);
    } catch (err) {
      console.error('Error fetching variants:', err);
      setError('Failed to load variants');
      toast.error('Failed to load variants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVariants();
  }, [product?.id]);

  return {
    variants,
    loading,
    error,
    setError,
    fetchVariants
  };
}
