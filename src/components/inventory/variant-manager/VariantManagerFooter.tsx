
import React from "react";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface VariantManagerFooterProps {
  onClose: () => void;
  isSaving?: boolean;
}

const VariantManagerFooter = ({ onClose, isSaving = false }: VariantManagerFooterProps) => {
  return (
    <DialogFooter className="mt-6">
      <Button variant="outline" onClick={onClose} disabled={isSaving}>
        {isSaving ? "Saving..." : "Done"}
        {!isSaving && <Check className="ml-2 h-4 w-4" />}
      </Button>
    </DialogFooter>
  );
};

export default VariantManagerFooter;
