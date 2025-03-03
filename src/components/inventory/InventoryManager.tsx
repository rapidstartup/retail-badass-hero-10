
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import {
  Grid,
  PlusCircle,
  Package,
  Grid3X3
} from "lucide-react";
import ProductVariantsManager from "./ProductVariantsManager";

interface InventoryManagerProps {
  product: Product;
  onProductUpdated: () => void;
}

const InventoryManager: React.FC<InventoryManagerProps> = ({
  product,
  onProductUpdated
}) => {
  const [showVariantsManager, setShowVariantsManager] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setShowVariantsManager(true)}
        >
          <Package className="h-4 w-4" />
          <span>Variant Manager</span>
        </Button>
      </div>

      {/* Variants Manager */}
      {showVariantsManager && (
        <ProductVariantsManager
          product={product}
          onClose={() => setShowVariantsManager(false)}
        />
      )}
    </div>
  );
};

export default InventoryManager;
