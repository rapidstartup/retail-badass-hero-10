
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface LowStockAlertProps {
  totalLowStockItems: number;
}

export default function LowStockAlert({ totalLowStockItems }: LowStockAlertProps) {
  if (totalLowStockItems === 0) return null;
  
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Low Stock Alert</AlertTitle>
      <AlertDescription>
        {totalLowStockItems} {totalLowStockItems === 1 ? 'item is' : 'items are'} low on stock.
      </AlertDescription>
    </Alert>
  );
}
