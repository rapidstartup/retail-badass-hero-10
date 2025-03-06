
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export interface InventoryItem {
  product: string;
  stock: number;
  reorderLevel: number;
  status: "Good" | "Low" | "Critical";
}

export const useInventoryData = (lowStockThreshold = 10) => {
  const { data: inventoryStatus, isLoading } = useQuery({
    queryKey: ['inventory-status'],
    queryFn: async () => {
      try {
        // Optimized query for standard products - fetch only what's needed
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('name, stock')
          .eq('has_variants', false);
          
        if (productsError) {
          console.error("Products fetch error:", productsError);
          throw productsError;
        }
        
        // Optimized query for variants - better join structure
        const { data: variants, error: variantsError } = await supabase
          .from('product_variants')
          .select(`
            stock_count,
            color,
            size,
            flavor,
            products!inner(name)
          `);
          
        if (variantsError) {
          console.error("Variants fetch error:", variantsError);
          throw variantsError;
        }
        
        // Transform and combine data efficiently
        const inventoryItems: InventoryItem[] = [];
        
        // Add standard products to inventory items
        (products || []).forEach(product => {
          let status: "Good" | "Low" | "Critical" = "Good";
          
          if (!product.stock || product.stock <= 0) {
            status = "Critical";
          } else if (product.stock <= lowStockThreshold) {
            status = "Low";
          }
          
          inventoryItems.push({
            product: product.name,
            stock: product.stock || 0,
            reorderLevel: lowStockThreshold,
            status
          });
        });
        
        // Add variants to inventory items
        (variants || []).forEach(variant => {
          if (variant.products?.name) {
            let status: "Good" | "Low" | "Critical" = "Good";
            
            if (!variant.stock_count || variant.stock_count <= 0) {
              status = "Critical";
            } else if (variant.stock_count <= lowStockThreshold) {
              status = "Low";
            }
            
            // Efficiently construct variant display name from attributes
            const variantAttributes = [];
            if (variant.color) variantAttributes.push(variant.color);
            if (variant.size) variantAttributes.push(variant.size);
            if (variant.flavor) variantAttributes.push(variant.flavor);
            
            const variantDisplay = variantAttributes.length > 0 
              ? `${variant.products.name} (${variantAttributes.join(' / ')})`
              : variant.products.name;
              
            inventoryItems.push({
              product: variantDisplay,
              stock: variant.stock_count || 0,
              reorderLevel: lowStockThreshold,
              status
            });
          }
        });
        
        return inventoryItems;
      } catch (error) {
        console.error("Error fetching inventory data:", error);
        toast.error("Failed to load inventory data");
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    inventoryStatus: inventoryStatus || [],
    isLoading
  };
};
