
import React, { useState } from "react";
import { useProducts } from "@/contexts/ProductContext";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCw, Save, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";
import { adjustProductStock, adjustVariantStock, fetchVariantsByProductId, ProductVariant } from "@/api/inventoryApi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const InventoryAdjustments = () => {
  const { products, loading, refreshProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [stockAdjustments, setStockAdjustments] = useState<Record<string, number>>({});
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [variantAdjustments, setVariantAdjustments] = useState<Record<string, number>>({});
  const [loadingVariants, setLoadingVariants] = useState(false);
  
  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.barcode && product.barcode.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleStockChange = (productId: string, newValue: number) => {
    setStockAdjustments({
      ...stockAdjustments,
      [productId]: newValue
    });
  };
  
  const handleVariantStockChange = (variantId: string, newValue: number) => {
    setVariantAdjustments({
      ...variantAdjustments,
      [variantId]: newValue
    });
  };
  
  const handleSaveStock = async (productId: string, stock: number) => {
    const success = await adjustProductStock(productId, stock);
    if (success) {
      // Remove from adjustments after saving
      const { [productId]: _, ...rest } = stockAdjustments;
      setStockAdjustments(rest);
      refreshProducts();
    }
  };
  
  const handleSaveVariantStock = async (variantId: string, stock: number) => {
    const success = await adjustVariantStock(variantId, stock);
    if (success) {
      // Remove from adjustments after saving
      const { [variantId]: _, ...rest } = variantAdjustments;
      setVariantAdjustments(rest);
      // Refresh variants
      if (selectedProduct) {
        loadVariants(selectedProduct);
      }
    }
  };
  
  const loadVariants = async (productId: string) => {
    setLoadingVariants(true);
    try {
      const data = await fetchVariantsByProductId(productId);
      setVariants(data);
    } catch (error) {
      console.error("Error loading variants:", error);
    } finally {
      setLoadingVariants(false);
    }
  };
  
  const handleSelectProduct = (productId: string) => {
    setSelectedProduct(productId);
    loadVariants(productId);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Package className="h-5 w-5" />
          <h2 className="text-xl font-bold">Inventory Adjustments</h2>
        </div>
        <Button variant="outline" onClick={refreshProducts} className="flex items-center gap-1">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      <Input
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
      />
      
      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">Standard Products</TabsTrigger>
          <TabsTrigger value="variants" disabled={!selectedProduct}>Product Variants</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>New Stock</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <RefreshCw className="h-5 w-5 animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No products found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          {product.name}
                          {product.has_variants && (
                            <Button 
                              variant="link" 
                              onClick={() => handleSelectProduct(product.id)}
                              className="p-0 h-auto text-sm ml-2"
                            >
                              View Variants
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>{product.sku || "—"}</TableCell>
                        <TableCell>{formatCurrency(product.price)}</TableCell>
                        <TableCell>
                          {product.has_variants ? (
                            <Badge variant="outline">Has variants</Badge>
                          ) : (
                            product.stock ?? 0
                          )}
                        </TableCell>
                        <TableCell>
                          {!product.has_variants && (
                            <Input
                              type="number"
                              min="0"
                              value={stockAdjustments[product.id] ?? product.stock ?? 0}
                              onChange={(e) => handleStockChange(product.id, Number(e.target.value))}
                              className="w-24"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {!product.has_variants && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleSaveStock(product.id, stockAdjustments[product.id] ?? product.stock ?? 0)}
                              disabled={!(product.id in stockAdjustments)}
                              className="flex items-center gap-1"
                            >
                              <Save className="h-3 w-3" />
                              Save
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="variants" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">
              {selectedProduct && products.find(p => p.id === selectedProduct)?.name} Variants
            </h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => selectedProduct && loadVariants(selectedProduct)}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              Refresh Variants
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>New Stock</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingVariants ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        <RefreshCw className="h-5 w-5 animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : variants.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No variants found for this product.
                      </TableCell>
                    </TableRow>
                  ) : (
                    variants.map((variant) => (
                      <TableRow key={variant.id}>
                        <TableCell>{variant.sku || "—"}</TableCell>
                        <TableCell>{variant.color || "—"}</TableCell>
                        <TableCell>{variant.size || "—"}</TableCell>
                        <TableCell>{formatCurrency(variant.price || 0)}</TableCell>
                        <TableCell>{variant.stock_count ?? 0}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            value={variantAdjustments[variant.id] ?? variant.stock_count ?? 0}
                            onChange={(e) => handleVariantStockChange(variant.id, Number(e.target.value))}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleSaveVariantStock(variant.id, variantAdjustments[variant.id] ?? variant.stock_count ?? 0)}
                            disabled={!(variant.id in variantAdjustments)}
                            className="flex items-center gap-1"
                          >
                            <Save className="h-3 w-3" />
                            Save
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryAdjustments;
