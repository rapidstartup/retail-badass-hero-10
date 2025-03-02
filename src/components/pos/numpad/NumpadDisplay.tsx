
import React from "react";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils/formatters";

interface NumpadDisplayProps {
  customItemName: string;
  setCustomItemName: (name: string) => void;
  amount: string;
  hideItemName?: boolean;
  isPercentage?: boolean;
}

const NumpadDisplay: React.FC<NumpadDisplayProps> = ({ 
  customItemName, 
  setCustomItemName, 
  amount,
  hideItemName = false,
  isPercentage = false
}) => {
  // Format the display value based on whether it's a percentage or currency
  const displayAmount = amount 
    ? isPercentage
      ? `${parseFloat(amount) || 0}%`
      : formatCurrency(parseFloat(amount) || 0)
    : isPercentage ? "0%" : "$0.00";

  if (hideItemName) {
    return (
      <div className="w-full text-right text-2xl font-medium p-2 bg-muted/30 rounded-md">
        {displayAmount}
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <Input
        value={customItemName}
        onChange={(e) => setCustomItemName(e.target.value)}
        placeholder="Item name"
        className="flex-1"
      />
      <div className="w-[180px] text-right text-2xl font-medium p-2 bg-muted/30 rounded-md">
        {displayAmount}
      </div>
    </div>
  );
};

export default NumpadDisplay;
