
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import NumpadDisplay from "./numpad/NumpadDisplay";
import NumpadGrid from "./numpad/NumpadGrid";

interface POSNumpadProps {
  addToCart?: (product: any) => void;
  onKeyPress?: (value: string) => void;
  initialValue?: string;
  isPercentage?: boolean;
  onValueChange?: (value: string) => void;
  hideItemName?: boolean;
  label?: string;
}

const POSNumpad: React.FC<POSNumpadProps> = ({ 
  addToCart, 
  onKeyPress,
  initialValue = "",
  isPercentage = false,
  onValueChange,
  hideItemName = false,
  label = "Custom Item"
}) => {
  const [amount, setAmount] = useState(initialValue);
  const [customItemName, setCustomItemName] = useState(label);
  
  const appendDigit = (digit: string) => {
    // If using external handler, delegate to it
    if (onKeyPress) {
      onKeyPress(digit);
      return;
    }
    
    // If the amount already has a decimal point, ensure we don't add more than 2 decimal places
    if (amount.includes(".")) {
      const parts = amount.split(".");
      if (parts[1] && parts[1].length >= 2) return;
    }
    
    // Don't allow multiple zeros at the start
    if (amount === "0" && digit === "0") return;
    
    // Replace a lone zero with the new digit unless it's a decimal point
    if (amount === "0" && digit !== ".") {
      const newAmount = digit;
      setAmount(newAmount);
      if (onValueChange) onValueChange(newAmount);
    } else {
      const newAmount = amount + digit;
      setAmount(newAmount);
      if (onValueChange) onValueChange(newAmount);
    }
  };
  
  const handleClear = () => {
    if (onKeyPress) {
      onKeyPress("clear");
      return;
    }
    setAmount("");
    if (onValueChange) onValueChange("");
  };
  
  const handleBackspace = () => {
    if (onKeyPress) {
      onKeyPress("backspace");
      return;
    }
    const newAmount = amount.slice(0, -1);
    setAmount(newAmount);
    if (onValueChange) onValueChange(newAmount);
  };
  
  const handleAddToCart = () => {
    if (!addToCart || !amount || parseFloat(amount) <= 0) return;
    
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
  
  // If we're using this as an input for another component, render simplified version
  if (onKeyPress) {
    return (
      <Card>
        <CardContent className="p-4">
          <NumpadGrid
            onDigitPress={appendDigit}
            onBackspace={handleBackspace}
            onClear={handleClear}
          />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="flex flex-col gap-4">
      <NumpadDisplay
        customItemName={customItemName}
        setCustomItemName={setCustomItemName}
        amount={amount}
        hideItemName={hideItemName}
        isPercentage={isPercentage}
      />
      
      <Card>
        <CardContent className="p-4">
          <NumpadGrid
            onDigitPress={appendDigit}
            onBackspace={handleBackspace}
            onClear={handleClear}
            showAddToCart={addToCart !== undefined}
            onAddToCart={handleAddToCart}
            disableAddToCart={!amount || parseFloat(amount) <= 0}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default POSNumpad;
