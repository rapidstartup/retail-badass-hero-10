
import { useState, useEffect } from "react";
import { ProductVariant, fetchVariantsByProductId } from "@/api/inventoryApi";

export function useVariantFetching(productId: string) {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchVariants = async () => {
    setLoading(true);
    try {
      const data = await fetchVariantsByProductId(productId);
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
    if (productId) {
      fetchVariants();
    }
  }, [productId]);

  return {
    variants,
    setVariants,
    loading,
    fetchVariants
  };
}
