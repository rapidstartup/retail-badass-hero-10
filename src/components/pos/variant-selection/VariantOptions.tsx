
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface VariantOptionsProps {
  hasAttribute: (attribute: 'color' | 'size' | 'flavor') => boolean;
  getUniqueOptions: (attribute: 'color' | 'size' | 'flavor') => string[];
  selectedOptions: {
    color?: string;
    size?: string;
    flavor?: string;
  };
  handleOptionChange: (attribute: 'color' | 'size' | 'flavor', value: string) => void;
}

const VariantOptions: React.FC<VariantOptionsProps> = ({
  hasAttribute,
  getUniqueOptions,
  selectedOptions,
  handleOptionChange
}) => {
  return (
    <div className="space-y-4">
      {/* Color selection */}
      {hasAttribute('color') && (
        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Select 
            value={selectedOptions.color} 
            onValueChange={(value) => handleOptionChange('color', value)}
          >
            <SelectTrigger id="color">
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent>
              {getUniqueOptions('color').map(color => (
                <SelectItem key={color} value={color}>
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {/* Size selection */}
      {hasAttribute('size') && (
        <div className="space-y-2">
          <Label htmlFor="size">Size</Label>
          <Select 
            value={selectedOptions.size} 
            onValueChange={(value) => handleOptionChange('size', value)}
          >
            <SelectTrigger id="size">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {getUniqueOptions('size').map(size => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {/* Flavor selection */}
      {hasAttribute('flavor') && (
        <div className="space-y-2">
          <Label htmlFor="flavor">Flavor</Label>
          <Select 
            value={selectedOptions.flavor} 
            onValueChange={(value) => handleOptionChange('flavor', value)}
          >
            <SelectTrigger id="flavor">
              <SelectValue placeholder="Select flavor" />
            </SelectTrigger>
            <SelectContent>
              {getUniqueOptions('flavor').map(flavor => (
                <SelectItem key={flavor} value={flavor}>
                  {flavor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default VariantOptions;
