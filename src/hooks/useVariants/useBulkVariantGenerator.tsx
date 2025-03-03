import { useState } from "react";
import { ProductVariant } from "@/api/types/inventoryTypes";
import { toast } from "sonner";

export function useBulkVariantGenerator(
  productId: string,
  handleCreateVariant: (variantData: Omit<ProductVariant, 'id' | 'created_at' | 'updated_at'>) => Promise<ProductVariant | null>
) {
  const [colorOptions, setColorOptions] = useState<string[]>([]);
  const [sizeOptions, setSizeOptions] = useState<string[]>([]);
  const [flavorOptions, setFlavorOptions] = useState<string[]>([]);
  const [newColorOption, setNewColorOption] = useState("");
  const [newSizeOption, setNewSizeOption] = useState("");
  const [newFlavorOption, setNewFlavorOption] = useState("");
  const [bulkBasePrice, setBulkBasePrice] = useState<number>(0);
  const [bulkBaseStock, setBulkBaseStock] = useState<number>(0);
  const [creatingBulkVariants, setCreatingBulkVariants] = useState(false);
  
  // Function to initialize bulk generator with product data
  const initializeBulkGenerator = (price: number, existingVariants: ProductVariant[]) => {
    setBulkBasePrice(price);
    
    // Extract unique colors, sizes, and flavors from existing variants
    const uniqueColors = Array.from(new Set(existingVariants.map(v => v.color).filter(Boolean))) as string[];
    const uniqueSizes = Array.from(new Set(existingVariants.map(v => v.size).filter(Boolean))) as string[];
    const uniqueFlavors = Array.from(new Set(existingVariants.map(v => v.flavor).filter(Boolean))) as string[];
    
    if (uniqueColors.length > 0) setColorOptions(uniqueColors);
    if (uniqueSizes.length > 0) setSizeOptions(uniqueSizes);
    if (uniqueFlavors.length > 0) setFlavorOptions(uniqueFlavors);
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
  
  const addFlavorOption = () => {
    if (!newFlavorOption) return;
    if (!flavorOptions.includes(newFlavorOption)) {
      setFlavorOptions([...flavorOptions, newFlavorOption]);
    }
    setNewFlavorOption("");
  };
  
  const removeColorOption = (color: string) => {
    setColorOptions(colorOptions.filter(c => c !== color));
  };
  
  const removeSizeOption = (size: string) => {
    setSizeOptions(sizeOptions.filter(s => s !== size));
  };
  
  const removeFlavorOption = (flavor: string) => {
    setFlavorOptions(flavorOptions.filter(f => f !== flavor));
  };
  
  const generateBulkVariants = async () => {
    if (colorOptions.length === 0 && sizeOptions.length === 0 && flavorOptions.length === 0) {
      toast.error("You need to add at least one color, size, or flavor option");
      return;
    }
    
    try {
      setCreatingBulkVariants(true);
      let createdVariants = 0;
      
      // If only one attribute has options, create one variant per option
      if (colorOptions.length > 0 && sizeOptions.length === 0 && flavorOptions.length === 0) {
        for (const color of colorOptions) {
          const result = await handleCreateVariant({
            product_id: productId,
            price: bulkBasePrice,
            sku: `${productId.substring(0, 4)}-${color.substring(0, 3)}`,
            stock_count: bulkBaseStock,
            color: color,
            size: null,
            flavor: null,
            variant_attributes: {}
          });
          if (result) createdVariants++;
        }
      }
      else if (sizeOptions.length > 0 && colorOptions.length === 0 && flavorOptions.length === 0) {
        for (const size of sizeOptions) {
          const result = await handleCreateVariant({
            product_id: productId,
            price: bulkBasePrice,
            sku: `${productId.substring(0, 4)}-${size}`,
            stock_count: bulkBaseStock,
            color: null,
            size: size,
            flavor: null,
            variant_attributes: {}
          });
          if (result) createdVariants++;
        }
      }
      else if (flavorOptions.length > 0 && colorOptions.length === 0 && sizeOptions.length === 0) {
        for (const flavor of flavorOptions) {
          const result = await handleCreateVariant({
            product_id: productId,
            price: bulkBasePrice,
            sku: `${productId.substring(0, 4)}-${flavor.substring(0, 3)}`,
            stock_count: bulkBaseStock,
            color: null,
            size: null,
            flavor: flavor,
            variant_attributes: {}
          });
          if (result) createdVariants++;
        }
      }
      // If two attributes have options, create a matrix of those two
      else if (colorOptions.length > 0 && sizeOptions.length > 0 && flavorOptions.length === 0) {
        for (const color of colorOptions) {
          for (const size of sizeOptions) {
            const result = await handleCreateVariant({
              product_id: productId,
              price: bulkBasePrice,
              sku: `${productId.substring(0, 4)}-${color.substring(0, 3)}-${size}`,
              stock_count: bulkBaseStock,
              color: color,
              size: size,
              flavor: null,
              variant_attributes: {}
            });
            if (result) createdVariants++;
          }
        }
      }
      else if (colorOptions.length > 0 && flavorOptions.length > 0 && sizeOptions.length === 0) {
        for (const color of colorOptions) {
          for (const flavor of flavorOptions) {
            const result = await handleCreateVariant({
              product_id: productId,
              price: bulkBasePrice,
              sku: `${productId.substring(0, 4)}-${color.substring(0, 3)}-${flavor.substring(0, 3)}`,
              stock_count: bulkBaseStock,
              color: color,
              size: null,
              flavor: flavor,
              variant_attributes: {}
            });
            if (result) createdVariants++;
          }
        }
      }
      else if (sizeOptions.length > 0 && flavorOptions.length > 0 && colorOptions.length === 0) {
        for (const size of sizeOptions) {
          for (const flavor of flavorOptions) {
            const result = await handleCreateVariant({
              product_id: productId,
              price: bulkBasePrice,
              sku: `${productId.substring(0, 4)}-${size}-${flavor.substring(0, 3)}`,
              stock_count: bulkBaseStock,
              color: null,
              size: size,
              flavor: flavor,
              variant_attributes: {}
            });
            if (result) createdVariants++;
          }
        }
      }
      // If all three attributes have options, create a 3D matrix
      else if (colorOptions.length > 0 && sizeOptions.length > 0 && flavorOptions.length > 0) {
        for (const color of colorOptions) {
          for (const size of sizeOptions) {
            for (const flavor of flavorOptions) {
              const result = await handleCreateVariant({
                product_id: productId,
                price: bulkBasePrice,
                sku: `${productId.substring(0, 4)}-${color.substring(0, 3)}-${size}-${flavor.substring(0, 3)}`,
                stock_count: bulkBaseStock,
                color: color,
                size: size,
                flavor: flavor,
                variant_attributes: {}
              });
              if (result) createdVariants++;
            }
          }
        }
      }
      
      toast.success(`Successfully generated ${createdVariants} variants`);
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
    creatingBulkVariants,
    initializeBulkGenerator,
    addColorOption,
    addSizeOption,
    addFlavorOption,
    removeColorOption,
    removeSizeOption,
    removeFlavorOption,
    generateBulkVariants
  };
}
