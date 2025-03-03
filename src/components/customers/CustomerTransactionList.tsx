
import React, { useEffect, useState } from 'react';
import { fetchTransactionsByCustomerId } from '@/api/transactionApi';
import { Transaction } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface CustomerTransactionListProps {
  customerId: string;
}

export const CustomerTransactionList: React.FC<CustomerTransactionListProps> = ({ customerId }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        const data = await fetchTransactionsByCustomerId(customerId);
        setTransactions(data);
      } catch (error) {
        console.error('Error loading transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadTransactions();
  }, [customerId]);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'open':
        return <Badge className="bg-yellow-500">Open</Badge>;
      case 'refunded':
        return <Badge className="bg-red-500">Refunded</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No transactions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {transaction.created_at ? new Date(transaction.created_at).toLocaleDateString() : 'Unknown'}
                    </TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell>
                      {Array.isArray(transaction.items) 
                        ? transaction.items.length 
                        : typeof transaction.items === 'object' && transaction.items !== null
                          ? Object.keys(transaction.items).length
                          : 0}
                    </TableCell>
                    <TableCell>{transaction.payment_method || 'N/A'}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(transaction.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
