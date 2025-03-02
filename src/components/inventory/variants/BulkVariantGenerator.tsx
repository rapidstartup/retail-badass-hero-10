
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Grid3X3, RefreshCw } from "lucide-react";

interface BulkVariantGeneratorProps {
  skuPrefix: string;
  setSkuPrefix: (prefix: string) => void;
  bulkBasePrice: number;
  setBulkBasePrice: (price: number) => void;
  bulkBaseStock: number;
  setBulkBaseStock: (stock: number) => void;
  colorOptions: string[];
  setColorOptions: (colors: string[]) => void;
  sizeOptions: string[];
  setSizeOptions: (sizes: string[]) => void;
  newColorOption: string;
  setNewColorOption: (color: string) => void;
  newSizeOption: string;
  setNewSizeOption: (size: string) => void;
  addColorOption: () => void;
  addSizeOption: () => void;
  removeColorOption: (color: string) => void;
  removeSizeOption: (size: string) => void;
  generateBulkVariants: () => Promise<void>;
  creatingVariant: boolean;
}

const BulkVariantGenerator = ({
  skuPrefix,
  setSkuPrefix,
  bulkBasePrice,
  setBulkBasePrice,
  bulkBaseStock,
  setBulkBaseStock,
  colorOptions,
  newColorOption,
  setNewColorOption,
  sizeOptions,
  newSizeOption,
  setNewSizeOption,
  addColorOption,
  addSizeOption,
  removeColorOption,
  removeSizeOption,
  generateBulkVariants,
  creatingVariant
}: BulkVariantGeneratorProps) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default BulkVariantGenerator;
