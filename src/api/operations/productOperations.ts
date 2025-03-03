
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductInsert, ProductUpdate } from "../types/productTypes";
import { cleanProductData } from "../utils/dataCleaners";
import { toast } from "sonner";

// Fetch all products
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    console.log("Fetching all products");
    
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        product_categories(id, name)
      `)
      .order("name");
      
    if (error) {
      console.error("Supabase error fetching products:", error);
      throw error;
    }
    
    console.log("Fetched products:", data);
    return data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    toast.error("Failed to load products");
    return [];
  }
};

// Fetch a product by ID
export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    console.log("Fetching product with ID:", id);
    
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        product_categories(id, name)
      `)
      .eq("id", id)
      .single();
      
    if (error) {
      console.error("Supabase error fetching product by ID:", error);
      throw error;
    }
    
    console.log("Fetched product:", data);
    return data;
  } catch (error) {
    console.error("Error fetching product:", error);
    toast.error("Failed to load product details");
    return null;
  }
};
