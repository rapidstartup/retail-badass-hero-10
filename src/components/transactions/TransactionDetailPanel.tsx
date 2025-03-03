
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, X } from 'lucide-react';
import { formatDateTime } from '@/utils/formatters';

import { useTransactionDetail } from './detail/useTransactionDetail';
import EmptyDetailState from './detail/EmptyDetailState';
import LoadingDetailState from './detail/LoadingDetailState';
import ErrorDetailState from './detail/ErrorDetailState';
import TransactionStatusBadge from './detail/TransactionStatusBadge';
import TransactionCustomerCard from './detail/TransactionCustomerCard';
import TransactionItemsList from './detail/TransactionItemsList';
import TransactionSummary from './detail/TransactionSummary';
import TransactionActions from './detail/TransactionActions';

interface TransactionDetailPanelProps {
  transactionId: string | null;
  onClose: () => void;
}

const TransactionDetailPanel: React.FC<TransactionDetailPanelProps> = ({ 
  transactionId,
  onClose
}) => {
  const { data: transaction, isLoading, isError } = useTransactionDetail(transactionId);
  
  if (!transactionId) {
    return <EmptyDetailState />;
  }
  
  if (isLoading) {
    return <LoadingDetailState />;
  }
  
  if (isError || !transaction) {
    return <ErrorDetailState onClose={onClose} />;
  }
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Transaction Details</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              ID: {transaction.id.slice(0, 12)}...
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">Status</p>
            <TransactionStatusBadge status={transaction.status} />
          </div>
          
          <div className="text-right">
            <p className="text-sm font-medium">Date</p>
            <p className="text-sm">{formatDateTime(transaction.created_at)}</p>
          </div>
        </div>
        
        <TransactionCustomerCard customer={transaction.customers} />
        
        <TransactionItemsList items={transaction.items} />
        
        <TransactionSummary 
          subtotal={transaction.subtotal} 
          tax={transaction.tax} 
          total={transaction.total} 
        />
        
        <div>
          <p className="text-sm font-medium mb-1">Payment Method</p>
          <p>
            {transaction.payment_method 
              ? transaction.payment_method.charAt(0).toUpperCase() + transaction.payment_method.slice(1) 
              : "Not specified"}
          </p>
        </div>
        
        <TransactionActions 
          transactionId={transaction.id} 
          status={transaction.status} 
        />
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => console.log("Print receipt")}>
          <Printer className="h-4 w-4 mr-2" /> 
          Print Receipt
        </Button>
        
        <Button variant="outline" size="sm" onClick={() => console.log("Email receipt")}>
          Email Receipt
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TransactionDetailPanel;
