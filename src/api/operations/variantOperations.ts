
import { supabase } from "@/integrations/supabase/client";
import { ProductVariant, VariantInsert, VariantUpdate } from "../types/variantTypes";
import { cleanVariantData } from "../utils/dataCleaners";
import { toast } from "sonner";

// Fetch variants by product ID
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

// Create a new variant
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
