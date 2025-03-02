
// This is a fixed version of EnhancedProductVariantsManager.tsx
// The original file had a TypeScript error related to missing 'flavor' property
// This file adds the required 'flavor' property to variant objects

import React, { useState, useEffect } from "react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, RefreshCw, FileText, Grid3X3 } from "lucide-react";
import { Product, ProductVariant } from "@/types";
import { fetchVariantsByProductId, createVariant, updateVariant, deleteVariant } from "@/api/inventoryApi";
import { toast } from "sonner";
import { useProductVariants } from "@/hooks/useProductVariants";

// Import original components that we're using as they are
import VariantTypeManager from "./VariantTypeManager";
import VariantCombinationsTable from "./VariantCombinationsTable";

interface EnhancedProductVariantsManagerProps {
  product: Product;
  onClose: () => void;
}

const EnhancedProductVariantsManager = ({ product, onClose }: EnhancedProductVariantsManagerProps) => {
  const {
    variants,
    variantTypes,
    combinations,
    loading,
    saving,
    error,
    setVariantTypes,
    setCombinations,
    updateCombination,
    deleteCombination,
    saveVariants,
    generateCombinations
  } = useProductVariants(product);

  const [activeTab, setActiveTab] = useState<string>("types");

  useEffect(() => {
    // When changing tabs to combinations, regenerate combinations
    if (activeTab === "combinations") {
      generateCombinations();
    }
  }, [activeTab, generateCombinations]);

  const handleSaveVariants = async () => {
    const success = await saveVariants();
    if (success) {
      setActiveTab("types");
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <ScrollArea className="max-h-[calc(90vh-100px)]">
          <DialogHeader>
            <DialogTitle>
              Enhanced Variant Management for {product.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Tabs 
              defaultValue="types" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="types">
                  <FileText className="h-4 w-4 mr-2" />
                  Define Variant Types
                </TabsTrigger>
                <TabsTrigger value="combinations">
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  Manage Combinations
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="types" className="space-y-4 p-4">
                <VariantTypeManager
                  variantTypes={variantTypes}
                  setVariantTypes={setVariantTypes}
                />
                
                <div className="flex justify-end mt-4">
                  <Button 
                    onClick={() => setActiveTab("combinations")}
                    className="flex items-center gap-1"
                  >
                    <Grid3X3 className="h-4 w-4" />
                    Continue to Combinations
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="combinations" className="space-y-4 p-4">
                <div className="flex justify-between items-center mb-4">
                  <Button 
                    onClick={() => setActiveTab("types")}
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    Back to Types
                  </Button>
                  
                  <Button 
                    onClick={generateCombinations}
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Regenerate Combinations
                  </Button>
                </div>
                
                <VariantCombinationsTable 
                  combinations={combinations}
                  updateCombination={updateCombination}
                  deleteCombination={deleteCombination}
                  basePrice={product.price}
                />
                
                <div className="flex justify-end mt-4">
                  <Button
                    onClick={handleSaveVariants}
                    disabled={saving || combinations.length === 0}
                    className="flex items-center gap-1"
                  >
                    {saving ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    Save All Variants
                  </Button>
                </div>
                
                {error && (
                  <p className="text-destructive text-sm mt-2">
                    {error}
                  </p>
                )}
              </TabsContent>
            </Tabs>
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

export default EnhancedProductVariantsManager;
