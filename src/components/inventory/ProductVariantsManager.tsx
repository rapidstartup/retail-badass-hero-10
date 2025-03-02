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
  RefreshCw 
} from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { Product, ProductVariant, fetchVariantsByProductId, createVariant, updateVariant, deleteVariant } from "@/api/inventoryApi";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ProductVariantsManagerProps {
  product: Product;
  onClose: () => void;
}

const ProductVariantsManager = ({ product, onClose }: ProductVariantsManagerProps) => {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddVariant, setShowAddVariant] = useState(false);
  const [newVariant, setNewVariant] = useState<ProductVariant>({
    id: '',
    product_id: product.id,
    sku: "",
    color: "",
    size: "",
    price: product.price,
    stock_count: 0,
    variant_attributes: {}
  });
  const [creatingVariant, setCreatingVariant] = useState(false);

  const fetchVariants = async () => {
    setLoading(true);
    try {
      const data = await fetchVariantsByProductId(product.id);
      setVariants(data);
    } catch (error) {
      console.error("Error fetching variants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVariants();
  }, [product.id]);

  const handleCreateVariant = async () => {
    if (!newVariant.sku) {
      toast.error("SKU is required for variant");
      return;
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
        variant_attributes: {}
      });
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
                onClick={() => setShowAddVariant(true)} 
                className="flex items-center gap-1"
                disabled={showAddVariant}
              >
                <Plus className="h-4 w-4" />
                Add Variant
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

          {/* Variants Table */}
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

                {/* Add Variant Form Row */}
                {showAddVariant && (
                  <TableRow>
                    <TableCell>
                      <Input
                        placeholder="SKU"
                        value={newVariant.sku || ""}
                        onChange={(e) => setNewVariant({...newVariant, sku: e.target.value})}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="Color"
                        value={newVariant.color || ""}
                        onChange={(e) => setNewVariant({...newVariant, color: e.target.value})}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="Size"
                        value={newVariant.size || ""}
                        onChange={(e) => setNewVariant({...newVariant, size: e.target.value})}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Price"
                        value={newVariant.price || ""}
                        onChange={(e) => setNewVariant({...newVariant, price: Number(e.target.value)})}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Stock"
                        value={newVariant.stock_count || ""}
                        onChange={(e) => setNewVariant({...newVariant, stock_count: Number(e.target.value)})}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          onClick={handleCreateVariant} 
                          size="icon" 
                          variant="default"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => setShowAddVariant(false)}
                          size="icon"
                          variant="outline"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
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
