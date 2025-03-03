
import React, { useEffect, useState } from 'react';
import { fetchTransactionsByCustomer, Transaction } from '@/api/transactionApi';

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
        const data = await fetchTransactionsByCustomer(customerId);
        setTransactions(data);
      } catch (error) {
        console.error('Error loading transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadTransactions();
  }, [customerId]);
  
  if (loading) {
    return <div>Loading transactions...</div>;
  }
  
  return (
    <div>
      <h3>Transaction History</h3>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <ul>
          {transactions.map(transaction => (
            <li key={transaction.id}>
              {new Date(transaction.created_at).toLocaleDateString()} - ${transaction.total.toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
