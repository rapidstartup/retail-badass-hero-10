
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Package } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

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
          <div className="flex items-center justify-center h-[200px]">
            <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            {totalLowStockItems > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Low Stock Alert</AlertTitle>
                <AlertDescription>
                  {totalLowStockItems} {totalLowStockItems === 1 ? 'item is' : 'items are'} low on stock.
                </AlertDescription>
              </Alert>
            )}
            
            {/* Standard Products (without variants) */}
            <div>
              <h3 className="text-sm font-medium mb-2">Standard Products</h3>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {standardProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                          No standard products found
                        </TableCell>
                      </TableRow>
                    ) : (
                      standardProducts.slice(0, 5).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.category || "Uncategorized"}</TableCell>
                          <TableCell>{formatCurrency(item.price)}</TableCell>
                          <TableCell>{item.stock ?? 0}</TableCell>
                          <TableCell>
                            {item.stock === null || item.stock <= 0 ? (
                              <Badge variant="destructive">Out of Stock</Badge>
                            ) : item.stock <= lowStockThreshold ? (
                              <Badge variant="destructive">Low Stock</Badge>
                            ) : (
                              <Badge variant="default">In Stock</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            
            {/* Product Variants */}
            {showVariants && (
              <div>
                <h3 className="text-sm font-medium mb-2">Product Variants</h3>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Variant</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {variants.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                            No variants found
                          </TableCell>
                        </TableRow>
                      ) : (
                        variants.slice(0, 5).map((variant) => {
                          // Construct variant display name from attributes
                          const variantAttributes = [];
                          if (variant.color) variantAttributes.push(variant.color);
                          if (variant.size) variantAttributes.push(variant.size);
                          if (variant.flavor) variantAttributes.push(variant.flavor);
                          
                          const variantDisplay = variantAttributes.length > 0 
                            ? variantAttributes.join(' / ') 
                            : 'Default';
                            
                          return (
                            <TableRow key={variant.id}>
                              <TableCell className="font-medium">{variant.product_name}</TableCell>
                              <TableCell>{variantDisplay}</TableCell>
                              <TableCell>{variant.sku || "N/A"}</TableCell>
                              <TableCell>{formatCurrency(variant.price)}</TableCell>
                              <TableCell>{variant.stock_count ?? 0}</TableCell>
                              <TableCell>
                                {variant.stock_count === null || variant.stock_count <= 0 ? (
                                  <Badge variant="destructive">Out of Stock</Badge>
                                ) : variant.stock_count <= lowStockThreshold ? (
                                  <Badge variant="destructive">Low Stock</Badge>
                                ) : (
                                  <Badge variant="default">In Stock</Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
