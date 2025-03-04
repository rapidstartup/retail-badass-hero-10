
import { useState } from "react";
import { ProductVariant } from "@/api/types/variantTypes";
import { useSkuGenerator } from "./useSkuGenerator";

type CreateVariantFunction = (variantData: Omit<ProductVariant, 'id' | 'created_at' | 'updated_at'>) => Promise<ProductVariant | null>;

export function useBulkVariantGenerator(productId: string, handleCreateVariant: CreateVariantFunction) {
  // Color options
  const [colorOptions, setColorOptions] = useState<string[]>([]);
  const [newColorOption, setNewColorOption] = useState<string>("");
  
  // Size options
  const [sizeOptions, setSizeOptions] = useState<string[]>([]);
  const [newSizeOption, setNewSizeOption] = useState<string>("");
  
  // Flavor options
  const [flavorOptions, setFlavorOptions] = useState<string[]>([]);
  const [newFlavorOption, setNewFlavorOption] = useState<string>("");
  
  // Base options for all variants
  const [bulkBasePrice, setBulkBasePrice] = useState<number>(0);
  const [bulkBaseStock, setBulkBaseStock] = useState<number>(0);
  
  // SKU generator
  const { skuPrefix, setSkuPrefix, generateSku } = useSkuGenerator("");
  
  // Initialize/reset the bulk generator
  const initializeBulkGenerator = () => {
    setColorOptions([]);
    setSizeOptions([]);
    setFlavorOptions([]);
    setNewColorOption("");
    setNewSizeOption("");
    setNewFlavorOption("");
    setBulkBasePrice(0);
    setBulkBaseStock(0);
    setSkuPrefix("");
  };
  
  // Helper to add color option
  const addColorOption = () => {
    if (newColorOption.trim() !== "" && !colorOptions.includes(newColorOption.trim())) {
      setColorOptions([...colorOptions, newColorOption.trim()]);
      setNewColorOption("");
    }
  };
  
  // Helper to add size option
  const addSizeOption = () => {
    if (newSizeOption.trim() !== "" && !sizeOptions.includes(newSizeOption.trim())) {
      setSizeOptions([...sizeOptions, newSizeOption.trim()]);
      setNewSizeOption("");
    }
  };
  
  // Helper to add flavor option
  const addFlavorOption = () => {
    if (newFlavorOption.trim() !== "" && !flavorOptions.includes(newFlavorOption.trim())) {
      setFlavorOptions([...flavorOptions, newFlavorOption.trim()]);
      setNewFlavorOption("");
    }
  };
  
  // Helper to remove color option
  const removeColorOption = (color: string) => {
    setColorOptions(colorOptions.filter(c => c !== color));
  };
  
  // Helper to remove size option
  const removeSizeOption = (size: string) => {
    setSizeOptions(sizeOptions.filter(s => s !== size));
  };
  
  // Helper to remove flavor option
  const removeFlavorOption = (flavor: string) => {
    setFlavorOptions(flavorOptions.filter(f => f !== flavor));
  };
  
  // Generate all possible combinations of variants
  const generateBulkVariants = async () => {
    // Validate input
    if (
      (colorOptions.length === 0 && sizeOptions.length === 0 && flavorOptions.length === 0) ||
      isNaN(bulkBasePrice) || 
      bulkBasePrice <= 0
    ) {
      console.error("Cannot generate variants: Need at least one option type and a valid base price");
      return;
    }
    
    const hasColors = colorOptions.length > 0;
    const hasSizes = sizeOptions.length > 0;
    const hasFlavors = flavorOptions.length > 0;
    
    // Generate combinations
    let combinations: {color?: string, size?: string, flavor?: string}[] = [{}];
    
    if (hasColors) {
      const newCombos: {color?: string, size?: string, flavor?: string}[] = [];
      for (const combo of combinations) {
        for (const color of colorOptions) {
          newCombos.push({...combo, color});
        }
      }
      combinations = newCombos;
    }
    
    if (hasSizes) {
      const newCombos: {color?: string, size?: string, flavor?: string}[] = [];
      for (const combo of combinations) {
        for (const size of sizeOptions) {
          newCombos.push({...combo, size});
        }
      }
      combinations = newCombos;
    }
    
    if (hasFlavors) {
      const newCombos: {color?: string, size?: string, flavor?: string}[] = [];
      for (const combo of combinations) {
        for (const flavor of flavorOptions) {
          newCombos.push({...combo, flavor});
        }
      }
      combinations = newCombos;
    }
    
    console.log("Generated combinations:", combinations);
    
    // Create variants for each combination
    for (const combo of combinations) {
      const variantName = [
        combo.color || "",
        combo.size || "",
        combo.flavor || ""
      ].filter(Boolean).join("-");
      
      // Generate a unique SKU for this variant
      const sku = skuPrefix
        ? `${skuPrefix}-${variantName}`
        : generateSku(variantName);
      
      const variantData = {
        product_id: productId,
        sku,
        price: bulkBasePrice,
        stock_count: bulkBaseStock,
        color: combo.color || null,
        size: combo.size || null,
        flavor: combo.flavor || null,
        variant_attributes: {
          ...(combo.color && { color: combo.color }),
          ...(combo.size && { size: combo.size }),
          ...(combo.flavor && { flavor: combo.flavor })
        }
      };
      
      // Create the variant in the database
      try {
        await handleCreateVariant(variantData);
      } catch (error) {
        console.error("Error creating variant:", error);
      }
    }
  };
  
  return {
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
    addColorOption,
    addSizeOption,
    addFlavorOption,
    removeColorOption,
    removeSizeOption,
    removeFlavorOption,
    generateBulkVariants,
    initializeBulkGenerator
  };
}
