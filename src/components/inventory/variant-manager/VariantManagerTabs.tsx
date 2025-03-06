
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Grid3X3 } from "lucide-react";
import SingleVariantForm from "../variants/SingleVariantForm";
import BulkVariantGenerator from "../variants/BulkVariantGenerator";
import { ProductVariant } from "@/types";

interface VariantManagerTabsProps {
  showAddVariant: boolean;
  mode: "single" | "bulk";
  setMode: (mode: "single" | "bulk") => void;
  newVariant: ProductVariant;
  setNewVariant: (variant: ProductVariant) => void;
  handleCreateVariant: (variantData: any) => Promise<ProductVariant | null>;
  creatingVariant: boolean;
  // Bulk generator props
  skuPrefix: string;
  setSkuPrefix: (prefix: string) => void;
  bulkBasePrice: number;
  setBulkBasePrice: (price: number) => void;
  bulkBaseStock: number;
  setBulkBaseStock: (stock: number) => void;
  colorOptions: string[];
  sizeOptions: string[];
  flavorOptions: string[];
  newColorOption: string;
  setNewColorOption: (color: string) => void;
  newSizeOption: string;
  setNewSizeOption: (size: string) => void;
  newFlavorOption: string;
  setNewFlavorOption: (flavor: string) => void;
  addColorOption: () => void;
  addSizeOption: () => void;
  addFlavorOption: () => void;
  removeColorOption: (color: string) => void;
  removeSizeOption: (size: string) => void;
  removeFlavorOption: (flavor: string) => void;
  generateBulkVariants: () => Promise<void>;
}

const VariantManagerTabs = ({
  showAddVariant,
  mode,
  setMode,
  newVariant,
  setNewVariant,
  handleCreateVariant,
  creatingVariant,
  // Bulk generator props
  skuPrefix,
  setSkuPrefix,
  bulkBasePrice,
  setBulkBasePrice,
  bulkBaseStock,
  setBulkBaseStock,
  colorOptions,
  sizeOptions,
  flavorOptions,
  newColorOption,
  setNewColorOption,
  newSizeOption,
  setNewSizeOption,
  newFlavorOption,
  setNewFlavorOption,
  addColorOption,
  addSizeOption,
  addFlavorOption,
  removeColorOption,
  removeSizeOption,
  removeFlavorOption,
  generateBulkVariants
}: VariantManagerTabsProps) => {
  if (!showAddVariant) return null;
  
  return (
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
          handleCreateVariant={handleCreateVariant}
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
  );
};

export default VariantManagerTabs;
