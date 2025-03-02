
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MinusCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEFAULT_COLORS, DEFAULT_SIZES } from "@/types/inventory";

interface VariantFieldProps {
  index: number;
  sku: string;
  color: string;
  size: string;
  stock: number;
  price: number;
  onUpdate: (index: number, field: string, value: string | number) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

const VariantField: React.FC<VariantFieldProps> = ({
  index,
  sku,
  color,
  size,
  stock,
  price,
  onUpdate,
  onRemove,
  canRemove
}) => {
  return (
    <div className="border p-4 rounded-md mb-4 relative">
      <div className="absolute top-2 right-2">
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemove(index)}
            className="h-8 w-8"
          >
            <MinusCircle className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="space-y-2">
          <Label htmlFor={`variant-sku-${index}`}>SKU</Label>
          <Input
            id={`variant-sku-${index}`}
            value={sku}
            onChange={(e) => onUpdate(index, 'sku', e.target.value)}
            placeholder="SKU-001-RED-SM"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`variant-color-${index}`}>Color</Label>
          <Select
            value={color}
            onValueChange={(value) => onUpdate(index, 'color', value)}
          >
            <SelectTrigger id={`variant-color-${index}`}>
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent>
              {DEFAULT_COLORS.map((colorOption) => (
                <SelectItem key={colorOption.value} value={colorOption.value}>
                  {colorOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`variant-size-${index}`}>Size</Label>
          <Select
            value={size}
            onValueChange={(value) => onUpdate(index, 'size', value)}
          >
            <SelectTrigger id={`variant-size-${index}`}>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {DEFAULT_SIZES.map((sizeOption) => (
                <SelectItem key={sizeOption.value} value={sizeOption.value}>
                  {sizeOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`variant-stock-${index}`}>Stock</Label>
          <Input
            id={`variant-stock-${index}`}
            type="number"
            min="0"
            value={stock}
            onChange={(e) => onUpdate(index, 'stock_count', parseInt(e.target.value))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`variant-price-${index}`}>Price</Label>
          <Input
            id={`variant-price-${index}`}
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => onUpdate(index, 'price', parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default VariantField;
