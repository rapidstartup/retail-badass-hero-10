
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import NumpadDisplay from "./numpad/NumpadDisplay";
import NumpadGrid from "./numpad/NumpadGrid";

interface POSNumpadProps {
  addToCart?: (product: any) => void;
  onKeyPress?: (value: string) => void;
}

const POSNumpad: React.FC<POSNumpadProps> = ({ addToCart, onKeyPress }) => {
  const [amount, setAmount] = useState("");
  const [customItemName, setCustomItemName] = useState("Custom Item");
  
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
      setAmount(digit);
    } else {
      setAmount(prev => prev + digit);
    }
  };
  
  const handleClear = () => {
    if (onKeyPress) {
      onKeyPress("clear");
      return;
    }
    setAmount("");
  };
  
  const handleBackspace = () => {
    if (onKeyPress) {
      onKeyPress("backspace");
      return;
    }
    setAmount(prev => prev.slice(0, -1));
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
      />
      
      <Card>
        <CardContent className="p-4">
          <NumpadGrid
            onDigitPress={appendDigit}
            onBackspace={handleBackspace}
            onClear={handleClear}
            showAddToCart={true}
            onAddToCart={handleAddToCart}
            disableAddToCart={!amount || parseFloat(amount) <= 0}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default POSNumpad;
