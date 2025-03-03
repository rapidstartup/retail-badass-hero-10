
import React, { useState, useEffect } from 'react';
import { fetchTransactionsByCustomer } from "@/api/transactionApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";
import { format } from "date-fns";
import { Check, Clock, RefreshCw, CreditCard, DollarSign, FileText } from "lucide-react";

export interface CustomerTransactionListProps {
  customerId: string;
}

export const CustomerTransactionList: React.FC<CustomerTransactionListProps> = ({ customerId }) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const loadTransactions = async () => {
      if (!customerId) return;
      
      setIsLoading(true);
      try {
        const data = await fetchTransactionsByCustomer(customerId);
        setTransactions(data || []);
      } catch (error) {
        console.error("Error loading transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTransactions();
  }, [customerId]);
  
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success' as const;
      case 'open':
        return 'secondary' as const;
      case 'refunded':
        return 'destructive' as const;
      default:
        return 'default' as const;
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'Completed';
      case 'open':
        return 'Open Tab';
      case 'refunded':
        return 'Refunded';
      default:
        return status;
    }
  };
  
  const getPaymentIcon = (method: string) => {
    switch (method?.toLowerCase()) {
      case 'cash':
        return <DollarSign className="h-4 w-4" />;
      case 'card':
      case 'credit_card':
        return <CreditCard className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (transactions.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        <Clock className="h-12 w-12 mx-auto mb-3 opacity-25" />
        <p>No transactions found for this customer.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <Card key={transaction.id} className="overflow-hidden">
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              <span className="text-muted-foreground mr-2">
                {format(new Date(transaction.created_at), 'MMM d, yyyy')}
              </span>
              <Badge variant={getStatusVariant(transaction.status)}>
                {getStatusLabel(transaction.status)}
              </Badge>
            </CardTitle>
            <div className="text-lg font-semibold">
              {formatCurrency(transaction.total)}
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            <div className="text-sm text-muted-foreground mb-2">
              {transaction.items?.length || 0} {transaction.items?.length === 1 ? 'item' : 'items'}
            </div>
            
            <div className="flex justify-between mt-2">
              <div className="flex items-center text-sm">
                {getPaymentIcon(transaction.payment_method)}
                <span className="ml-1 capitalize">
                  {transaction.payment_method?.replace('_', ' ') || 'Unknown'}
                </span>
              </div>
              
              <Button variant="ghost" size="sm" className="h-7 px-2">
                <FileText className="h-3.5 w-3.5 mr-1" />
                Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CustomerTransactionList;
