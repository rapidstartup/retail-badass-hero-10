
import React from "react";
import { Button } from "@/components/ui/button";

interface NumpadButtonProps {
  value: string | number;
  onClick: () => void;
  variant?: "default" | "outline" | "destructive";
  className?: string;
  disabled?: boolean;
}

const NumpadButton: React.FC<NumpadButtonProps> = ({ 
  value, 
  onClick, 
  variant = "outline",
  className = "h-16 text-xl",
  disabled = false
}) => {
  return (
    <Button
      variant={variant}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {value}
    </Button>
  );
};

export default NumpadButton;
