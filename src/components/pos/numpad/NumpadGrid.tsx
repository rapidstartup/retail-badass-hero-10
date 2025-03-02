
import React from "react";
import NumpadButton from "./NumpadButton";

interface NumpadGridProps {
  onDigitPress: (digit: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  showAddToCart?: boolean;
  onAddToCart?: () => void;
  disableAddToCart?: boolean;
}

const NumpadGrid: React.FC<NumpadGridProps> = ({
  onDigitPress,
  onBackspace,
  onClear,
  showAddToCart = false,
  onAddToCart,
  disableAddToCart = false,
}) => {
  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((num) => (
          <NumpadButton
            key={num}
            value={num}
            onClick={() => onDigitPress(num.toString())}
          />
        ))}
        <NumpadButton value="0" onClick={() => onDigitPress("0")} />
        <NumpadButton value="." onClick={() => onDigitPress(".")} />
        <NumpadButton 
          value="⌫" 
          onClick={onBackspace} 
          variant="outline" 
          className="h-16 text-xl text-destructive"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-2">
        <NumpadButton
          value="Clear"
          onClick={onClear}
          className="h-16"
        />
        
        {showAddToCart ? (
          <NumpadButton
            value="Add to Cart"
            onClick={onAddToCart}
            variant="default"
            className="h-16"
            disabled={disableAddToCart}
          />
        ) : (
          <NumpadButton
            value="00"
            onClick={() => onDigitPress("00")}
            className="h-16"
          />
        )}
      </div>
    </div>
  );
};

export default NumpadGrid;
