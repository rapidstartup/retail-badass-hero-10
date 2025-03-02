
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProductCategory } from "./types/inventoryTypes";

// Categories API
export const fetchCategories = async (): Promise<ProductCategory[]> => {
  try {
    console.log("Fetching all categories");
    
    const { data, error } = await supabase
      .from("product_categories")
      .select("*")
      .order("name");
      
    if (error) {
      console.error("Supabase error fetching categories:", error);
      throw error;
    }
    
    console.log("Fetched categories:", data);
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

    console.log("Creating category with data:", category);

    const { data, error } = await supabase
      .from("product_categories")
      .insert(category)
      .select()
      .single();
      
    if (error) {
      console.error("Supabase error creating category:", error);
      throw error;
    }
    
    console.log("Category created successfully:", data);
    toast.success("Category created successfully");
    return data;
  } catch (error) {
    console.error("Error creating category:", error);
    toast.error(`Failed to create category: ${error instanceof Error ? error.message : "Unknown error"}`);
    return null;
  }
};

export const updateCategory = async (id: string, category: Partial<ProductCategory>): Promise<ProductCategory | null> => {
  try {
    console.log("Updating category ID:", id, "with data:", category);
    
    const { data, error } = await supabase
      .from("product_categories")
      .update(category)
      .eq("id", id)
      .select()
      .single();
      
    if (error) {
      console.error("Supabase error updating category:", error);
      throw error;
    }
    
    console.log("Category updated successfully:", data);
    toast.success("Category updated successfully");
    return data;
  } catch (error) {
    console.error("Error updating category:", error);
    toast.error(`Failed to update category: ${error instanceof Error ? error.message : "Unknown error"}`);
    return null;
  }
};

export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    console.log("Deleting category ID:", id);
    
    const { error } = await supabase
      .from("product_categories")
      .delete()
      .eq("id", id);
      
    if (error) {
      console.error("Supabase error deleting category:", error);
      throw error;
    }
    
    console.log("Category deleted successfully");
    toast.success("Category deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting category:", error);
    toast.error(`Failed to delete category: ${error instanceof Error ? error.message : "Unknown error"}`);
    return false;
  }
};
