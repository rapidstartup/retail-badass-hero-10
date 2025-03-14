
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductInsert } from "../types/productTypes";
import { cleanProductData } from "../utils/dataCleaners";
import { toast } from "sonner";

// Create a new product
export const createProduct = async (product: ProductInsert): Promise<Product | null> => {
  try {
    // Ensure required fields are provided
    if (!product.name || product.price === undefined) {
      throw new Error("Product name and price are required");
    }

    // Clean up the product data before sending to Supabase
    const productData = cleanProductData(product);

    console.log("Creating product with data:", productData);

    const { data, error } = await supabase
      .from("products")
      .insert(productData as ProductInsert)
      .select()
      .single();
      
    if (error) {
      console.error("Supabase error creating product:", error);
      throw error;
    }
    
    console.log("Product created successfully:", data);
    toast.success("Product created successfully");
    return data;
  } catch (error) {
    console.error("Error creating product:", error);
    toast.error(`Failed to create product: ${error instanceof Error ? error.message : "Unknown error"}`);
    return null;
  }
};
