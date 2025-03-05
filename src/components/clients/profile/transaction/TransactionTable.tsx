
import React from "react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import { Transaction } from "@/types/transaction";
import { Button } from "@/components/ui/button";
import { ArrowDownLeft, Eye } from "lucide-react";

interface TransactionTableProps {
  transactions: Transaction[];
  onViewDetails: (transaction: Transaction) => void;
  onRefund: (transaction: Transaction) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onViewDetails,
  onRefund
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Payment Method</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>{formatDateTime(transaction.created_at)}</TableCell>
            <TableCell>{formatCurrency(transaction.total)}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs ${
                transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
                transaction.status === 'open' ? 'bg-yellow-100 text-yellow-800' : 
                transaction.status === 'refunded' ? 'bg-blue-100 text-blue-800' :
                'bg-red-100 text-red-800'
              }`}>
                {transaction.status}
              </span>
            </TableCell>
            <TableCell>{transaction.payment_method || "—"}</TableCell>
            <TableCell className="text-right space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onViewDetails(transaction)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              {transaction.status === 'completed' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onRefund(transaction)}
                  className="flex items-center gap-1"
                >
                  <ArrowDownLeft className="h-4 w-4" />
                  Refund
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TransactionTable;
