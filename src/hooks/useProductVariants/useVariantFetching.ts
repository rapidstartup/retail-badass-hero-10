
import { useState, useEffect, useCallback } from 'react';
import { ProductVariant } from '@/api/types/inventoryTypes';
import { fetchVariantsByProductId } from '@/api/variantApi';

export const useVariantFetching = (productId: string) => {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchVariants = useCallback(async () => {
    if (!productId) return;
    
    setLoading(true);
    try {
      const fetchedVariants = await fetchVariantsByProductId(productId);
      setVariants(fetchedVariants);
    } catch (error) {
      console.error('Error fetching variants:', error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchVariants();
  }, [fetchVariants]);

  return { variants, loading, fetchVariants };
};
