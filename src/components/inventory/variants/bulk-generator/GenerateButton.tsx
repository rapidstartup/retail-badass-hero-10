
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

interface GenerateButtonProps {
  onClick: () => Promise<void>;
  disabled: boolean;
  loading: boolean;
}

const GenerateButton = ({
  onClick,
  disabled,
  loading
}: GenerateButtonProps) => {
  return (
    <Button 
      onClick={onClick} 
      className="w-full mt-4"
      disabled={disabled || loading}
    >
      {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
      Generate Variants
    </Button>
  );
};

export default GenerateButton;
