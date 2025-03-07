
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "../types/cartTypes";

// Check stock availability for all items in cart
export const checkStockAvailability = async (cartItems: CartItem[]): Promise<boolean> => {
  for (const item of cartItems) {
    if (item.variant_id && item.variant) {
      // Check variant stock
      const { data, error } = await supabase
        .from('product_variants')
        .select('stock_count')
        .eq('id', item.variant_id)
        .single();
        
      if (error) {
        console.error('Error checking variant stock:', error);
        return false;
      }
      
      if (data.stock_count !== null && data.stock_count < item.quantity) {
        const variantDetails = [item.variant.color, item.variant.size, item.variant.flavor]
          .filter(Boolean)
          .join(' ');
        
        console.error(`Not enough stock for ${item.name} (${variantDetails})`);
        return false;
      }
    } else {
      // Check regular product stock
      const { data, error } = await supabase
        .from('products')
        .select('stock')
        .eq('id', item.id)
        .single();
        
      if (error) {
        console.error('Error checking product stock:', error);
        return false;
      }
      
      if (data.stock !== null && data.stock < item.quantity) {
        console.error(`Not enough stock for ${item.name}`);
        return false;
      }
    }
  }
  
  return true;
};

// Update inventory after a transaction
export const updateInventory = async (cartItems: CartItem[]): Promise<boolean> => {
  try {
    for (const item of cartItems) {
      if (item.variant_id) {
        // Update variant stock
        const { error } = await supabase
          .from('product_variants')
          .update({ 
            stock_count: item.variant?.stock_count ? Math.max(0, item.variant.stock_count - item.quantity) : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', item.variant_id);
          
        if (error) {
          console.error('Error updating variant stock:', error);
          return false;
        }
      } else {
        // Update regular product stock
        const { error } = await supabase
          .from('products')
          .update({ 
            stock: item.stock ? Math.max(0, item.stock - item.quantity) : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', item.id);
          
        if (error) {
          console.error('Error updating product stock:', error);
          return false;
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error updating inventory:', error);
    return false;
  }
};
