
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProductVariant } from "./types/inventoryTypes";

// Variants API
export const fetchVariantsByProductId = async (productId: string): Promise<ProductVariant[]> => {
  try {
    const { data, error } = await supabase
      .from("product_variants")
      .select("*")
      .eq("product_id", productId)
      .order("created_at");
      
    if (error) {
      throw error;
    }
    
    // Convert variant_attributes from Json to Record<string, any>
    return (data || []).map(variant => ({
      ...variant,
      variant_attributes: variant.variant_attributes as Record<string, any>
    }));
  } catch (error) {
    console.error("Error fetching variants:", error);
    toast.error("Failed to load product variants");
    return [];
  }
};

export const createVariant = async (variant: Omit<ProductVariant, 'id' | 'created_at' | 'updated_at'> & { id?: string }): Promise<ProductVariant | null> => {
  try {
    // Ensure product_id is provided
    if (!variant.product_id) {
      throw new Error("Product ID is required for variants");
    }

    const { data, error } = await supabase
      .from("product_variants")
      .insert(variant)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    toast.success("Variant created successfully");
    // Convert variant_attributes from Json to Record<string, any>
    return {
      ...data,
      variant_attributes: data.variant_attributes as Record<string, any>
    };
  } catch (error) {
    console.error("Error creating variant:", error);
    toast.error("Failed to create variant");
    return null;
  }
};

export const updateVariant = async (id: string, variant: Partial<ProductVariant>): Promise<ProductVariant | null> => {
  try {
    const { data, error } = await supabase
      .from("product_variants")
      .update(variant)
      .eq("id", id)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    toast.success("Variant updated successfully");
    // Convert variant_attributes from Json to Record<string, any>
    return {
      ...data,
      variant_attributes: data.variant_attributes as Record<string, any>
    };
  } catch (error) {
    console.error("Error updating variant:", error);
    toast.error("Failed to update variant");
    return null;
  }
};

export const deleteVariant = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("product_variants")
      .delete()
      .eq("id", id);
      
    if (error) {
      throw error;
    }
    
    toast.success("Variant deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting variant:", error);
    toast.error("Failed to delete variant");
    return false;
  }
};

export const adjustVariantStock = async (id: string, stock: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("product_variants")
      .update({ stock_count: stock, updated_at: new Date().toISOString() })
      .eq("id", id);
      
    if (error) {
      throw error;
    }
    
    toast.success("Variant inventory updated successfully");
    return true;
  } catch (error) {
    console.error("Error adjusting variant inventory:", error);
    toast.error("Failed to update variant inventory");
    return false;
  }
};
