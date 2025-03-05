
import React from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils/formatters";
import { Transaction } from "@/types/transaction";

interface RefundDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
  refundAmount: string;
  onRefundAmountChange: (amount: string) => void;
  onProcessRefund: () => void;
  isProcessing: boolean;
}

const RefundDialog: React.FC<RefundDialogProps> = ({
  open,
  onOpenChange,
  transaction,
  refundAmount,
  onRefundAmountChange,
  onProcessRefund,
  isProcessing
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Process Refund</DialogTitle>
          <DialogDescription>
            Enter the amount to refund. The maximum refund amount is {transaction && formatCurrency(transaction.total)}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="refund-amount">Refund Amount</Label>
            <Input
              id="refund-amount"
              value={refundAmount}
              onChange={(e) => onRefundAmountChange(e.target.value)}
              type="number"
              step="0.01"
              min="0.01"
              max={transaction?.total}
              placeholder="Enter refund amount"
            />
          </div>
          
          {transaction?.payment_method === 'cash' && (
            <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
              Note: Cash refunds must be processed manually at the register.
            </div>
          )}
          
          {transaction?.payment_method === 'card' && (
            <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-md">
              Note: Card refunds will be processed back to the original payment method.
            </div>
          )}
          
          {transaction?.payment_method === 'tab' && (
            <div className="text-sm text-emerald-600 bg-emerald-50 p-3 rounded-md">
              Note: The refunded amount will be credited back to the customer's tab.
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button 
            onClick={onProcessRefund}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Process Refund"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RefundDialog;
