
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Save, 
  Trash2, 
  RefreshCw,
  Grid3X3,
  FileText
} from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { Product, ProductVariant } from "@/types";
import { fetchVariantsByProductId, createVariant, updateVariant, deleteVariant } from "@/api/inventoryApi";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";

interface ProductVariantsManagerProps {
  product: Product;
  onClose: () => void;
}

interface BulkGeneratorForm {
  colors: string[];
  sizes: string[];
  basePrice: number;
  baseStock: number;
  priceAdjustments: Record<string, number>;
}

const ProductVariantsManager = ({ product, onClose }: ProductVariantsManagerProps) => {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddVariant, setShowAddVariant] = useState(false);
  const [mode, setMode] = useState<"single" | "bulk">("single");
  
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
  
  const [creatingVariant, setCreatingVariant] = useState(false);

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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Variants for {product.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Product Variants</h3>
              <p className="text-sm text-muted-foreground">
                Manage color, size, and other variants for this product
              </p>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={() => setShowAddVariant(prev => !prev)} 
                className="flex items-center gap-1"
                variant={showAddVariant ? "secondary" : "default"}
              >
                <Plus className="h-4 w-4" />
                {showAddVariant ? "Cancel" : "Add Variant"}
              </Button>
              <Button 
                variant="outline" 
                onClick={fetchVariants}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>

          {showAddVariant && (
            <Tabs defaultValue="single" className="border rounded-md p-4 mb-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="single" onClick={() => setMode("single")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Single Variant
                </TabsTrigger>
                <TabsTrigger value="bulk" onClick={() => setMode("bulk")}>
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  Bulk Generator
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="single" className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">SKU</label>
                    <Input
                      placeholder="SKU"
                      value={newVariant.sku || ""}
                      onChange={(e) => setNewVariant({...newVariant, sku: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground">Leave blank to auto-generate</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Color</label>
                    <Input
                      placeholder="Color"
                      value={newVariant.color || ""}
                      onChange={(e) => setNewVariant({...newVariant, color: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Size</label>
                    <Input
                      placeholder="Size"
                      value={newVariant.size || ""}
                      onChange={(e) => setNewVariant({...newVariant, size: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Price"
                      value={newVariant.price || ""}
                      onChange={(e) => setNewVariant({...newVariant, price: Number(e.target.value)})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Stock</label>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="Stock"
                      value={newVariant.stock_count || ""}
                      onChange={(e) => setNewVariant({...newVariant, stock_count: Number(e.target.value)})}
                    />
                  </div>
                  
                  <div className="space-y-2 flex items-end">
                    <Button 
                      onClick={handleCreateVariant} 
                      className="w-full"
                      disabled={creatingVariant}
                    >
                      {creatingVariant ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                      Create Variant
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="bulk" className="space-y-4 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">SKU Prefix</label>
                      <Input
                        placeholder="SKU Prefix"
                        value={skuPrefix}
                        onChange={(e) => setSkuPrefix(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">Used to generate SKUs like {skuPrefix}-RED-L</p>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Base Price</label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Base Price"
                        value={bulkBasePrice}
                        onChange={(e) => setBulkBasePrice(Number(e.target.value))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Base Stock</label>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Base Stock"
                        value={bulkBaseStock}
                        onChange={(e) => setBulkBaseStock(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Colors</label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add color (e.g. Red)"
                          value={newColorOption}
                          onChange={(e) => setNewColorOption(e.target.value)}
                        />
                        <Button onClick={addColorOption} type="button" size="sm">Add</Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {colorOptions.map(color => (
                          <Badge key={color} variant="secondary" className="flex items-center gap-1">
                            {color}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-4 w-4 p-0 ml-1"
                              onClick={() => removeColorOption(color)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                        {colorOptions.length === 0 && (
                          <p className="text-xs text-muted-foreground">No colors added yet</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sizes</label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add size (e.g. L)"
                          value={newSizeOption}
                          onChange={(e) => setNewSizeOption(e.target.value)}
                        />
                        <Button onClick={addSizeOption} type="button" size="sm">Add</Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {sizeOptions.map(size => (
                          <Badge key={size} variant="secondary" className="flex items-center gap-1">
                            {size}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-4 w-4 p-0 ml-1"
                              onClick={() => removeSizeOption(size)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                        {sizeOptions.length === 0 && (
                          <p className="text-xs text-muted-foreground">No sizes added yet</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    onClick={generateBulkVariants} 
                    className="w-full"
                    disabled={creatingVariant || (colorOptions.length === 0 && sizeOptions.length === 0)}
                  >
                    {creatingVariant ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Grid3X3 className="h-4 w-4 mr-2" />}
                    Generate {(colorOptions.length || 1) * (sizeOptions.length || 1)} Variants
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    This will create a variant for each color/size combination
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          )}

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <RefreshCw className="h-5 w-5 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : variants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No variants found. Add your first variant.
                    </TableCell>
                  </TableRow>
                ) : (
                  variants.map((variant) => (
                    <TableRow key={variant.id}>
                      <TableCell>{variant.sku || "-"}</TableCell>
                      <TableCell>{variant.color || "-"}</TableCell>
                      <TableCell>{variant.size || "-"}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={variant.price || 0}
                          onChange={(e) => handleUpdateVariant(variant.id, { price: Number(e.target.value) })}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          value={variant.stock_count || 0}
                          onChange={(e) => handleUpdateVariant(variant.id, { stock_count: Number(e.target.value) })}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Variant</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this variant? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground"
                                onClick={() => handleDeleteVariant(variant.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductVariantsManager;
