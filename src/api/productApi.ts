
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Product } from "./types/inventoryTypes";

// Products API
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        product_categories(id, name)
      `)
      .order("name");
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    toast.error("Failed to load products");
    return [];
  }
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        product_categories(id, name)
      `)
      .eq("id", id)
      .single();
      
    if (error) {
      throw error;
    }
    
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

    const { data, error } = await supabase
      .from("products")
      .insert(product)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    toast.success("Product created successfully");
    return data;
  } catch (error) {
    console.error("Error creating product:", error);
    toast.error("Failed to create product");
    return null;
  }
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from("products")
      .update(product)
      .eq("id", id)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    toast.success("Product updated successfully");
    return data;
  } catch (error) {
    console.error("Error updating product:", error);
    toast.error("Failed to update product");
    return null;
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    // First delete any variants
    const { error: variantsError } = await supabase
      .from("product_variants")
      .delete()
      .eq("product_id", id);
      
    if (variantsError) {
      throw variantsError;
    }
    
    // Then delete the product
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);
      
    if (error) {
      throw error;
    }
    
    toast.success("Product deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    toast.error("Failed to delete product");
    return false;
  }
};

// Inventory adjustment
export const adjustProductStock = async (id: string, stock: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("products")
      .update({ stock, updated_at: new Date().toISOString() })
      .eq("id", id);
      
    if (error) {
      throw error;
    }
    
    toast.success("Inventory updated successfully");
    return true;
  } catch (error) {
    console.error("Error adjusting inventory:", error);
    toast.error("Failed to update inventory");
    return false;
  }
};
