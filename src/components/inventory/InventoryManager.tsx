
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import {
  Grid,
  PlusCircle,
  Package,
  Grid3X3
} from "lucide-react";
import EnhancedProductVariantsManager from "./EnhancedProductVariantsManager";
import ProductVariantsManager from "./ProductVariantsManager";

interface InventoryManagerProps {
  product: Product;
  onProductUpdated: () => void;
}

const InventoryManager: React.FC<InventoryManagerProps> = ({
  product,
  onProductUpdated
}) => {
  const [showEnhancedVariantsManager, setShowEnhancedVariantsManager] = useState(false);
  const [showLegacyVariantsManager, setShowLegacyVariantsManager] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setShowEnhancedVariantsManager(true)}
        >
          <Grid3X3 className="h-4 w-4" />
          <span>Advanced Variant Manager</span>
        </Button>
        
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setShowLegacyVariantsManager(true)}
        >
          <Package className="h-4 w-4" />
          <span>Simple Variant Manager</span>
        </Button>
      </div>

      {/* Enhanced (New) Variants Manager */}
      {showEnhancedVariantsManager && (
        <EnhancedProductVariantsManager
          product={product}
          onClose={() => setShowEnhancedVariantsManager(false)}
          onProductUpdated={onProductUpdated}
        />
      )}
      
      {/* Legacy (Original) Variants Manager */}
      {showLegacyVariantsManager && (
        <ProductVariantsManager
          product={product}
          onClose={() => setShowLegacyVariantsManager(false)}
        />
      )}
    </div>
  );
};

export default InventoryManager;
