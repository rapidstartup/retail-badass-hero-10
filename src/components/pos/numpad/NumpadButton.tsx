
import React from "react";
import { Button } from "@/components/ui/button";

interface NumpadButtonProps {
  value: string | number;
  onClick: () => void;
  variant?: "default" | "outline" | "destructive";
  className?: string;
}

const NumpadButton: React.FC<NumpadButtonProps> = ({ 
  value, 
  onClick, 
  variant = "outline",
  className = "h-16 text-xl" 
}) => {
  return (
    <Button
      variant={variant}
      className={className}
      onClick={onClick}
    >
      {value}
    </Button>
  );
};

export default NumpadButton;
