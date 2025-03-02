
import { useState } from "react";
import { ProductVariant, createVariant, updateVariant, deleteVariant } from "@/api/inventoryApi";
import { toast } from "sonner";

export function useVariantCRUD(productId: string, fetchVariants: () => Promise<ProductVariant[]>) {
  const [creatingVariant, setCreatingVariant] = useState(false);
  
  const handleCreateVariant = async (variantData: Omit<ProductVariant, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setCreatingVariant(true);
      
      await createVariant({
        ...variantData,
        product_id: productId
      });
      
      await fetchVariants();
      toast.success("Variant created successfully");
    } catch (error) {
      console.error("Error creating variant:", error);
      toast.error("Failed to create variant");
    } finally {
      setCreatingVariant(false);
    }
  };

  const handleUpdateVariant = async (id: string, updates: Partial<ProductVariant>) => {
    try {
      await updateVariant(id, updates);
      await fetchVariants();
      toast.success("Variant updated successfully");
    } catch (error) {
      console.error("Error updating variant:", error);
      toast.error("Failed to update variant");
    }
  };

  const handleDeleteVariant = async (id: string) => {
    try {
      await deleteVariant(id);
      await fetchVariants();
      toast.success("Variant deleted successfully");
    } catch (error) {
      console.error("Error deleting variant:", error);
      toast.error("Failed to delete variant");
    }
  };

  return {
    creatingVariant,
    handleCreateVariant,
    handleUpdateVariant,
    handleDeleteVariant
  };
}
