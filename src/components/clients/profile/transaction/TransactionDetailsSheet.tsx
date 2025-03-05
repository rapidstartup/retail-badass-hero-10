
import React, { useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import TransactionInvoice from "../TransactionInvoice";
import EmailDialog from "./EmailDialog";
import { useTransactionEmail } from "./useTransactionEmail";
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
  const invoiceRef = useRef<HTMLDivElement>(null);
  const invoiceId = `invoice-${transaction?.id || 'preview'}`;
  
  const {
    isEmailDialogOpen,
    setIsEmailDialogOpen,
    selectedTransaction,
    recipientEmail,
    setRecipientEmail,
    emailSubject,
    setEmailSubject,
    emailMessage,
    setEmailMessage,
    isSendingEmail,
    handleEmailClick,
    handleSendEmail
  } = useTransactionEmail();

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
          <SheetHeader>
            <div className="flex justify-between items-center">
              <SheetTitle>Transaction Details</SheetTitle>
              {transaction && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex items-center gap-1"
                  onClick={() => handleEmailClick(transaction, transaction.customers?.email)}
                >
                  <Mail className="h-4 w-4" />
                  Email Receipt
                </Button>
              )}
            </div>
            <SheetDescription>
              Transaction ID: {transaction?.id.slice(0, 8)}
            </SheetDescription>
          </SheetHeader>
          {transaction && (
            <div className="mt-6 space-y-6" id={invoiceId} ref={invoiceRef}>
              <TransactionInvoice transaction={transaction} />
            </div>
          )}
        </SheetContent>
      </Sheet>

      <EmailDialog
        open={isEmailDialogOpen}
        onOpenChange={setIsEmailDialogOpen}
        transaction={selectedTransaction}
        recipientEmail={recipientEmail}
        onRecipientEmailChange={setRecipientEmail}
        emailSubject={emailSubject}
        onEmailSubjectChange={setEmailSubject}
        emailMessage={emailMessage}
        onEmailMessageChange={setEmailMessage}
        onSendEmail={() => handleSendEmail(invoiceId)}
        isSending={isSendingEmail}
      />
    </>
  );
};

export default TransactionDetailsSheet;
