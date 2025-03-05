
import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import TransactionInvoice from "../TransactionInvoice";
import { Transaction } from "@/types/transaction";

interface TransactionDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
}

const TransactionDetailsSheet: React.FC<TransactionDetailsSheetProps> = ({
  open,
  onOpenChange,
  transaction
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Transaction Details</SheetTitle>
          <SheetDescription>
            Transaction ID: {transaction?.id.slice(0, 8)}
          </SheetDescription>
        </SheetHeader>
        {transaction && (
          <div className="mt-6 space-y-6">
            <TransactionInvoice transaction={transaction} />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default TransactionDetailsSheet;
