
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define proper types for products
export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  cost?: number | null;
  stock?: number | null;
  sku?: string | null;
  barcode?: string | null;
  image_url?: string | null;
  category?: string | null;
  category_id?: string | null;
  has_variants?: boolean;
  created_at?: string;
  updated_at?: string;
  product_categories?: { id: string; name: string } | null;
}

// ProductInsert with required fields still required
export type ProductInsert = {
  name: string; // Still required for inserts
  price: number; // Still required for inserts
  description?: string | null;
  cost?: number | null;
  stock?: number | null;
  sku?: string | null;
  barcode?: string | null;
  image_url?: string | null;
  category?: string | null;
  category_id?: string | null;
  has_variants?: boolean;
};

export type ProductUpdate = Partial<ProductInsert>;

// Utility function to clean product data before sending to Supabase
const cleanProductData = (product: Partial<Product>): ProductInsert | ProductUpdate => {
  const cleanedData = { ...product };
  
  // Remove empty category_id to prevent UUID format error
  if (!cleanedData.category_id || cleanedData.category_id === "") {
    delete cleanedData.category_id;
  }
  
  // Remove any undefined fields
  Object.keys(cleanedData).forEach(key => {
    if (cleanedData[key as keyof typeof cleanedData] === undefined) {
      delete cleanedData[key as keyof typeof cleanedData];
    }
  });
  
  return cleanedData as ProductInsert | ProductUpdate;
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

export const updateProduct = async (id: string, updates: ProductUpdate): Promise<Product | null> => {
  try {
    console.log("Updating product ID:", id, "with data:", updates);
    
    // Clean up the product data before sending to Supabase
    const productData = cleanProductData(updates);
    
    // If we're updating a product, we need to ensure we're not sending empty required fields
    if (Object.keys(productData).length === 0) {
      console.log("No valid product data to update");
      return null;
    }
    
    // First fetch the current product if we need name or price
    if (('name' in updates && updates.name === undefined) || ('price' in updates && updates.price === undefined)) {
      const { data: currentProduct, error: fetchError } = await supabase
        .from("products")
        .select("name, price")
        .eq("id", id)
        .single();
      
      if (fetchError) {
        console.error("Supabase error fetching current product:", fetchError);
        throw fetchError;
      }
      
      // Merge the current values for required fields if they're not provided
      if ('name' in updates && updates.name === undefined) {
        productData.name = currentProduct.name;
      }
      
      if ('price' in updates && updates.price === undefined) {
        productData.price = currentProduct.price;
      }
    }
    
    console.log("Cleaned product data for update:", productData);
    
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
