
import React from 'react';
import { formatCurrency } from "@/utils/formatters";
import { Transaction } from "@/types";

interface TransactionDetailsProps {
  transaction: Transaction;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ transaction }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Transaction #{transaction.id}</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
          <p>{transaction.created_at ? new Date(transaction.created_at).toLocaleString() : 'N/A'}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
          <p className={`font-medium ${
            transaction.status === 'completed' ? 'text-green-600' : 
            transaction.status === 'refunded' ? 'text-red-600' : 
            'text-yellow-600'
          }`}>
            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
          </p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Payment Method</h3>
          <p>{transaction.payment_method || 'N/A'}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Total</h3>
          <p className="font-bold">{formatCurrency(transaction.total)}</p>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Items</h3>
        <div className="border rounded-md">
          <table className="w-full">
            <thead className="bg-muted text-muted-foreground text-sm">
              <tr>
                <th className="py-2 px-4 text-left">Item</th>
                <th className="py-2 px-4 text-right">Price</th>
                <th className="py-2 px-4 text-right">Qty</th>
                <th className="py-2 px-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {transaction.items && Array.isArray(transaction.items) ? (
                transaction.items.map((item: any, index: number) => (
                  <tr key={index} className="border-t">
                    <td className="py-2 px-4">{item.name}</td>
                    <td className="py-2 px-4 text-right">{formatCurrency(item.price)}</td>
                    <td className="py-2 px-4 text-right">{item.quantity}</td>
                    <td className="py-2 px-4 text-right">{formatCurrency(item.price * item.quantity)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-2 px-4 text-center text-muted-foreground">
                    No items available
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-muted/50">
              <tr className="border-t">
                <td colSpan={3} className="py-2 px-4 text-right font-medium">Subtotal</td>
                <td className="py-2 px-4 text-right">{formatCurrency(transaction.subtotal)}</td>
              </tr>
              <tr>
                <td colSpan={3} className="py-2 px-4 text-right font-medium">Tax</td>
                <td className="py-2 px-4 text-right">{formatCurrency(transaction.tax)}</td>
              </tr>
              <tr className="font-bold">
                <td colSpan={3} className="py-2 px-4 text-right">Total</td>
                <td className="py-2 px-4 text-right">{formatCurrency(transaction.total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
