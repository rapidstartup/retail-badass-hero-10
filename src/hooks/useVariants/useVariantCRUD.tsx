
import { useState } from "react";
import { ProductVariant } from "@/api/types/inventoryTypes";
import { createVariant, updateVariant, deleteVariant } from "@/api/variantApi";
import { toast } from "sonner";

export function useVariantCRUD(productId: string, refreshVariants: () => Promise<ProductVariant[]>) {
  const [creatingVariant, setCreatingVariant] = useState(false);
  
  const handleCreateVariant = async (variantData: Omit<ProductVariant, 'id' | 'created_at' | 'updated_at'>): Promise<void> => {
    try {
      setCreatingVariant(true);
      console.log("Creating variant with data:", { ...variantData, product_id: productId });
      
      // Make sure product_id is set correctly
      const dataToSend = {
        ...variantData,
        product_id: productId
      };
      
      const result = await createVariant(dataToSend);
      
      if (result) {
        console.log("Variant created successfully:", result);
        await refreshVariants();
        toast.success("Variant created successfully");
      } else {
        throw new Error("Failed to create variant - no result returned");
      }
    } catch (error) {
      console.error("Error creating variant:", error);
      toast.error(`Failed to create variant: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setCreatingVariant(false);
    }
  };

  const handleUpdateVariant = async (id: string, updates: Partial<ProductVariant>): Promise<void> => {
    try {
      console.log("Updating variant with ID:", id, "Updates:", updates);
      const result = await updateVariant(id, updates);
      
      if (result) {
        console.log("Variant updated successfully:", result);
        await refreshVariants();
        toast.success("Variant updated successfully");
      } else {
        throw new Error("Failed to update variant - no result returned");
      }
    } catch (error) {
      console.error("Error updating variant:", error);
      toast.error(`Failed to update variant: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const handleDeleteVariant = async (id: string): Promise<void> => {
    try {
      console.log("Deleting variant with ID:", id);
      const success = await deleteVariant(id);
      
      if (success) {
        console.log("Variant deleted successfully");
        await refreshVariants();
        toast.success("Variant deleted successfully");
      } else {
        throw new Error("Failed to delete variant");
      }
    } catch (error) {
      console.error("Error deleting variant:", error);
      toast.error(`Failed to delete variant: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  return {
    creatingVariant,
    handleCreateVariant,
    handleUpdateVariant,
    handleDeleteVariant
  };
}
