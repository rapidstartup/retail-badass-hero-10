
import React from 'react';
import { Product } from '@/types';
import ProductVariantsManager from '../ProductVariantsManager';

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
  if (!showVariantsManager || !product) return null;
  
  return (
    <ProductVariantsManager 
      product={product} 
      onClose={onClose} 
    />
  );
};

export default VariantManagerModal;
