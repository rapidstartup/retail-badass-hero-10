
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BulkVariantGeneratorProps {
  skuPrefix: string;
  setSkuPrefix: (prefix: string) => void;
  bulkBasePrice: number;
  setBulkBasePrice: (price: number) => void;
  bulkBaseStock: number;
  setBulkBaseStock: (stock: number) => void;
  colorOptions: string[];
  sizeOptions: string[];
  flavorOptions: string[];
  newColorOption: string;
  setNewColorOption: (color: string) => void;
  newSizeOption: string;
  setNewSizeOption: (size: string) => void;
  newFlavorOption: string;
  setNewFlavorOption: (flavor: string) => void;
  addColorOption: () => void;
  addSizeOption: () => void;
  addFlavorOption: () => void;
  removeColorOption: (color: string) => void;
  removeSizeOption: (size: string) => void;
  removeFlavorOption: (flavor: string) => void;
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
  sizeOptions,
  flavorOptions,
  newColorOption,
  setNewColorOption,
  newSizeOption,
  setNewSizeOption,
  newFlavorOption,
  setNewFlavorOption,
  addColorOption,
  addSizeOption,
  addFlavorOption,
  removeColorOption,
  removeSizeOption,
  removeFlavorOption,
  generateBulkVariants,
  creatingVariant
}: BulkVariantGeneratorProps) => {
  const colorInputRef = React.useRef<HTMLInputElement>(null);
  const sizeInputRef = React.useRef<HTMLInputElement>(null);
  const flavorInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleColorKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addColorOption();
    }
  };
  
  const handleSizeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSizeOption();
    }
  };
  
  const handleFlavorKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFlavorOption();
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">SKU Prefix</label>
          <Input
            placeholder="SKU Prefix"
            value={skuPrefix}
            onChange={(e) => setSkuPrefix(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Used to generate SKUs for all variants</p>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Base Price</label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="Base Price"
            value={bulkBasePrice || ""}
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
            value={bulkBaseStock || ""}
            onChange={(e) => setBulkBaseStock(Number(e.target.value))}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Colors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-3">
              <Input
                ref={colorInputRef}
                placeholder="Add a color"
                value={newColorOption}
                onChange={(e) => setNewColorOption(e.target.value)}
                onKeyDown={handleColorKeyDown}
              />
              <Button 
                size="sm" 
                onClick={() => {
                  addColorOption();
                  colorInputRef.current?.focus();
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <Badge key={color} variant="secondary" className="flex items-center gap-1">
                  {color}
                  <button 
                    onClick={() => removeColorOption(color)}
                    className="ml-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {colorOptions.length === 0 && (
                <p className="text-xs text-muted-foreground">No colors added yet</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Sizes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-3">
              <Input
                ref={sizeInputRef}
                placeholder="Add a size"
                value={newSizeOption}
                onChange={(e) => setNewSizeOption(e.target.value)}
                onKeyDown={handleSizeKeyDown}
              />
              <Button 
                size="sm" 
                onClick={() => {
                  addSizeOption();
                  sizeInputRef.current?.focus();
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {sizeOptions.map((size) => (
                <Badge key={size} variant="secondary" className="flex items-center gap-1">
                  {size}
                  <button 
                    onClick={() => removeSizeOption(size)}
                    className="ml-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {sizeOptions.length === 0 && (
                <p className="text-xs text-muted-foreground">No sizes added yet</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Flavors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-3">
              <Input
                ref={flavorInputRef}
                placeholder="Add a flavor"
                value={newFlavorOption}
                onChange={(e) => setNewFlavorOption(e.target.value)}
                onKeyDown={handleFlavorKeyDown}
              />
              <Button 
                size="sm" 
                onClick={() => {
                  addFlavorOption();
                  flavorInputRef.current?.focus();
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {flavorOptions.map((flavor) => (
                <Badge key={flavor} variant="secondary" className="flex items-center gap-1">
                  {flavor}
                  <button 
                    onClick={() => removeFlavorOption(flavor)}
                    className="ml-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {flavorOptions.length === 0 && (
                <p className="text-xs text-muted-foreground">No flavors added yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Button 
        onClick={generateBulkVariants} 
        className="w-full mt-4"
        disabled={creatingVariant || (colorOptions.length === 0 && sizeOptions.length === 0 && flavorOptions.length === 0)}
      >
        {creatingVariant ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
        Generate Variants
      </Button>
    </div>
  );
};

export default BulkVariantGenerator;
