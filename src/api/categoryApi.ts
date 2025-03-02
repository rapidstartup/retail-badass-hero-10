
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProductCategory } from "./types/inventoryTypes";

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

export const createCategory = async (category: Omit<ProductCategory, 'id' | 'created_at' | 'updated_at'> & { id?: string }): Promise<ProductCategory | null> => {
  try {
    // Ensure name is provided
    if (!category.name) {
      throw new Error("Category name is required");
    }

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
