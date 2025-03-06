
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

interface VariantManagerActionsProps {
  showAddVariant: boolean;
  setShowAddVariant: (show: boolean) => void;
  resetForm: () => void;
  initializeBulkGenerator: () => void;
  fetchVariants: () => Promise<any>;
}

const VariantManagerActions = ({ 
  showAddVariant, 
  setShowAddVariant, 
  resetForm, 
  initializeBulkGenerator,
  fetchVariants 
}: VariantManagerActionsProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-lg font-medium">Product Variants</h3>
        <p className="text-sm text-muted-foreground">
          Manage color, size, flavor, and other variants for this product
        </p>
      </div>
      <div className="flex space-x-2">
        <Button 
          onClick={() => {
            setShowAddVariant(prev => !prev);
            if (!showAddVariant) {
              resetForm();
              initializeBulkGenerator();
            }
          }} 
          className="flex items-center gap-1"
          variant={showAddVariant ? "secondary" : "default"}
        >
          <Plus className="h-4 w-4" />
          {showAddVariant ? "Cancel" : "Add Variant"}
        </Button>
        <Button 
          variant="outline" 
          onClick={fetchVariants}
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default VariantManagerActions;
