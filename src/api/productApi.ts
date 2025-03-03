
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Product } from "./types/inventoryTypes";

// Utility function to clean product data before sending to Supabase
const cleanProductData = (product: Partial<Product>) => {
  const cleanedData = { ...product };
  
  // Remove empty category_id to prevent UUID format error
  if (!cleanedData.category_id || cleanedData.category_id === "") {
    delete cleanedData.category_id;
  }
  
  return cleanedData;
};

// Products API
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

export const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'> & { id?: string }): Promise<Product | null> => {
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
      .insert(productData)
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

export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product | null> => {
  try {
    console.log("Updating product ID:", id, "with data:", product);
    
    // Clean up the product data before sending to Supabase
    const productData = cleanProductData(product);
    
    const { data, error } = await supabase
      .from("products")
      .update(productData)
      .eq("id", id)
      .select()
      .single();
      
    if (error) {
      console.error("Supabase error updating product:", error);
      throw error;
    }
    
    console.log("Product updated successfully:", data);
    toast.success("Product updated successfully");
    return data;
  } catch (error) {
    console.error("Error updating product:", error);
    toast.error(`Failed to update product: ${error instanceof Error ? error.message : "Unknown error"}`);
    return null;
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    console.log("Deleting product ID:", id);
    
    // First delete any variants
    const { error: variantsError } = await supabase
      .from("product_variants")
      .delete()
      .eq("product_id", id);
      
    if (variantsError) {
      console.error("Supabase error deleting product variants:", variantsError);
      throw variantsError;
    }
    
    // Then delete the product
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);
      
    if (error) {
      console.error("Supabase error deleting product:", error);
      throw error;
    }
    
    console.log("Product deleted successfully");
    toast.success("Product deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    toast.error(`Failed to delete product: ${error instanceof Error ? error.message : "Unknown error"}`);
    return false;
  }
};

// Inventory adjustment
export const adjustProductStock = async (id: string, stock: number): Promise<boolean> => {
  try {
    console.log("Adjusting product stock, ID:", id, "new stock:", stock);
    
    const { error } = await supabase
      .from("products")
      .update({ stock, updated_at: new Date().toISOString() })
      .eq("id", id);
      
    if (error) {
      console.error("Supabase error adjusting product stock:", error);
      throw error;
    }
    
    console.log("Product stock updated successfully");
    toast.success("Inventory updated successfully");
    return true;
  } catch (error) {
    console.error("Error adjusting inventory:", error);
    toast.error(`Failed to update inventory: ${error instanceof Error ? error.message : "Unknown error"}`);
    return false;
  }
};
