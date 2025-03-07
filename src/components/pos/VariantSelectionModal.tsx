
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingCart } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string | null;
  image_url?: string | null;
}

interface ProductVariant {
  id: string;
  product_id: string;
  color?: string | null;
  size?: string | null;
  flavor?: string | null;
  price: number;
  stock_count?: number | null;
  sku?: string | null;
}

interface VariantSelectionModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (variantId: string) => void;
}

const VariantSelectionModal: React.FC<VariantSelectionModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart
}) => {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<{
    color?: string;
    size?: string;
    flavor?: string;
  }>({});
  
  // Fetch variants for the selected product
  useEffect(() => {
    const fetchVariants = async () => {
      if (!product?.id) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("product_variants")
          .select("*")
          .eq("product_id", product.id);
          
        if (error) {
          console.error("Error fetching variants:", error);
          return;
        }
        
        setVariants(data || []);
        
        // Set initial selected options
        if (data && data.length > 0) {
          const options: Record<string, string> = {};
          if (data.some(v => v.color)) {
            options.color = data[0].color || undefined;
          }
          if (data.some(v => v.size)) {
            options.size = data[0].size || undefined;
          }
          if (data.some(v => v.flavor)) {
            options.flavor = data[0].flavor || undefined;
          }
          setSelectedOptions(options);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (isOpen && product) {
      fetchVariants();
    }
  }, [isOpen, product]);
  
  // Get unique options for each variant attribute
  const getUniqueOptions = (attribute: 'color' | 'size' | 'flavor') => {
    const options = variants
      .map(variant => variant[attribute])
      .filter((value, index, self) => 
        value !== null && value !== undefined && self.indexOf(value) === index
      );
    return options as string[];
  };
  
  // Find the selected variant based on the selected options
  const findSelectedVariant = (): ProductVariant | undefined => {
    return variants.find(variant => {
      const matchesColor = !selectedOptions.color || variant.color === selectedOptions.color;
      const matchesSize = !selectedOptions.size || variant.size === selectedOptions.size;
      const matchesFlavor = !selectedOptions.flavor || variant.flavor === selectedOptions.flavor;
      return matchesColor && matchesSize && matchesFlavor;
    });
  };
  
  const selectedVariant = findSelectedVariant();
  const isOutOfStock = selectedVariant?.stock_count !== null && selectedVariant?.stock_count <= 0;
  
  // Handle option change 
  const handleOptionChange = (attribute: 'color' | 'size' | 'flavor', value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [attribute]: value
    }));
  };
  
  // Check if variant attribute exists in any variant
  const hasAttribute = (attribute: 'color' | 'size' | 'flavor'): boolean => {
    return variants.some(variant => variant[attribute] !== null && variant[attribute] !== undefined);
  };
  
  const colors = getUniqueOptions('color');
  const sizes = getUniqueOptions('size');
  const flavors = getUniqueOptions('flavor');
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 py-4">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <>
              {/* Product image if available */}
              {product.image_url && (
                <div className="flex justify-center">
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-40 h-40 object-cover rounded-lg"
                  />
                </div>
              )}
              
              {/* Variant selection */}
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
                        {colors.map(color => (
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
                        {sizes.map(size => (
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
                        {flavors.map(flavor => (
                          <SelectItem key={flavor} value={flavor}>
                            {flavor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {/* Selected variant details */}
                {selectedVariant && (
                  <div className="pt-4 space-y-2 border-t">
                    <div className="flex justify-between">
                      <span className="font-medium">Price:</span>
                      <span>{formatCurrency(selectedVariant.price)}</span>
                    </div>
                    
                    {selectedVariant.stock_count !== null && (
                      <div className="flex justify-between">
                        <span className="font-medium">Stock:</span>
                        <span className={selectedVariant.stock_count <= 5 ? "text-red-500 font-medium" : ""}>
                          {selectedVariant.stock_count} available
                        </span>
                      </div>
                    )}
                    
                    {selectedVariant.sku && (
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>SKU:</span>
                        <span>{selectedVariant.sku}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={() => selectedVariant && onAddToCart(selectedVariant.id)}
            disabled={!selectedVariant || isOutOfStock || loading}
            className="gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VariantSelectionModal;
