
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Printer, RefreshCcw } from "lucide-react";
import { TransactionFilters } from "@/types/transaction";
import { supabase } from "@/integrations/supabase/client";
import { useSettings } from "@/contexts/SettingsContext";
import { Skeleton } from "@/components/ui/skeleton";

interface TransactionListProps {
  status?: string;
  filters: TransactionFilters;
}

const TransactionList: React.FC<TransactionListProps> = ({ status, filters }) => {
  const { settings } = useSettings();
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);

  const { data: transactions, isLoading, isError } = useQuery({
    queryKey: ['transactions', status, filters],
    queryFn: async () => {
      let query = supabase
        .from('transactions')
        .select(`
          id,
          status,
          total,
          subtotal,
          tax,
          payment_method,
          created_at,
          completed_at,
          customers(first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      // Apply status filter
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      // Apply date range filter
      if (filters.dateRange?.from) {
        const fromDate = new Date(filters.dateRange.from);
        fromDate.setHours(0, 0, 0, 0);
        query = query.gte('created_at', fromDate.toISOString());
      }
      
      if (filters.dateRange?.to) {
        const toDate = new Date(filters.dateRange.to);
        toDate.setHours(23, 59, 59, 999);
        query = query.lte('created_at', toDate.toISOString());
      }

      // Apply payment method filter
      if (filters.paymentMethod) {
        query = query.eq('payment_method', filters.paymentMethod);
      }

      // Apply amount range filters
      if (filters.minimumAmount !== undefined) {
        query = query.gte('total', filters.minimumAmount);
      }
      
      if (filters.maximumAmount !== undefined) {
        query = query.lte('total', filters.maximumAmount);
      }

      // Apply search query (customer name or transaction ID)
      if (filters.searchQuery) {
        query = query.or(`id.ilike.%${filters.searchQuery}%,customers.first_name.ilike.%${filters.searchQuery}%,customers.last_name.ilike.%${filters.searchQuery}%`);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching transactions:", error);
        throw new Error(error.message);
      }
      
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

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">Error loading transactions</p>
        <Button variant="outline" onClick={() => window.location.reload()} className="mt-2">
          <RefreshCcw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow 
              key={transaction.id} 
              className={selectedTransaction === transaction.id ? 'bg-muted' : undefined}
              onClick={() => setSelectedTransaction(transaction.id)}
            >
              <TableCell className="font-medium">{transaction.id.slice(0, 8)}</TableCell>
              <TableCell>{formatDateTime(transaction.created_at)}</TableCell>
              <TableCell>
                {transaction.customers 
                  ? `${transaction.customers.first_name} ${transaction.customers.last_name}`
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
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Printer className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionList;
