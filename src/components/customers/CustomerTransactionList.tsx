
import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Transaction, fetchCustomerTransactions } from "@/api/transactionApi";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import { RefreshCw, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TransactionDetails } from "../pos/TransactionDetails";

interface CustomerTransactionListProps {
  customerId: string;
}

export const CustomerTransactionList: React.FC<CustomerTransactionListProps> = ({ customerId }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    loadTransactions();
  }, [customerId]);

  const loadTransactions = async () => {
    setIsLoading(true);
    const data = await fetchCustomerTransactions(customerId);
    setTransactions(data);
    setIsLoading(false);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return "success";
      case 'refunded':
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex justify-center items-center h-32 text-muted-foreground">
            No transactions found for this customer
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {transaction.created_at ? formatDateTime(transaction.created_at) : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(transaction.status)}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {transaction.payment_method ? 
                        transaction.payment_method.charAt(0).toUpperCase() + transaction.payment_method.slice(1) : 
                        "N/A"}
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(transaction.total)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedTransaction(transaction)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Dialog 
        open={!!selectedTransaction} 
        onOpenChange={(open) => {
          if (!open) setSelectedTransaction(null);
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <TransactionDetails transaction={selectedTransaction} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
