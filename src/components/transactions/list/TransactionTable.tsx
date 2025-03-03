
import React from "react";
import { Table, TableBody } from "@/components/ui/table";
import TransactionTableHeader from "./TransactionTableHeader";
import TransactionTableRow from "./TransactionTableRow";
import { Transaction } from "@/types/transaction";

interface TransactionTableProps {
  transactions: Transaction[];
  selectedTransaction: string | null;
  onSelectTransaction: (transactionId: string) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  selectedTransaction,
  onSelectTransaction
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TransactionTableHeader />
        <TableBody>
          {transactions.map((transaction) => (
            <TransactionTableRow
              key={transaction.id}
              transaction={transaction}
              isSelected={selectedTransaction === transaction.id}
              onSelect={onSelectTransaction}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTable;
