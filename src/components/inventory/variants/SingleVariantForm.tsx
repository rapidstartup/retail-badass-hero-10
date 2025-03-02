
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, RefreshCw } from "lucide-react";
import { ProductVariant } from "@/api/inventoryApi";

interface SingleVariantFormProps {
  newVariant: ProductVariant;
  setNewVariant: (variant: ProductVariant) => void;
  handleCreateVariant: (variantData: Omit<ProductVariant, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  creatingVariant: boolean;
}

const SingleVariantForm = ({
  newVariant,
  setNewVariant,
  handleCreateVariant,
  creatingVariant
}: SingleVariantFormProps) => {
  return (
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
          onClick={() => {
            const variantData = {
              product_id: newVariant.product_id,
              sku: newVariant.sku,
              color: newVariant.color,
              size: newVariant.size,
              price: newVariant.price,
              stock_count: newVariant.stock_count,
              variant_attributes: newVariant.variant_attributes || {}
            };
            handleCreateVariant(variantData);
          }} 
          className="w-full"
          disabled={creatingVariant}
        >
          {creatingVariant ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Create Variant
        </Button>
      </div>
    </div>
  );
};

export default SingleVariantForm;
