
import React from "react";
import BaseSettingsForm from "./bulk-generator/BaseSettingsForm";
import VariantOptionCard from "./bulk-generator/VariantOptionCard";
import GenerateButton from "./bulk-generator/GenerateButton";

interface BulkVariantGeneratorProps {
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
  creatingVariant: boolean;
}

const BulkVariantGenerator = ({
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
  generateBulkVariants,
  creatingVariant
}: BulkVariantGeneratorProps) => {
  // Check if variants can be generated
  const noOptionsSelected = colorOptions.length === 0 && sizeOptions.length === 0 && flavorOptions.length === 0;

  return (
    <div className="space-y-6">
      {/* Base Settings Section */}
      <BaseSettingsForm 
        skuPrefix={skuPrefix}
        setSkuPrefix={setSkuPrefix}
        bulkBasePrice={bulkBasePrice}
        setBulkBasePrice={setBulkBasePrice}
        bulkBaseStock={bulkBaseStock}
        setBulkBaseStock={setBulkBaseStock}
      />
      
      {/* Variant Options Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <VariantOptionCard
          title="Colors"
          options={colorOptions}
          newOption={newColorOption}
          setNewOption={setNewColorOption}
          addOption={addColorOption}
          removeOption={removeColorOption}
          placeholder="Add a color"
        />
        
        <VariantOptionCard
          title="Sizes"
          options={sizeOptions}
          newOption={newSizeOption}
          setNewOption={setNewSizeOption}
          addOption={addSizeOption}
          removeOption={removeSizeOption}
          placeholder="Add a size"
        />
        
        <VariantOptionCard
          title="Flavors"
          options={flavorOptions}
          newOption={newFlavorOption}
          setNewOption={setNewFlavorOption}
          addOption={addFlavorOption}
          removeOption={removeFlavorOption}
          placeholder="Add a flavor"
        />
      </div>
      
      {/* Generate Button */}
      <GenerateButton
        onClick={generateBulkVariants}
        disabled={noOptionsSelected}
        loading={creatingVariant}
      />
    </div>
  );
};

export default BulkVariantGenerator;
