
import { useVariantFetching } from "./useVariants/useVariantFetching";
import { useVariantCRUD } from "./useVariants/useVariantCRUD";
import { useVariantForm } from "./useVariants/useVariantForm";
import { useBulkVariantGenerator } from "./useVariants/useBulkVariantGenerator";
import { useSkuGenerator } from "./useVariants/useSkuGenerator";
import { Product } from "@/api/types/inventoryTypes";

export const useVariantManager = (product: Product) => {
  // Ensure we have a valid product ID
  const productId = product?.id || '';
  
  // Combine all the smaller hooks
  const { variants, loading, fetchVariants } = useVariantFetching(productId);
  
  const { handleCreateVariant, handleUpdateVariant, handleDeleteVariant, creatingVariant } = 
    useVariantCRUD(productId, fetchVariants);
  
  const { newVariant, setNewVariant, showAddVariant, setShowAddVariant, mode, setMode, resetForm } = 
    useVariantForm(productId, product?.price || 0);
  
  const {
    colorOptions,
    sizeOptions,
    flavorOptions,
    newColorOption,
    setNewColorOption,
    newSizeOption,
    setNewSizeOption,
    newFlavorOption,
    setNewFlavorOption,
    bulkBasePrice,
    setBulkBasePrice,
    bulkBaseStock,
    setBulkBaseStock,
    addColorOption,
    addSizeOption,
    addFlavorOption,
    removeColorOption,
    removeSizeOption,
    removeFlavorOption,
    generateBulkVariants,
    initializeBulkGenerator
  } = useBulkVariantGenerator(productId, handleCreateVariant);
  
  const { skuPrefix, setSkuPrefix, generateSku } = useSkuGenerator(product?.sku || '');

  // Return all the props and methods from the combined hooks
  return {
    variants,
    loading,
    showAddVariant,
    setShowAddVariant,
    mode,
    setMode,
    newVariant,
    setNewVariant,
    colorOptions,
    sizeOptions,
    flavorOptions,
    newColorOption,
    setNewColorOption,
    newSizeOption,
    setNewSizeOption,
    newFlavorOption,
    setNewFlavorOption,
    bulkBasePrice,
    setBulkBasePrice,
    bulkBaseStock,
    setBulkBaseStock,
    skuPrefix,
    setSkuPrefix,
    creatingVariant,
    fetchVariants,
    handleCreateVariant,
    handleUpdateVariant,
    handleDeleteVariant,
    addColorOption,
    addSizeOption,
    addFlavorOption,
    removeColorOption,
    removeSizeOption,
    removeFlavorOption,
    generateBulkVariants,
    generateSku,
    resetForm,
    initializeBulkGenerator
  };
};
