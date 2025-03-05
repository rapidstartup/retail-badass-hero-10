
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
        // Fetch products data
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('name');
          
        if (productsError) throw productsError;
        
        // Fetch product variants data
        const { data: variants, error: variantsError } = await supabase
          .from('product_variants')
          .select('*, products(name)')
          .order('product_id');
          
        if (variantsError) throw variantsError;
        
        // Transform product data into the format needed for the inventory table
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
        
        // Add variant data if it exists
        variants.forEach(variant => {
          if (variant.products && variant.products.name) {
            let status: "Good" | "Low" | "Critical" = "Good";
            
            if (variant.stock_count <= 0) {
              status = "Critical";
            } else if (variant.stock_count <= lowStockThreshold) {
              status = "Low";
            }
            
            const variantName = `${variant.products.name} - ${variant.color || ''} ${variant.size || ''}`.trim();
            inventoryItems.push({
              product: variantName,
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
