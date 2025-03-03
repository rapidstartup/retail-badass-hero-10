
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProductVariant } from "./types/inventoryTypes";

// Variants API
export const fetchVariantsByProductId = async (productId: string): Promise<ProductVariant[]> => {
  try {
    console.log("Fetching variants for product ID:", productId);
    const { data, error } = await supabase
      .from("product_variants")
      .select("*")
      .eq("product_id", productId)
      .order("created_at");
      
    if (error) {
      console.error("Supabase error fetching variants:", error);
      throw error;
    }
    
    console.log("Fetched variants data:", data);
    
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

    console.log("Creating variant with data:", variant);

    // Make sure we're sending proper data to Supabase
    const variantData = {
      product_id: variant.product_id,
      sku: variant.sku || null,
      price: variant.price || 0,
      stock_count: variant.stock_count || 0,
      color: variant.color || null,
      size: variant.size || null,
      flavor: variant.flavor || null,
      variant_attributes: variant.variant_attributes || {}
    };

    const { data, error } = await supabase
      .from("product_variants")
      .insert(variantData)
      .select()
      .single();
      
    if (error) {
      console.error("Supabase error creating variant:", error);
      throw error;
    }
    
    console.log("Created variant:", data);
    
    // Convert variant_attributes from Json to Record<string, any>
    return {
      ...data,
      variant_attributes: data.variant_attributes as Record<string, any>
    };
  } catch (error) {
    console.error("Error creating variant:", error);
    toast.error(`Failed to create variant: ${error instanceof Error ? error.message : "Unknown error"}`);
    return null;
  }
};

export const updateVariant = async (id: string, variant: Partial<ProductVariant>): Promise<ProductVariant | null> => {
  try {
    console.log("Updating variant ID:", id, "with data:", variant);
    
    // Create a clean version of the variant data
    const variantData = { ...variant };
    
    // Handle null or empty string fields that should be null in the database
    ['color', 'size', 'flavor', 'sku'].forEach(field => {
      if (field in variantData && (variantData[field] === '' || variantData[field] === undefined)) {
        variantData[field] = null;
      }
    });
    
    const { data, error } = await supabase
      .from("product_variants")
      .update(variantData)
      .eq("id", id)
      .select()
      .single();
      
    if (error) {
      console.error("Supabase error updating variant:", error);
      throw error;
    }
    
    console.log("Updated variant:", data);
    
    // Convert variant_attributes from Json to Record<string, any>
    return {
      ...data,
      variant_attributes: data.variant_attributes as Record<string, any>
    };
  } catch (error) {
    console.error("Error updating variant:", error);
    toast.error(`Failed to update variant: ${error instanceof Error ? error.message : "Unknown error"}`);
    return null;
  }
};

export const deleteVariant = async (id: string): Promise<boolean> => {
  try {
    console.log("Deleting variant ID:", id);
    
    const { error } = await supabase
      .from("product_variants")
      .delete()
      .eq("id", id);
      
    if (error) {
      console.error("Supabase error deleting variant:", error);
      throw error;
    }
    
    console.log("Variant deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting variant:", error);
    toast.error(`Failed to delete variant: ${error instanceof Error ? error.message : "Unknown error"}`);
    return false;
  }
};

export const adjustVariantStock = async (id: string, stock: number): Promise<boolean> => {
  try {
    console.log("Adjusting variant stock, ID:", id, "new stock:", stock);
    
    const { error } = await supabase
      .from("product_variants")
      .update({ stock_count: stock, updated_at: new Date().toISOString() })
      .eq("id", id);
      
    if (error) {
      console.error("Supabase error adjusting variant stock:", error);
      throw error;
    }
    
    console.log("Variant stock updated successfully");
    toast.success("Variant inventory updated successfully");
    return true;
  } catch (error) {
    console.error("Error adjusting variant inventory:", error);
    toast.error(`Failed to update variant inventory: ${error instanceof Error ? error.message : "Unknown error"}`);
    return false;
  }
};
