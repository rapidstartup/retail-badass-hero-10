
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define proper types for product variants to match the types already in the codebase
export interface ProductVariant {
  id: string;
  product_id: string;
  sku?: string | null;
  price: number;
  stock_count?: number | null;
  color?: string | null;
  size?: string | null;
  flavor?: string | null;
  variant_attributes: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

// VariantInsert with required fields still required
export type VariantInsert = {
  product_id: string; // Required for inserts
  price: number;
  sku?: string | null;
  stock_count?: number | null;
  color?: string | null;
  size?: string | null;
  flavor?: string | null;
  variant_attributes?: Record<string, any>;
};

export type VariantUpdate = Partial<VariantInsert>;

// Utility function to clean variant data before sending to Supabase
const cleanVariantData = (variant: Partial<ProductVariant>): VariantInsert | VariantUpdate => {
  const cleanedData = { ...variant } as VariantInsert | VariantUpdate;
  
  // Handle null or empty string fields that should be null in the database
  ['color', 'size', 'flavor', 'sku'].forEach(field => {
    if (field in cleanedData && (cleanedData[field as keyof typeof cleanedData] === '' || cleanedData[field as keyof typeof cleanedData] === undefined)) {
      cleanedData[field as keyof typeof cleanedData] = null;
    }
  });
  
  // Make sure product_id is always included for inserts
  if ('id' in variant === false && (!cleanedData.product_id || cleanedData.product_id === '')) {
    throw new Error("Product ID is required for variants");
  }
  
  // Remove any undefined fields
  Object.keys(cleanedData).forEach(key => {
    if (cleanedData[key as keyof typeof cleanedData] === undefined) {
      delete cleanedData[key as keyof typeof cleanedData];
    }
  });
  
  return cleanedData;
};

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

export const createVariant = async (variant: VariantInsert): Promise<ProductVariant | null> => {
  try {
    // Ensure product_id is provided
    if (!variant.product_id) {
      throw new Error("Product ID is required for variants");
    }

    console.log("Creating variant with data:", variant);

    // Clean and prepare variant data
    const variantData = cleanVariantData(variant);

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

export const updateVariant = async (id: string, variant: VariantUpdate): Promise<ProductVariant | null> => {
  try {
    console.log("Updating variant ID:", id, "with data:", variant);
    
    // Clean the variant data before sending to Supabase
    const variantData = cleanVariantData(variant);
    
    // If we're updating a variant, we need to ensure we're not sending empty data
    if (Object.keys(variantData).length === 0) {
      console.log("No valid variant data to update");
      return null;
    }
    
    console.log("Cleaned variant data for update:", variantData);
    
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
