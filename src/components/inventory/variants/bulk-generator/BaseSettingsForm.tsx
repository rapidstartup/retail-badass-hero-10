
import React from "react";
import { Input } from "@/components/ui/input";

interface BaseSettingsFormProps {
  skuPrefix: string;
  setSkuPrefix: (prefix: string) => void;
  bulkBasePrice: number;
  setBulkBasePrice: (price: number) => void;
  bulkBaseStock: number;
  setBulkBaseStock: (stock: number) => void;
}

const BaseSettingsForm = ({
  skuPrefix,
  setSkuPrefix,
  bulkBasePrice,
  setBulkBasePrice,
  bulkBaseStock,
  setBulkBaseStock
}: BaseSettingsFormProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">SKU Prefix</label>
        <Input
          placeholder="SKU Prefix"
          value={skuPrefix}
          onChange={(e) => setSkuPrefix(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">Used to generate SKUs for all variants</p>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Base Price</label>
        <Input
          type="number"
          min="0"
          step="0.01"
          placeholder="Base Price"
          value={bulkBasePrice || ""}
          onChange={(e) => setBulkBasePrice(Number(e.target.value))}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Base Stock</label>
        <Input
          type="number"
          min="0"
          step="1"
          placeholder="Base Stock"
          value={bulkBaseStock || ""}
          onChange={(e) => setBulkBaseStock(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default BaseSettingsForm;
