
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/utils/formatters";

interface CheckPaymentProps {
  checkNumber: string;
  setCheckNumber: (value: string) => void;
  total: number;
  storeName: string;
}

export function CheckPayment({
  checkNumber,
  setCheckNumber,
  total,
  storeName,
}: CheckPaymentProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="check-number">Check Number</Label>
        <Input
          id="check-number"
          placeholder="Check #"
          value={checkNumber}
          onChange={(e) => setCheckNumber(e.target.value.replace(/\D/g, ''))}
        />
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
        <p className="text-sm mb-2">
          Please verify the check amount matches the total: {formatCurrency(total)}
        </p>
        <p className="text-sm text-muted-foreground">
          Make checks payable to: {storeName}
        </p>
      </div>
    </div>
  );
}
