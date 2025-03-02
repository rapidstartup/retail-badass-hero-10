
import { useState, useEffect } from "react";
import { Product } from "@/types";
import { ProductVariant, fetchVariantsByProductId, createVariant, updateVariant, deleteVariant } from "@/api/inventoryApi";
import { toast } from "sonner";

export function useVariantManager(product: Product) {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddVariant, setShowAddVariant] = useState(false);
  const [mode, setMode] = useState<"single" | "bulk">("single");
  const [creatingVariant, setCreatingVariant] = useState(false);
  
  // New variant state
  const [newVariant, setNewVariant] = useState<ProductVariant>({
    id: '',
    product_id: product.id,
    sku: "",
    color: "",
    size: "",
    price: product.price,
    stock_count: 0,
    variant_attributes: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  
  // Colors and sizes for bulk generation
  const [colorOptions, setColorOptions] = useState<string[]>([]);
  const [sizeOptions, setSizeOptions] = useState<string[]>([]);
  const [newColorOption, setNewColorOption] = useState("");
  const [newSizeOption, setNewSizeOption] = useState("");
  const [bulkBasePrice, setBulkBasePrice] = useState<number>(product.price);
  const [bulkBaseStock, setBulkBaseStock] = useState<number>(0);
  
  // Custom SKU prefix for generated variants
  const [skuPrefix, setSkuPrefix] = useState(product.sku || product.name.substring(0, 3).toUpperCase());

  const fetchVariants = async () => {
    setLoading(true);
    try {
      const data = await fetchVariantsByProductId(product.id);
      setVariants(data);
      
      // Extract unique colors and sizes from existing variants
      const uniqueColors = Array.from(new Set(data.map(v => v.color).filter(Boolean))) as string[];
      const uniqueSizes = Array.from(new Set(data.map(v => v.size).filter(Boolean))) as string[];
      
      if (uniqueColors.length > 0) setColorOptions(uniqueColors);
      if (uniqueSizes.length > 0) setSizeOptions(uniqueSizes);
      
    } catch (error) {
      console.error("Error fetching variants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVariants();
  }, [product.id]);

  // Function to generate SKU based on product info and variant attributes
  const generateSku = (color: string = "", size: string = "") => {
    // Basic pattern: PREFIX-COLOR-SIZE (e.g., TST-BLK-L)
    const prefix = skuPrefix;
    const colorCode = color ? `-${color.substring(0, 3).toUpperCase()}` : "";
    const sizeCode = size ? `-${size.toUpperCase()}` : "";
    
    return `${prefix}${colorCode}${sizeCode}`;
  };

  const handleCreateVariant = async () => {
    if (!newVariant.sku) {
      // Auto-generate SKU if not provided
      newVariant.sku = generateSku(newVariant.color, newVariant.size);
    }
    
    if (newVariant.price === undefined || isNaN(Number(newVariant.price))) {
      toast.error("Valid price is required for variant");
      return;
    }
    
    try {
      setCreatingVariant(true);
      
      const variantData = {
        product_id: product.id,
        price: Number(newVariant.price),
        sku: newVariant.sku,
        stock_count: Number(newVariant.stock_count || 0),
        color: newVariant.color || '',
        size: newVariant.size || '',
        variant_attributes: newVariant.variant_attributes || {}
      };
      
      await createVariant(variantData);
      
      setNewVariant({
        id: '',
        product_id: product.id,
        sku: "",
        color: "",
        size: "",
        price: product.price,
        stock_count: 0,
        variant_attributes: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      setShowAddVariant(false);
      fetchVariants();
    } catch (error) {
      console.error("Error creating variant:", error);
    } finally {
      setCreatingVariant(false);
    }
  };

  const handleUpdateVariant = async (id: string, updates: Partial<ProductVariant>) => {
    try {
      await updateVariant(id, updates);
      fetchVariants();
    } catch (error) {
      console.error("Error updating variant:", error);
    }
  };

  const handleDeleteVariant = async (id: string) => {
    try {
      await deleteVariant(id);
      fetchVariants();
    } catch (error) {
      console.error("Error deleting variant:", error);
    }
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
      setCreatingVariant(true);
      
      // If no colors but have sizes, create one variant per size
      if (colorOptions.length === 0 && sizeOptions.length > 0) {
        for (const size of sizeOptions) {
          await createVariant({
            product_id: product.id,
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
            product_id: product.id,
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
              product_id: product.id,
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
      setCreatingVariant(false);
    }
  };

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
    generateSku,
    handleCreateVariant,
    handleUpdateVariant,
    handleDeleteVariant,
    addColorOption,
    addSizeOption,
    removeColorOption,
    removeSizeOption,
    generateBulkVariants
  };
}
