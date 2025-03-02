
import { useVariantFetching } from "./useVariants/useVariantFetching";
import { useVariantCRUD } from "./useVariants/useVariantCRUD";
import { useVariantForm } from "./useVariants/useVariantForm";
import { useBulkVariantGenerator } from "./useVariants/useBulkVariantGenerator";
import { useSkuGenerator } from "./useVariants/useSkuGenerator";
import { Product } from "@/api/types/inventoryTypes";

export const useVariantManager = (product: Product) => {
  // Combine all the smaller hooks
  const { variants, loading, fetchVariants } = useVariantFetching(product.id);
  
  const { handleCreateVariant, handleUpdateVariant, handleDeleteVariant, creatingVariant } = 
    useVariantCRUD(product.id, fetchVariants);
  
  const { newVariant, setNewVariant, showAddVariant, setShowAddVariant, mode, setMode, resetForm } = 
    useVariantForm(product.id, product.price);
  
  const {
    colorOptions,
    sizeOptions,
    newColorOption,
    setNewColorOption,
    newSizeOption,
    setNewSizeOption,
    bulkBasePrice,
    setBulkBasePrice,
    bulkBaseStock,
    setBulkBaseStock,
    addColorOption,
    addSizeOption,
    removeColorOption,
    removeSizeOption,
    generateBulkVariants,
    initializeBulkGenerator
  } = useBulkVariantGenerator(product.id, handleCreateVariant);
  
  const { skuPrefix, setSkuPrefix, generateSku } = useSkuGenerator(product.sku || '');

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
    newColorOption,
    setNewColorOption,
    newSizeOption,
    setNewSizeOption,
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
    removeColorOption,
    removeSizeOption,
    generateBulkVariants,
    generateSku,
    resetForm,
    initializeBulkGenerator
  };
};
