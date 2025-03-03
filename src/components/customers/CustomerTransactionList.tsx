
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Transaction } from '@/api/types/transactionTypes';
import { ChevronRight, ShoppingCart, RefreshCw } from 'lucide-react';

interface CustomerTransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
  onViewTransaction: (transaction: Transaction) => void;
}

export const CustomerTransactionList: React.FC<CustomerTransactionListProps> = ({
  transactions,
  isLoading,
  onViewTransaction,
}) => {
  // Helper function to determine badge color based on transaction status
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      case 'refunded':
        return <Badge variant="destructive">Refunded</Badge>;
      case 'open':
        return <Badge>Open</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Helper function to determine payment method display
  const getPaymentMethod = (method: string | null | undefined) => {
    if (!method) return 'N/A';
    
    switch (method.toLowerCase()) {
      case 'card':
        return 'Credit/Debit Card';
      case 'cash':
        return 'Cash';
      case 'tab':
        return 'Tab';
      case 'check':
        return 'Check';
      case 'gift_card':
        return 'Gift Card';
      default:
        return method;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg">
        <ShoppingCart className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
        <h3 className="text-lg font-medium mb-1">No Transactions</h3>
        <p className="text-muted-foreground">
          This customer hasn't made any purchases yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">
                  {formatDate(transaction.created_at || '')}
                </span>
                {getStatusBadge(transaction.status)}
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div>
                  Items: {Array.isArray(transaction.items) ? transaction.items.length : 0}
                </div>
                <div>
                  Payment: {getPaymentMethod(transaction.payment_method)}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-lg font-bold">{formatCurrency(transaction.total)}</span>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => onViewTransaction(transaction)}
              >
                Details <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomerTransactionList;
