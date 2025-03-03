
import React, { useState } from "react";
import { TransactionFilters } from "@/types/transaction";
import { useTransactionList } from "./list/useTransactionList";
import TransactionTable from "./list/TransactionTable";
import TransactionListLoading from "./list/TransactionListLoading";
import TransactionListError from "./list/TransactionListError";
import TransactionListEmpty from "./list/TransactionListEmpty";

interface TransactionListProps {
  status?: string;
  filters: TransactionFilters;
  onSelectTransaction?: (transactionId: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ 
  status, 
  filters,
  onSelectTransaction
}) => {
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);

  // Combine filters with status
  const { data, isLoading, isError } = useTransactionList({
    ...filters,
    status: status !== 'all' ? status : undefined
  });

  const handleRowClick = (transactionId: string) => {
    setSelectedTransaction(transactionId);
    if (onSelectTransaction) {
      onSelectTransaction(transactionId);
    }
  };

  if (isLoading) {
    return <TransactionListLoading />;
  }

  if (isError) {
    return <TransactionListError />;
  }

  if (!data || !data.transactions || data.transactions.length === 0) {
    return <TransactionListEmpty />;
  }

  return (
    <TransactionTable
      transactions={data.transactions}
      selectedTransaction={selectedTransaction}
      onSelectTransaction={handleRowClick}
    />
  );
};

export default TransactionList;
