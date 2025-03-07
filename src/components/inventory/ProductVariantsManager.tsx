
import React, { useEffect } from "react";
import { Product } from "@/types";
import { useVariantManager } from "@/hooks/useVariants";
import VariantsTable from "./variants/VariantsTable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

// Import new component files
import VariantManagerHeader from "./variant-manager/VariantManagerHeader";
import VariantManagerActions from "./variant-manager/VariantManagerActions";
import VariantManagerTabs from "./variant-manager/VariantManagerTabs";
import VariantManagerFooter from "./variant-manager/VariantManagerFooter";

interface ProductVariantsManagerProps {
  product: Product;
  onClose: () => void;
}

export const ProductVariantsManager = ({ product, onClose }: ProductVariantsManagerProps) => {
  const {
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
    resetForm,
    initializeBulkGenerator
  } = useVariantManager(product);

  // Fetch variants when component mounts
  useEffect(() => {
    fetchVariants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Success handler for variant creation
  const handleVariantCreated = async (data: any) => {
    await fetchVariants();
    if (mode === "single") {
      resetForm();
      toast.success("Variant created successfully");
    }
  };

  // Wrapper for createVariant to handle refresh after creation
  const createVariantWithRefresh = async (variantData: any) => {
    const result = await handleCreateVariant(variantData);
    if (result) {
      handleVariantCreated(result);
    }
    return result;
  };

  return (
    <ScrollArea className="max-h-[calc(90vh-100px)]" style={{ background: "transparent" }}>
      {/* Header */}
      <VariantManagerHeader product={product} />
      
      <div className="space-y-4 py-4">
        {/* Actions bar with title and buttons */}
        <VariantManagerActions 
          showAddVariant={showAddVariant}
          setShowAddVariant={setShowAddVariant}
          resetForm={resetForm}
          initializeBulkGenerator={initializeBulkGenerator}
          fetchVariants={fetchVariants}
        />

        {/* Single/Bulk variant tabs */}
        <VariantManagerTabs 
          showAddVariant={showAddVariant}
          mode={mode}
          setMode={setMode}
          newVariant={newVariant}
          setNewVariant={setNewVariant}
          handleCreateVariant={createVariantWithRefresh}
          creatingVariant={creatingVariant}
          // Bulk generator props
          skuPrefix={skuPrefix}
          setSkuPrefix={setSkuPrefix}
          bulkBasePrice={bulkBasePrice}
          setBulkBasePrice={setBulkBasePrice}
          bulkBaseStock={bulkBaseStock}
          setBulkBaseStock={setBulkBaseStock}
          colorOptions={colorOptions}
          sizeOptions={sizeOptions}
          flavorOptions={flavorOptions}
          newColorOption={newColorOption}
          setNewColorOption={setNewColorOption}
          newSizeOption={newSizeOption}
          setNewSizeOption={setNewSizeOption}
          newFlavorOption={newFlavorOption}
          setNewFlavorOption={setNewFlavorOption}
          addColorOption={addColorOption}
          addSizeOption={addSizeOption}
          addFlavorOption={addFlavorOption}
          removeColorOption={removeColorOption}
          removeSizeOption={removeSizeOption}
          removeFlavorOption={removeFlavorOption}
          generateBulkVariants={generateBulkVariants}
        />

        {/* Variants table */}
        <VariantsTable 
          variants={variants}
          loading={loading}
          handleUpdateVariant={handleUpdateVariant}
          handleDeleteVariant={handleDeleteVariant}
        />
      </div>
      
      {/* Footer */}
      <VariantManagerFooter onClose={onClose} />
    </ScrollArea>
  );
};

export default ProductVariantsManager;
