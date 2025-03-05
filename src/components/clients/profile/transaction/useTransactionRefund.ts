
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Transaction } from "@/types/transaction";

export const useTransactionRefund = () => {
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [refundAmount, setRefundAmount] = useState("");
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);

  const handleRefundClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setRefundAmount(transaction.total.toString());
    setIsRefundDialogOpen(true);
  };

  const handleProcessRefund = async () => {
    if (!selectedTransaction) return;
    
    const amount = parseFloat(refundAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid refund amount");
      return;
    }
    
    if (amount > selectedTransaction.total) {
      toast.error("Refund amount cannot exceed the transaction total");
      return;
    }
    
    setIsProcessingRefund(true);
    
    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          status: 'refunded',
          refund_amount: amount,
          refund_date: new Date().toISOString()
        })
        .eq('id', selectedTransaction.id);
      
      if (error) throw error;
      
      const paymentMethod = selectedTransaction.payment_method;
      let refundMessage = "";
      
      if (paymentMethod === 'cash') {
        refundMessage = `Please issue a cash refund of ${amount.toFixed(2)} to the customer.`;
      } else if (paymentMethod === 'card') {
        refundMessage = `Card refund of ${amount.toFixed(2)} has been processed.`;
      } else if (paymentMethod === 'tab') {
        refundMessage = `${amount.toFixed(2)} has been credited back to the customer's tab.`;
      } else {
        refundMessage = `Refund of ${amount.toFixed(2)} has been processed.`;
      }
      
      toast.success(refundMessage);
      
      setIsRefundDialogOpen(false);
      setSelectedTransaction(null);
      setRefundAmount("");
      
    } catch (error) {
      console.error("Error processing refund:", error);
      toast.error("Failed to process refund. Please try again.");
    } finally {
      setIsProcessingRefund(false);
    }
  };

  return {
    isRefundDialogOpen,
    setIsRefundDialogOpen,
    selectedTransaction,
    setSelectedTransaction,
    refundAmount,
    setRefundAmount,
    isProcessingRefund,
    handleRefundClick,
    handleProcessRefund
  };
};
