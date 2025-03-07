
import { supabase } from "@/integrations/supabase/client";
import { ProductVariant } from "../types/cartTypes";
import { toast } from "sonner";

// Fetch variant details when needed
export const fetchVariant = async (variantId: string): Promise<ProductVariant | null> => {
  try {
    const { data, error } = await supabase
      .from('product_variants')
      .select('*')
      .eq('id', variantId)
      .single();
      
    if (error) {
      console.error('Error fetching variant:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching variant:', error);
    return null;
  }
};

// Check if a variant has enough stock
export const hasEnoughVariantStock = (variant: ProductVariant | null | undefined, requestedQuantity: number): boolean => {
  if (!variant || variant.stock_count === null) return true;
  return variant.stock_count >= requestedQuantity;
};

// Check if a product has enough stock
export const hasEnoughProductStock = (stock: number | null, requestedQuantity: number): boolean => {
  if (stock === null) return true;
  return stock >= requestedQuantity;
};

// Display stock error messages
export const showStockErrorMessage = (itemName: string, variantDetails?: string): void => {
  const message = variantDetails 
    ? `${itemName} (${variantDetails}) is out of stock`
    : `${itemName} is out of stock`;
  
  toast.error(message);
};
