
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingCart } from "lucide-react";
import { ProductVariant, Product } from "@/hooks/pos/types/cartTypes";
import VariantOptions from "./VariantOptions";
import VariantDetails from "./VariantDetails";
import LoadingSpinner from "./LoadingSpinner";

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
  
  // Helper function to check if variant attribute exists
  const hasAttribute = (attribute: 'color' | 'size' | 'flavor'): boolean => {
    return variants.some(variant => variant[attribute] !== null && variant[attribute] !== undefined);
  };
  
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
  
  // Handle option change 
  const handleOptionChange = (attribute: 'color' | 'size' | 'flavor', value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [attribute]: value
    }));
  };
  
  const selectedVariant = findSelectedVariant();
  const isOutOfStock = selectedVariant?.stock_count !== null && selectedVariant?.stock_count <= 0;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 py-4">
          {loading ? (
            <LoadingSpinner />
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
              
              {/* Variant selection options */}
              <VariantOptions 
                hasAttribute={hasAttribute}
                getUniqueOptions={getUniqueOptions}
                selectedOptions={selectedOptions}
                handleOptionChange={handleOptionChange}
              />
              
              {/* Selected variant details */}
              {selectedVariant && (
                <VariantDetails variant={selectedVariant} />
              )}
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
