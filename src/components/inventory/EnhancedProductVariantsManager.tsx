
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, FileText } from "lucide-react";
import { Product } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProductVariants } from "@/hooks/useProductVariants";
import VariantCombinationsTable from "./variants/VariantCombinationsTable";
import VariantTypesForm from "./variants/VariantTypesForm";
import { VariantType } from "@/hooks/useProductVariants/types";

interface EnhancedProductVariantsManagerProps {
  product: Product;
  onClose: () => void;
  onProductUpdated?: () => void;
}

const EnhancedProductVariantsManager = ({ product, onClose, onProductUpdated }: EnhancedProductVariantsManagerProps) => {
  const [showAddVariant, setShowAddVariant] = useState(false);
  const {
    variants,
    variantTypes,
    combinations,
    loading,
    saving,
    error,
    fetchVariants,
    setVariantTypes,
    setCombinations,
    updateCombination,
    deleteCombination,
    saveVariants,
    generateCombinations
  } = useProductVariants(product, onProductUpdated);

  // Generate a SKU prefix based on the product name
  const skuPrefix = product.sku || 
    product.name.split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 3);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <ScrollArea className="max-h-[calc(90vh-100px)]">
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
                  onClick={() => setShowAddVariant(prev => !prev)} 
                  className="flex items-center gap-1"
                  variant={showAddVariant ? "secondary" : "default"}
                >
                  <Plus className="h-4 w-4" />
                  {showAddVariant ? "Cancel" : "Edit Variant Types"}
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
              <Tabs defaultValue="edit" className="border rounded-md p-4 mb-4">
                <TabsList className="grid w-full grid-cols-1">
                  <TabsTrigger value="edit">
                    <FileText className="h-4 w-4 mr-2" />
                    Edit Variant Types
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="edit" className="p-4">
                  <VariantTypesForm 
                    variantTypes={variantTypes}
                    setVariantTypes={setVariantTypes}
                  />
                </TabsContent>
              </Tabs>
            )}

            <VariantCombinationsTable 
              combinations={combinations}
              onUpdateCombination={updateCombination}
              onDeleteCombination={deleteCombination}
              basePrice={product.price}
              skuPrefix={skuPrefix || ""}
              isLoading={loading}
            />
          </div>
        </ScrollArea>
        
        <DialogFooter>
          <Button onClick={onClose} disabled={saving}>
            Done
          </Button>
          <Button 
            type="button" 
            variant="default" 
            onClick={saveVariants} 
            disabled={saving || loading}
          >
            {saving ? "Saving..." : "Save Variants"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedProductVariantsManager;
