
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Category type definition
export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Get all categories
export const getCategories = async (): Promise<Category[]> => {
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

// Create a new category
export const createCategory = async (category: { name: string; description?: string }): Promise<Category | null> => {
  try {
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

// Update an existing category
export const updateCategory = async (id: string, category: Partial<Category>): Promise<Category | null> => {
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

// Delete a category
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
