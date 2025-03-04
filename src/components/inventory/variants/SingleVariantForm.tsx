
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, RefreshCw } from "lucide-react";
import { ProductVariant } from "@/api/types/variantTypes";

interface SingleVariantFormProps {
  newVariant: ProductVariant;
  setNewVariant: (variant: ProductVariant) => void;
  handleCreateVariant: (variantData: Omit<ProductVariant, 'id' | 'created_at' | 'updated_at'>) => Promise<ProductVariant | null>;
  creatingVariant: boolean;
}

const SingleVariantForm = ({
  newVariant,
  setNewVariant,
  handleCreateVariant,
  creatingVariant
}: SingleVariantFormProps) => {
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newVariant.price || isNaN(Number(newVariant.price))) {
      // Use sonner toast for error message
      console.error("Valid price is required");
      return;
    }
    
    const variantData = {
      product_id: newVariant.product_id,
      sku: newVariant.sku || null,
      color: newVariant.color || null,
      size: newVariant.size || null,
      flavor: newVariant.flavor || null,
      price: Number(newVariant.price),
      stock_count: Number(newVariant.stock_count) || 0,
      variant_attributes: newVariant.variant_attributes || {}
    };
    
    await handleCreateVariant(variantData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <label className="text-sm font-medium">Flavor</label>
        <Input
          placeholder="Flavor"
          value={newVariant.flavor || ""}
          onChange={(e) => setNewVariant({...newVariant, flavor: e.target.value})}
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
          required
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
      
      <div className="space-y-2 md:col-span-3 flex items-end">
        <Button 
          type="submit"
          className="w-full"
          disabled={creatingVariant}
        >
          {creatingVariant ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Create Variant
        </Button>
      </div>
    </form>
  );
};

export default SingleVariantForm;
