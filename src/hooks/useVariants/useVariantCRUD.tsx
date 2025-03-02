
import { useState } from "react";
import { ProductVariant, createVariant, updateVariant, deleteVariant } from "@/api/inventoryApi";
import { toast } from "sonner";

export function useVariantCRUD(productId: string, fetchVariants: () => Promise<void>) {
  const [creatingVariant, setCreatingVariant] = useState(false);
  
  const handleCreateVariant = async (variantData: Omit<ProductVariant, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setCreatingVariant(true);
      
      await createVariant({
        ...variantData,
        product_id: productId
      });
      
      fetchVariants();
    } catch (error) {
      console.error("Error creating variant:", error);
    } finally {
      setCreatingVariant(false);
    }
  };

  const handleUpdateVariant = async (id: string, updates: Partial<ProductVariant>) => {
    try {
      await updateVariant(id, updates);
      fetchVariants();
    } catch (error) {
      console.error("Error updating variant:", error);
    }
  };

  const handleDeleteVariant = async (id: string) => {
    try {
      await deleteVariant(id);
      fetchVariants();
    } catch (error) {
      console.error("Error deleting variant:", error);
    }
  };

  return {
    creatingVariant,
    handleCreateVariant,
    handleUpdateVariant,
    handleDeleteVariant
  };
}
