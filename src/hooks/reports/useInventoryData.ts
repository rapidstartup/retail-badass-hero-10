
import { useState, useEffect } from "react";
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
        // Fetch products with no variants
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('has_variants', false)
          .order('name');
          
        if (productsError) throw productsError;
        
        // Fetch product variants
        const { data: variants, error: variantsError } = await supabase
          .from('product_variants')
          .select('*, products(name)')
          .order('product_id');
          
        if (variantsError) throw variantsError;
        
        // Transform standard products data
        const inventoryItems: InventoryItem[] = products.map(product => {
          // Determine status based on stock levels
          let status: "Good" | "Low" | "Critical" = "Good";
          
          if (product.stock <= 0) {
            status = "Critical";
          } else if (product.stock <= lowStockThreshold) {
            status = "Low";
          }
          
          return {
            product: product.name,
            stock: product.stock || 0,
            reorderLevel: lowStockThreshold,
            status
          };
        });
        
        // Add variant data
        variants.forEach(variant => {
          if (variant.products && variant.products.name) {
            let status: "Good" | "Low" | "Critical" = "Good";
            
            if (variant.stock_count <= 0) {
              status = "Critical";
            } else if (variant.stock_count <= lowStockThreshold) {
              status = "Low";
            }
            
            // Construct variant display name from attributes
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
