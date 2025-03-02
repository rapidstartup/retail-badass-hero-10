
import { useState } from "react";
import { createVariant } from "@/api/inventoryApi";
import { toast } from "sonner";

export function useBulkVariantGenerator(
  productId: string, 
  generateSku: (color?: string, size?: string) => string,
  fetchVariants: () => Promise<void>
) {
  const [colorOptions, setColorOptions] = useState<string[]>([]);
  const [sizeOptions, setSizeOptions] = useState<string[]>([]);
  const [newColorOption, setNewColorOption] = useState("");
  const [newSizeOption, setNewSizeOption] = useState("");
  const [bulkBasePrice, setBulkBasePrice] = useState<number>(0);
  const [bulkBaseStock, setBulkBaseStock] = useState<number>(0);
  const [creatingBulkVariants, setCreatingBulkVariants] = useState(false);
  
  // Function to initialize bulk generator with product data
  const initializeBulkGenerator = (price: number, existingVariants: any[]) => {
    setBulkBasePrice(price);
    
    // Extract unique colors and sizes from existing variants
    const uniqueColors = Array.from(new Set(existingVariants.map(v => v.color).filter(Boolean))) as string[];
    const uniqueSizes = Array.from(new Set(existingVariants.map(v => v.size).filter(Boolean))) as string[];
    
    if (uniqueColors.length > 0) setColorOptions(uniqueColors);
    if (uniqueSizes.length > 0) setSizeOptions(uniqueSizes);
  };
  
  const addColorOption = () => {
    if (!newColorOption) return;
    if (!colorOptions.includes(newColorOption)) {
      setColorOptions([...colorOptions, newColorOption]);
    }
    setNewColorOption("");
  };
  
  const addSizeOption = () => {
    if (!newSizeOption) return;
    if (!sizeOptions.includes(newSizeOption)) {
      setSizeOptions([...sizeOptions, newSizeOption]);
    }
    setNewSizeOption("");
  };
  
  const removeColorOption = (color: string) => {
    setColorOptions(colorOptions.filter(c => c !== color));
  };
  
  const removeSizeOption = (size: string) => {
    setSizeOptions(sizeOptions.filter(s => s !== size));
  };
  
  const generateBulkVariants = async () => {
    if (colorOptions.length === 0 && sizeOptions.length === 0) {
      toast.error("You need to add at least one color or size option");
      return;
    }
    
    try {
      setCreatingBulkVariants(true);
      
      // If no colors but have sizes, create one variant per size
      if (colorOptions.length === 0 && sizeOptions.length > 0) {
        for (const size of sizeOptions) {
          await createVariant({
            product_id: productId,
            price: bulkBasePrice,
            sku: generateSku("", size),
            stock_count: bulkBaseStock,
            color: "",
            size: size,
            variant_attributes: {}
          });
        }
      }
      // If no sizes but have colors, create one variant per color
      else if (sizeOptions.length === 0 && colorOptions.length > 0) {
        for (const color of colorOptions) {
          await createVariant({
            product_id: productId,
            price: bulkBasePrice,
            sku: generateSku(color, ""),
            stock_count: bulkBaseStock,
            color: color,
            size: "",
            variant_attributes: {}
          });
        }
      }
      // If both colors and sizes, create a matrix of variants
      else {
        for (const color of colorOptions) {
          for (const size of sizeOptions) {
            await createVariant({
              product_id: productId,
              price: bulkBasePrice,
              sku: generateSku(color, size),
              stock_count: bulkBaseStock,
              color: color,
              size: size,
              variant_attributes: {}
            });
          }
        }
      }
      
      toast.success("Successfully generated variants");
      fetchVariants();
    } catch (error) {
      console.error("Error generating variants:", error);
      toast.error("Failed to generate variants");
    } finally {
      setCreatingBulkVariants(false);
    }
  };

  return {
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
    creatingBulkVariants,
    initializeBulkGenerator,
    addColorOption,
    addSizeOption,
    removeColorOption,
    removeSizeOption,
    generateBulkVariants
  };
}
