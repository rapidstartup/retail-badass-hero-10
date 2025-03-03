
import { useState, useEffect } from "react";
import { ProductVariant } from "@/api/types/variantTypes";
import { fetchVariantsByProductId } from "@/api/variantApi";

export function useVariantFetching(productId: string) {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchVariants = async () => {
    setLoading(true);
    try {
      if (!productId) {
        console.error("No product ID provided for fetching variants");
        setVariants([]);
        return [];
      }
      
      console.log("Fetching variants for product ID:", productId);
      const data = await fetchVariantsByProductId(productId);
      console.log("Fetched variants:", data);
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
    } else {
      setVariants([]);
      setLoading(false);
    }
  }, [productId]);

  return {
    variants,
    setVariants,
    loading,
    fetchVariants
  };
}
