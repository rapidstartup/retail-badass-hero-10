
import React, { useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, FileText, Grid3X3 } from "lucide-react";
import { Product } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVariantManager } from "@/hooks/useVariantManager";
import SingleVariantForm from "./variants/SingleVariantForm";
import BulkVariantGenerator from "./variants/BulkVariantGenerator";
import VariantsTable from "./variants/VariantsTable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface ProductVariantsManagerProps {
  product: Product;
  onClose: () => void;
}

const ProductVariantsManager = ({ product, onClose }: ProductVariantsManagerProps) => {
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
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <ScrollArea className="max-h-[calc(90vh-100px)]" style={{ background: "transparent" }}>
          <DialogHeader>
            <DialogTitle>
              Variants for {product.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Product Variants</h3>
                <p className="text-sm text-muted-foreground">
                  Manage color, size, flavor, and other variants for this product
                </p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={() => {
                    setShowAddVariant(prev => !prev);
                    if (!showAddVariant) {
                      resetForm();
                      initializeBulkGenerator();
                    }
                  }} 
                  className="flex items-center gap-1"
                  variant={showAddVariant ? "secondary" : "default"}
                >
                  <Plus className="h-4 w-4" />
                  {showAddVariant ? "Cancel" : "Add Variant"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={fetchVariants}
                  className="flex items-center gap-1"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>

            {showAddVariant && (
              <Tabs defaultValue="single" className="border rounded-md p-4 mb-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="single" onClick={() => setMode("single")}>
                    <FileText className="h-4 w-4 mr-2" />
                    Single Variant
                  </TabsTrigger>
                  <TabsTrigger value="bulk" onClick={() => setMode("bulk")}>
                    <Grid3X3 className="h-4 w-4 mr-2" />
                    Bulk Generator
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="single" className="p-4">
                  <SingleVariantForm 
                    newVariant={newVariant}
                    setNewVariant={setNewVariant}
                    handleCreateVariant={createVariantWithRefresh}
                    creatingVariant={creatingVariant}
                  />
                </TabsContent>
                
                <TabsContent value="bulk" className="space-y-4 p-4">
                  <BulkVariantGenerator 
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
                    creatingVariant={creatingVariant}
                  />
                </TabsContent>
              </Tabs>
            )}

            <VariantsTable 
              variants={variants}
              loading={loading}
              handleUpdateVariant={handleUpdateVariant}
              handleDeleteVariant={handleDeleteVariant}
            />
          </div>
        </ScrollArea>
        
        <DialogFooter>
          <Button onClick={onClose}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductVariantsManager;
