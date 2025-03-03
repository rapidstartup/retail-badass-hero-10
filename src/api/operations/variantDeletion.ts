
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Delete a variant
export const deleteVariant = async (id: string): Promise<boolean> => {
  try {
    console.log("Deleting variant ID:", id);
    
    const { error } = await supabase
      .from("product_variants")
      .delete()
      .eq("id", id);
      
    if (error) {
      console.error("Supabase error deleting variant:", error);
      throw error;
    }
    
    console.log("Variant deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting variant:", error);
    toast.error(`Failed to delete variant: ${error instanceof Error ? error.message : "Unknown error"}`);
    return false;
  }
};
