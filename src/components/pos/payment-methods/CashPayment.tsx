
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/utils/formatters";

interface CashPaymentProps {
  amountTendered: string;
  setAmountTendered: (value: string) => void;
  total: number;
  handleNumpadInput: (value: string) => void;
}

export function CashPayment({
  amountTendered,
  setAmountTendered,
  total,
  handleNumpadInput,
}: CashPaymentProps) {
  const calculateChange = (): number => {
    const tendered = parseFloat(amountTendered) || 0;
    return Math.max(0, tendered - total);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount-tendered">Amount Tendered</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="amount-tendered"
            value={amountTendered}
            onChange={(e) => setAmountTendered(e.target.value)}
            className="text-xl font-bold"
          />
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span>Change:</span>
            <span className="text-xl font-bold">
              {formatCurrency(calculateChange())}
            </span>
          </div>
        </div>
      </div>
      
      <div>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, 'backspace'].map((key) => (
            <Button
              key={key}
              variant="outline"
              className="h-12 text-lg"
              onClick={() => handleNumpadInput(key.toString())}
            >
              {key === 'backspace' ? '⌫' : key}
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Button
            variant="outline"
            className="h-12"
            onClick={() => handleNumpadInput('clear')}
          >
            Clear
          </Button>
          <Button
            variant="outline"
            className="h-12"
            onClick={() => setAmountTendered(total.toFixed(2))}
          >
            Exact
          </Button>
        </div>
      </div>
    </div>
  );
}
