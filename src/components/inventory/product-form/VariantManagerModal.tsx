
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProductVariantsManager } from '../ProductVariantsManager';
import { Product } from '@/types';

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
  if (!product) return null;

  return (
    <Dialog open={showVariantsManager} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Manage Variants: {product.name}</DialogTitle>
        </DialogHeader>
        <ProductVariantsManager 
          product={product} 
          onClose={onClose} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default VariantManagerModal;
