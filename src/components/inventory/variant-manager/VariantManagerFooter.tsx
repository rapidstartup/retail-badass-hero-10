
import React from "react";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface VariantManagerFooterProps {
  onClose: () => void;
}

const VariantManagerFooter = ({ onClose }: VariantManagerFooterProps) => {
  return (
    <DialogFooter>
      <Button onClick={onClose}>
        Done
      </Button>
    </DialogFooter>
  );
};

export default VariantManagerFooter;
