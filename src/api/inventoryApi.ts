
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Category types
export interface ProductCategory {
  id: string;
  name: string;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  cost: number | null;
  stock: number | null;
  sku: string | null;
  barcode: string | null;
  image_url: string | null;
  category: string | null;
  category_id: string | null;
  has_variants: boolean;
  created_at: string | null;
  updated_at: string | null;
}

// Variant types
export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string | null;
  price: number | null;
  stock_count: number | null;
  color: string | null;
  size: string | null;
  variant_attributes: Record<string, any> | null;
  created_at: string | null;
  updated_at: string | null;
}

// Categories API
export const fetchCategories = async (): Promise<ProductCategory[]> => {
  try {
    const { data, error } = await supabase
      .from("product_categories")
      .select("*")
      .order("name");
      
    if (error) {
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    toast.error("Failed to load product categories");
    return [];
  }
};

export const createCategory = async (category: Partial<ProductCategory>): Promise<ProductCategory | null> => {
  try {
    const { data, error } = await supabase
      .from("product_categories")
      .insert(category)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    toast.success("Category created successfully");
    return data;
  } catch (error) {
    console.error("Error creating category:", error);
    toast.error("Failed to create category");
    return null;
  }
};

export const updateCategory = async (id: string, category: Partial<ProductCategory>): Promise<ProductCategory | null> => {
  try {
    const { data, error } = await supabase
      .from("product_categories")
      .update(category)
      .eq("id", id)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    toast.success("Category updated successfully");
    return data;
  } catch (error) {
    console.error("Error updating category:", error);
    toast.error("Failed to update category");
    return null;
  }
};

export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("product_categories")
      .delete()
      .eq("id", id);
      
    if (error) {
      throw error;
    }
    
    toast.success("Category deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting category:", error);
    toast.error("Failed to delete category");
    return false;
  }
};

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

export const createProduct = async (product: Partial<Product>): Promise<Product | null> => {
  try {
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
    
    return data || [];
  } catch (error) {
    console.error("Error fetching variants:", error);
    toast.error("Failed to load product variants");
    return [];
  }
};

export const createVariant = async (variant: Partial<ProductVariant>): Promise<ProductVariant | null> => {
  try {
    const { data, error } = await supabase
      .from("product_variants")
      .insert(variant)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    toast.success("Variant created successfully");
    return data;
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
    return data;
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
