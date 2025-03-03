
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Delete a product and its variants
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
