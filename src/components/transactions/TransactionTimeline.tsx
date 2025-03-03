
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const TransactionTimeline = () => {
  const { data: recentTransactions, isLoading } = useQuery({
    queryKey: ['recent-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          id,
          status,
          total,
          payment_method,
          created_at,
          customers(first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      return data || [];
    },
  });

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

  const getPaymentIcon = (method: string | null) => {
    switch (method) {
      case 'cash':
        return '💵';
      case 'card':
        return '💳';
      case 'check':
        return '📝';
      case 'tab':
        return '📊';
      case 'gift_card':
        return '🎁';
      default:
        return '💰';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!recentTransactions || recentTransactions.length === 0) {
    return <p className="text-center text-muted-foreground py-4">No recent transactions</p>;
  }

  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2" style={{
      scrollbarWidth: 'thin',
      scrollbarColor: 'var(--color-accent) transparent'
    }}>
      {recentTransactions.map((tx) => (
        <div key={tx.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted transition-colors">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
            {getPaymentIcon(tx.payment_method)}
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <p className="font-medium">
                {tx.customers 
                  ? `${tx.customers.first_name} ${tx.customers.last_name}`
                  : "Walk-in Customer"}
              </p>
              <Badge variant="outline" className={getStatusColor(tx.status)}>
                {tx.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{formatDateTime(tx.created_at)}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm">
                Payment: {tx.payment_method ? tx.payment_method.charAt(0).toUpperCase() + tx.payment_method.slice(1) : "—"}
              </span>
              <span className="font-semibold">{formatCurrency(tx.total)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionTimeline;
