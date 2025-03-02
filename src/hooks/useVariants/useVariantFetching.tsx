
import { useState, useEffect } from "react";
import { Product } from "@/types";
import { ProductVariant, fetchVariantsByProductId } from "@/api/inventoryApi";

export function useVariantFetching(product: Product) {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchVariants = async () => {
    setLoading(true);
    try {
      const data = await fetchVariantsByProductId(product.id);
      setVariants(data);
      return data;
    } catch (error) {
      console.error("Error fetching variants:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVariants();
  }, [product.id]);

  return {
    variants,
    setVariants,
    loading,
    fetchVariants
  };
}
