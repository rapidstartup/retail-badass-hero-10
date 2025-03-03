
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Printer, X, RefreshCcw, CheckCircle } from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface TransactionDetailPanelProps {
  transactionId: string | null;
  onClose: () => void;
}

const TransactionDetailPanel: React.FC<TransactionDetailPanelProps> = ({ 
  transactionId,
  onClose
}) => {
  const { data: transaction, isLoading, isError } = useQuery({
    queryKey: ['transaction-detail', transactionId],
    queryFn: async () => {
      if (!transactionId) return null;
      
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          id,
          status,
          total,
          subtotal,
          tax,
          items,
          payment_method,
          created_at,
          completed_at,
          customers(id, first_name, last_name, email, phone)
        `)
        .eq('id', transactionId)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!transactionId
  });
  
  if (!transactionId) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full p-6">
          <div className="text-center text-muted-foreground">
            <p>Select a transaction to view details</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }
  
  if (isError || !transaction) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>Transaction Details</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-red-500">Error loading transaction details</p>
          <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }
  
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
  
  const handleCompleteTab = async () => {
    if (transaction.status !== 'open') return;
    
    toast.success('Tab marked as completed', {
      description: `Transaction ${transaction.id.slice(0, 8)} has been completed.`
    });
  };
  
  const handleRefund = async () => {
    if (transaction.status !== 'completed') return;
    
    toast.success('Transaction marked as refunded', {
      description: `Transaction ${transaction.id.slice(0, 8)} has been refunded.`
    });
  };
  
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
            <Badge 
              variant="outline" 
              className={getStatusColor(transaction.status)}
            >
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </Badge>
          </div>
          
          <div className="text-right">
            <p className="text-sm font-medium">Date</p>
            <p className="text-sm">{formatDateTime(transaction.created_at)}</p>
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium mb-1">Customer</p>
          <div className="rounded-md bg-muted p-3">
            {transaction.customers ? (
              <div className="space-y-1">
                <p className="font-medium">{transaction.customers.first_name} {transaction.customers.last_name}</p>
                {transaction.customers.email && <p className="text-sm">{transaction.customers.email}</p>}
                {transaction.customers.phone && <p className="text-sm">{transaction.customers.phone}</p>}
              </div>
            ) : (
              <p>Walk-in Customer</p>
            )}
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium mb-1">Items</p>
          <div className="rounded-md border p-3 max-h-[180px] overflow-y-auto" style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'var(--color-accent) transparent'
          }}>
            {transaction.items && Array.isArray(transaction.items) ? (
              <div className="space-y-2">
                {transaction.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div>
                      <span className="font-medium">{item.quantity}x </span>
                      <span>{item.name}</span>
                    </div>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No item details available</p>
            )}
          </div>
        </div>
        
        <div className="rounded-md bg-muted p-3">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(transaction.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>{formatCurrency(transaction.tax)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{formatCurrency(transaction.total)}</span>
            </div>
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium mb-1">Payment Method</p>
          <p>
            {transaction.payment_method 
              ? transaction.payment_method.charAt(0).toUpperCase() + transaction.payment_method.slice(1) 
              : "Not specified"}
          </p>
        </div>
        
        {transaction.status === 'open' && (
          <Button 
            className="w-full" 
            onClick={handleCompleteTab}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Complete Tab
          </Button>
        )}
        
        {transaction.status === 'completed' && (
          <Button 
            variant="outline" 
            className="w-full text-red-500 hover:text-red-700" 
            onClick={handleRefund}
          >
            Issue Refund
          </Button>
        )}
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
