
import React, { useState } from "react";
import { Transaction } from "@/types/transaction";

// Import refactored components
import TransactionTable from "./transaction/TransactionTable";
import RefundDialog from "./transaction/RefundDialog";
import TransactionDetailsSheet from "./transaction/TransactionDetailsSheet";
import TransactionPagination from "./transaction/TransactionPagination";
import { useTransactionRefund } from "./transaction/useTransactionRefund";

interface ClientTransactionHistoryProps {
  transactions: Transaction[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
  };
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  loading: boolean;
}

const ClientTransactionHistory: React.FC<ClientTransactionHistoryProps> = ({
  transactions,
  pagination,
  onPageChange,
  onPageSizeChange,
  loading
}) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const {
    isRefundDialogOpen,
    setIsRefundDialogOpen,
    selectedTransaction,
    setSelectedTransaction,
    refundAmount,
    setRefundAmount,
    isProcessingRefund,
    handleRefundClick,
    handleProcessRefund
  } = useTransactionRefund();

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-pulse">Loading transactions...</div>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No transactions found for this client.
        </div>
      ) : (
        <>
          <TransactionTable 
            transactions={transactions}
            onViewDetails={handleViewDetails}
            onRefund={handleRefundClick}
          />
          
          <TransactionDetailsSheet 
            open={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
            transaction={selectedTransaction}
          />
          
          <TransactionPagination 
            {...pagination}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
          
          <RefundDialog 
            open={isRefundDialogOpen}
            onOpenChange={setIsRefundDialogOpen}
            transaction={selectedTransaction}
            refundAmount={refundAmount}
            onRefundAmountChange={setRefundAmount}
            onProcessRefund={handleProcessRefund}
            isProcessing={isProcessingRefund}
          />
        </>
      )}
    </div>
  );
};

export default ClientTransactionHistory;
