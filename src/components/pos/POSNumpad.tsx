
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils/formatters";

interface POSNumpadProps {
  addToCart: (product: any) => void;
}

const POSNumpad: React.FC<POSNumpadProps> = ({ addToCart }) => {
  const [amount, setAmount] = useState("");
  const [customItemName, setCustomItemName] = useState("Custom Item");
  
  const appendDigit = (digit: string) => {
    // If the amount already has a decimal point, ensure we don't add more than 2 decimal places
    if (amount.includes(".")) {
      const parts = amount.split(".");
      if (parts[1] && parts[1].length >= 2) return;
    }
    
    // Don't allow multiple zeros at the start
    if (amount === "0" && digit === "0") return;
    
    // Replace a lone zero with the new digit unless it's a decimal point
    if (amount === "0" && digit !== ".") {
      setAmount(digit);
    } else {
      setAmount(prev => prev + digit);
    }
  };
  
  const handleClear = () => {
    setAmount("");
  };
  
  const handleBackspace = () => {
    setAmount(prev => prev.slice(0, -1));
  };
  
  const handleAddToCart = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    const customProduct = {
      id: `custom-${Date.now()}`,
      name: customItemName,
      price: parseFloat(amount),
      category: "Custom",
      image: "/placeholder.svg"
    };
    
    addToCart(customProduct);
    setAmount("");
  };
  
  const displayAmount = amount ? formatCurrency(parseFloat(amount) || 0) : "$0.00";
  
  return (
    <div className="flex flex-col gap-4">
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
      
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-2">
            {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((num) => (
              <Button
                key={num}
                variant="outline"
                className="h-16 text-xl"
                onClick={() => appendDigit(num.toString())}
              >
                {num}
              </Button>
            ))}
            <Button
              variant="outline"
              className="h-16 text-xl"
              onClick={() => appendDigit("0")}
            >
              0
            </Button>
            <Button
              variant="outline"
              className="h-16 text-xl"
              onClick={() => appendDigit(".")}
            >
              .
            </Button>
            <Button
              variant="outline"
              className="h-16 text-xl text-destructive"
              onClick={handleBackspace}
            >
              ⌫
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Button
              variant="outline"
              className="h-16"
              onClick={handleClear}
            >
              Clear
            </Button>
            <Button
              className="h-16"
              onClick={handleAddToCart}
              disabled={!amount || parseFloat(amount) <= 0}
            >
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default POSNumpad;
