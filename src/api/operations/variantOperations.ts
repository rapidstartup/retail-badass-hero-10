
import { supabase } from "@/integrations/supabase/client";
import { ProductVariant, VariantInsert } from "../types/variantTypes";
import { toast } from "sonner";

// Fetch variants by product ID
export const fetchVariantsByProductId = async (productId: string): Promise<ProductVariant[]> => {
  try {
    console.log("Fetching variants for product ID:", productId);
    
    const { data, error } = await supabase
      .from("product_variants")
      .select("*")
      .eq("product_id", productId);
      
    if (error) {
      console.error("Supabase error fetching variants:", error);
      throw error;
    }
    
    // Convert variant_attributes from Json to Record<string, any>
    const variants = (data || []).map(item => ({
      ...item,
      variant_attributes: item.variant_attributes || {}
    })) as ProductVariant[];
    
    console.log("Fetched variants:", variants);
    return variants;
  } catch (error) {
    console.error("Error fetching variants:", error);
    toast.error("Failed to load product variants");
    return [];
  }
};

// Create a new variant
export const createVariant = async (variant: VariantInsert): Promise<ProductVariant | null> => {
  try {
    // Ensure required fields are provided
    if (!variant.product_id) {
      throw new Error("Product ID is required for creating variants");
    }

    console.log("Creating variant with data:", variant);
    
    const { data, error } = await supabase
      .from("product_variants")
      .insert(variant)
      .select()
      .single();
      
    if (error) {
      console.error("Supabase error creating variant:", error);
      throw error;
    }
    
    // Convert variant_attributes from Json to Record<string, any>
    const newVariant = {
      ...data,
      variant_attributes: data.variant_attributes || {}
    } as ProductVariant;
    
    console.log("Variant created successfully:", newVariant);
    toast.success("Product variant created successfully");
    return newVariant;
  } catch (error) {
    console.error("Error creating variant:", error);
    toast.error(`Failed to create variant: ${error instanceof Error ? error.message : "Unknown error"}`);
    return null;
  }
};
