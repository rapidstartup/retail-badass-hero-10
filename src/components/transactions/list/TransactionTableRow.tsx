
import React from "react";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Printer } from "lucide-react";
import { Transaction } from "@/types/transaction";
import { useNavigate } from "react-router-dom";

interface TransactionTableRowProps {
  transaction: Transaction;
  isSelected: boolean;
  onSelect: (transactionId: string) => void;
}

const TransactionTableRow: React.FC<TransactionTableRowProps> = ({ 
  transaction, 
  isSelected,
  onSelect 
}) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'open':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'refunded':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const handleViewCustomer = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (transaction.customers?.id) {
      navigate(`/clients/${transaction.customers.id}`);
    } else {
      // If no customer_id, just show the transaction details
      onSelect(transaction.id);
    }
  };

  return (
    <TableRow 
      className={isSelected ? 'bg-muted' : undefined}
      onClick={() => onSelect(transaction.id)}
    >
      <TableCell className="font-medium">{transaction.id.slice(0, 8)}</TableCell>
      <TableCell>{formatDateTime(transaction.created_at)}</TableCell>
      <TableCell>
        {transaction.customers 
          ? `${transaction.customers.first_name || ''} ${transaction.customers.last_name || ''}`
          : "Walk-in Customer"}
      </TableCell>
      <TableCell>{formatCurrency(transaction.total)}</TableCell>
      <TableCell>
        <Badge 
          variant="outline" 
          className={getStatusColor(transaction.status)}
        >
          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
        </Badge>
      </TableCell>
      <TableCell>
        {transaction.payment_method 
          ? transaction.payment_method.charAt(0).toUpperCase() + transaction.payment_method.slice(1)
          : "—"}
      </TableCell>
      <TableCell className="text-right space-x-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleViewCustomer}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            // Printing functionality would go here
            console.log("Print transaction:", transaction.id);
          }}
        >
          <Printer className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default TransactionTableRow;
