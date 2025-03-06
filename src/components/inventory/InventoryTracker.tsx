
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Package } from "lucide-react";
import StandardProductTable from "./tables/StandardProductTable";
import VariantProductTable from "./tables/VariantProductTable";
import LowStockAlert from "./alerts/LowStockAlert";
import SectionHeader from "./ui/SectionHeader";
import LoadingIndicator from "./ui/LoadingIndicator";
import { toast } from "sonner";

interface InventoryTrackerProps {
  lowStockThreshold?: number;
  showVariants?: boolean;
}

interface ProductItem {
  id: string;
  name: string;
  price: number;
  category: string | null;
  stock: number | null;
  has_variants: boolean;
}

interface VariantItem {
  id: string;
  product_id: string;
  sku: string | null;
  price: number;
  stock_count: number | null;
  color: string | null;
  size: string | null;
  flavor: string | null;
  product_name: string;
}

export function InventoryTracker({ 
  lowStockThreshold = 5, 
  showVariants = true 
}: InventoryTrackerProps) {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [variants, setVariants] = useState<VariantItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Optimized function to fetch inventory data - reduced data fetching and improved query structure
  const fetchInventory = async () => {
    try {
      setLoading(true);
      
      // Fetch only standard products (without variants) - optimized query
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("id, name, price, category, stock, has_variants")
        .eq("has_variants", false)
        .order("name");
        
      if (productsError) {
        console.error("Error fetching products:", productsError);
        toast.error("Failed to load products");
        throw productsError;
      }
      
      // Fetch variants if enabled - optimized with a more targeted join
      if (showVariants) {
        const { data: variantsData, error: variantsError } = await supabase
          .from("product_variants")
          .select(`
            id, 
            product_id, 
            sku, 
            price, 
            stock_count, 
            color, 
            size, 
            flavor,
            products!inner(name)
          `)
          .order("product_id");
          
        if (variantsError) {
          console.error("Error fetching variants:", variantsError);
          toast.error("Failed to load product variants");
          throw variantsError;
        }
        
        // Transform the variants data to include product name
        const transformedVariants = (variantsData || []).map(variant => ({
          ...variant,
          product_name: variant.products?.name || "Unknown Product"
        }));
        
        setVariants(transformedVariants);
      } else {
        setVariants([]);
      }
      
      setProducts(productsData || []);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      toast.error("Failed to load inventory data");
    } finally {
      setLoading(false);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchInventory();
  }, [showVariants]);
  
  // Set up realtime subscription for inventory updates - optimized to use specific channel names
  useEffect(() => {
    // Subscribe to product changes only for standard products
    const productsChannel = supabase
      .channel('products-inventory-tracker')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'products', filter: 'has_variants=eq.false' }, 
        () => {
          console.log("Products changed, refreshing inventory");
          fetchInventory();
        }
      )
      .subscribe();
      
    // Subscribe to variant changes only if we're showing variants
    let variantsChannel;
    if (showVariants) {
      variantsChannel = supabase
        .channel('variants-inventory-tracker')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'product_variants' }, 
          () => {
            console.log("Variants changed, refreshing inventory");
            fetchInventory();
          }
        )
        .subscribe();
    }
      
    return () => {
      supabase.removeChannel(productsChannel);
      if (variantsChannel) {
        supabase.removeChannel(variantsChannel);
      }
    };
  }, [showVariants]);
  
  const handleRefresh = () => {
    fetchInventory();
  };
  
  // Filter for products with low stock - no change needed
  const lowStockProducts = products.filter(item => 
    item.stock !== null && item.stock <= lowStockThreshold
  );
  
  // Filter for variants with low stock - no change needed
  const lowStockVariants = variants.filter(variant => 
    variant.stock_count !== null && variant.stock_count <= lowStockThreshold
  );
  
  // Count total low stock items - no change needed
  const totalLowStockItems = lowStockProducts.length + lowStockVariants.length;
  
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center">
          <Package className="h-5 w-5 mr-2" />
          Inventory Status
        </CardTitle>
        <Button variant="outline" size="icon" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoadingIndicator />
        ) : (
          <div className="space-y-4">
            <LowStockAlert totalLowStockItems={totalLowStockItems} />
            
            {/* Standard Products (without variants) */}
            <div>
              <SectionHeader title="Standard Products" />
              <div className="border rounded-md">
                <StandardProductTable 
                  products={products} 
                  lowStockThreshold={lowStockThreshold}
                  loading={loading}
                />
              </div>
            </div>
            
            {/* Product Variants */}
            {showVariants && (
              <div>
                <SectionHeader title="Product Variants" />
                <div className="border rounded-md">
                  <VariantProductTable 
                    variants={variants} 
                    lowStockThreshold={lowStockThreshold} 
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
