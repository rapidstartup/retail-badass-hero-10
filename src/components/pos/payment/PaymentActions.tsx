
import React from "react";
import { Button } from "@/components/ui/button";

interface PaymentActionsProps {
  onCancel: () => void;
  onPayment: () => void;
  processing: boolean;
  paymentMethod: string;
}

export function PaymentActions({
  onCancel,
  onPayment,
  processing,
  paymentMethod,
}: PaymentActionsProps) {
  return (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
      <Button 
        variant="outline" 
        onClick={onCancel}
        disabled={processing}
      >
        Cancel
      </Button>
      <Button 
        onClick={onPayment}
        disabled={processing || paymentMethod === "gift_card"}
      >
        {processing ? "Processing..." : `Complete ${paymentMethod === 'tab' ? 'Tab' : 'Payment'}`}
      </Button>
    </div>
  );
}
