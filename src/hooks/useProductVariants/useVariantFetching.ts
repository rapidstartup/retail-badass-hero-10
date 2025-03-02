
import { useState, useEffect } from 'react';
import { ProductVariant } from '@/api/types/inventoryTypes';
import { fetchVariantsByProductId } from '@/api/variantApi';

export const useVariantFetching = (productId: string) => {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVariants = async () => {
    setLoading(true);
    try {
      if (!productId) {
        console.error('No product ID provided');
        setVariants([]);
        return;
      }

      const fetchedVariants = await fetchVariantsByProductId(productId);
      setVariants(fetchedVariants);
    } catch (error) {
      console.error('Error fetching variants:', error);
      setVariants([]);
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

  return { variants, loading, fetchVariants };
};
