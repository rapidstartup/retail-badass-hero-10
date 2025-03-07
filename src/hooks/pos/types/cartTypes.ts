
import { Json } from "@/integrations/supabase/types";

// Define product interface for type safety
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string | null;
  image_url: string | null;
  stock: number | null;
  description: string | null;
  has_variants?: boolean;
}

// Define variant interface
export interface ProductVariant {
  id: string;
  product_id: string;
  color?: string | null;
  size?: string | null;
  flavor?: string | null;
  price: number;
  stock_count?: number | null;
  sku?: string | null;
}

// Define cart item interface
export interface CartItem extends Product {
  quantity: number;
  variant_id?: string;
  variant?: ProductVariant | null; // The selected variant
}

// Helper function to check if a JSON object has the required properties to be a CartItem
export const isValidCartItem = (item: Json): boolean => {
  return (
    typeof item === 'object' && 
    item !== null && 
    'id' in item && 
    typeof item.id === 'string' &&
    'name' in item && 
    typeof item.name === 'string' &&
    'price' in item && 
    typeof item.price === 'number' &&
    'quantity' in item &&
    typeof item.quantity === 'number'
  );
};
