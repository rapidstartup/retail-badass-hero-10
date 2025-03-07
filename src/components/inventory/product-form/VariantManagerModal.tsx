import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, Save } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Product, ProductVariant } from '@/types';

// Define types for our component
interface Variant {
  id?: string;
  name: string;
  price: number;
  sku: string;
  stock: number;
}

interface VariantManagerModalProps {
  product: Product | null;
  showVariantsManager: boolean;
  onClose: () => void;
}

const VariantManagerModal: React.FC<VariantManagerModalProps> = ({
  product,
  showVariantsManager,
  onClose
}) => {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [newVariant, setNewVariant] = useState<Variant>({
    name: '',
    price: 0,
    sku: '',
    stock: 0
  });

  // Load existing variants when product changes
  useEffect(() => {
    if (product && product.has_variants) {
      // In a real implementation, we would fetch variants from the API
      // For now, just initialize with empty array
      setVariants([]);
    } else {
      setVariants([]);
    }
  }, [product]);

  const handleAddVariant = () => {
    if (newVariant.name.trim() === '') return;
    
    setVariants([...variants, { 
      ...newVariant, 
      id: `temp-${Date.now()}` // temporary ID until saved to backend
    }]);
    
    // Reset the new variant form
    setNewVariant({
      name: '',
      price: 0,
      sku: '',
      stock: 0
    });
  };

  const handleRemoveVariant = (index: number) => {
    const updatedVariants = [...variants];
    updatedVariants.splice(index, 1);
    setVariants(updatedVariants);
  };

  const handleVariantChange = (index: number, field: keyof Variant, value: string | number) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value
    };
    setVariants(updatedVariants);
  };

  const handleNewVariantChange = (field: keyof Variant, value: string | number) => {
    setNewVariant({
      ...newVariant,
      [field]: value
    });
  };

  const handleSaveVariants = () => {
    // Here you would typically send the variants to your backend
    // For now, we'll just close the modal
    onClose();
  };

  if (!product) return null;

  return (
    <Dialog open={showVariantsManager} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Manage Product Variants: {product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div className="grid grid-cols-12 gap-2 font-medium text-sm">
            <div className="col-span-4">Variant Name</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-3">SKU</div>
            <div className="col-span-2">Stock</div>
            <div className="col-span-1"></div>
          </div>
          
          {/* Existing variants */}
          {variants.map((variant, index) => (
            <div key={variant.id || index} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-4">
                <Input 
                  value={variant.name} 
                  onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Input 
                  type="number" 
                  value={variant.price} 
                  onChange={(e) => handleVariantChange(index, 'price', parseFloat(e.target.value))}
                />
              </div>
              <div className="col-span-3">
                <Input 
                  value={variant.sku} 
                  onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Input 
                  type="number" 
                  value={variant.stock} 
                  onChange={(e) => handleVariantChange(index, 'stock', parseInt(e.target.value))}
                />
              </div>
              <div className="col-span-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleRemoveVariant(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {/* New variant form */}
          <Card className="border-dashed border-2">
            <CardContent className="pt-4">
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">
                  <Input 
                    placeholder="New variant name"
                    value={newVariant.name} 
                    onChange={(e) => handleNewVariantChange('name', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <Input 
                    type="number" 
                    placeholder="Price"
                    value={newVariant.price || ''} 
                    onChange={(e) => handleNewVariantChange('price', parseFloat(e.target.value))}
                  />
                </div>
                <div className="col-span-3">
                  <Input 
                    placeholder="SKU"
                    value={newVariant.sku} 
                    onChange={(e) => handleNewVariantChange('sku', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <Input 
                    type="number" 
                    placeholder="Stock"
                    value={newVariant.stock || ''} 
                    onChange={(e) => handleNewVariantChange('stock', parseInt(e.target.value))}
                  />
                </div>
                <div className="col-span-1">
                  <Button variant="ghost" size="icon" onClick={handleAddVariant}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSaveVariants}>
            <Save className="mr-2 h-4 w-4" />
            Save Variants
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VariantManagerModal;
