
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

export function InventoryTracker({ 
  lowStockThreshold = 5, 
  showVariants = true 
}: InventoryTrackerProps) {
  const [inventory, setInventory] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
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
          .select("*, products(name)")
          .order("product_id");
          
        if (variantsError) throw variantsError;
        setVariants(variantsData || []);
      }
      
      setInventory(productsData || []);
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
  
  // Filter low stock items
  const lowStockItems = inventory.filter(item => item.stock <= lowStockThreshold);
  const lowStockVariants = variants.filter(variant => variant.stock_count <= lowStockThreshold);
  
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
            {lowStockItems.length > 0 || (showVariants && lowStockVariants.length > 0) ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Low Stock Alert</AlertTitle>
                <AlertDescription>
                  {lowStockItems.length} products and {showVariants ? lowStockVariants.length : 0} variants are low on stock.
                </AlertDescription>
              </Alert>
            ) : null}
            
            <div>
              <h3 className="text-sm font-medium mb-2">Product Inventory</h3>
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
                    {inventory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                          No products found
                        </TableCell>
                      </TableRow>
                    ) : (
                      inventory.slice(0, 5).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.category || "Uncategorized"}</TableCell>
                          <TableCell>{formatCurrency(item.price)}</TableCell>
                          <TableCell>{item.stock}</TableCell>
                          <TableCell>
                            {item.stock <= 0 ? (
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
            
            {showVariants && (
              <div>
                <h3 className="text-sm font-medium mb-2">Variant Inventory</h3>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Variant</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {variants.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                            No variants found
                          </TableCell>
                        </TableRow>
                      ) : (
                        variants.slice(0, 5).map((variant) => (
                          <TableRow key={variant.id}>
                            <TableCell className="font-medium">{variant.products?.name || "Unknown"}</TableCell>
                            <TableCell>
                              {variant.color && variant.size
                                ? `${variant.color} / ${variant.size}`
                                : variant.color || variant.size || "Default"}
                            </TableCell>
                            <TableCell>{variant.sku || "N/A"}</TableCell>
                            <TableCell>{variant.stock_count}</TableCell>
                            <TableCell>
                              {variant.stock_count <= 0 ? (
                                <Badge variant="destructive">Out of Stock</Badge>
                              ) : variant.stock_count <= lowStockThreshold ? (
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
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
