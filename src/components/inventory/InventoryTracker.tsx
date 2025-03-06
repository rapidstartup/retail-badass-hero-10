
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
  
  // Function to fetch inventory data
  const fetchInventory = async () => {
    try {
      setLoading(true);
      
      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .order("name");
        
      if (productsError) throw productsError;
      
      // Fetch variants if enabled
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
            products(name)
          `)
          .order("product_id");
          
        if (variantsError) throw variantsError;
        
        // Transform the variants data to include product name
        const transformedVariants = variantsData.map(variant => ({
          ...variant,
          product_name: variant.products?.name || "Unknown Product"
        }));
        
        setVariants(transformedVariants || []);
      }
      
      setProducts(productsData || []);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchInventory();
  }, [showVariants]);
  
  // Set up realtime subscription for inventory updates
  useEffect(() => {
    const productsChannel = supabase
      .channel('public:products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, 
        () => {
          fetchInventory();
        }
      )
      .subscribe();
      
    const variantsChannel = supabase
      .channel('public:product_variants')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'product_variants' }, 
        () => {
          if (showVariants) {
            fetchInventory();
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(variantsChannel);
    };
  }, [showVariants]);
  
  const handleRefresh = () => {
    fetchInventory();
  };
  
  // Filter products to only show those without variants or that don't have the has_variants flag
  const standardProducts = products.filter(product => !product.has_variants);
  
  // Filter for products with low stock
  const lowStockProducts = standardProducts.filter(item => 
    item.stock !== null && item.stock <= lowStockThreshold
  );
  
  // Filter for variants with low stock
  const lowStockVariants = variants.filter(variant => 
    variant.stock_count !== null && variant.stock_count <= lowStockThreshold
  );
  
  // Count total low stock items
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
                  products={standardProducts} 
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
