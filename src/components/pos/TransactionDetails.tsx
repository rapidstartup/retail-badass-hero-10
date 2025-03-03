
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/api/transactionApi";
import { Customer, fetchCustomerById } from "@/api/customerApi";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import { Separator } from "@/components/ui/separator";
import { UserCircle, RefreshCw } from "lucide-react";

interface TransactionDetailsProps {
  transaction: Transaction;
}

export const TransactionDetails: React.FC<TransactionDetailsProps> = ({ transaction }) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(!!transaction.customer_id);

  useEffect(() => {
    const loadCustomer = async () => {
      if (transaction.customer_id) {
        setIsLoadingCustomer(true);
        const data = await fetchCustomerById(transaction.customer_id);
        setCustomer(data);
        setIsLoadingCustomer(false);
      }
    };

    loadCustomer();
  }, [transaction.customer_id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200";
      case 'refunded':
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Transaction Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ID:</span>
              <span className="font-mono">{transaction.id.substring(0, 8)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span>{transaction.created_at ? formatDateTime(transaction.created_at) : "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Completed:</span>
              <span>{transaction.completed_at ? formatDateTime(transaction.completed_at) : "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method:</span>
              <span className="capitalize">{transaction.payment_method || "N/A"}</span>
            </div>
          </div>
        </div>
        
        <div>
          {transaction.customer_id && (
            <>
              <h3 className="text-sm font-medium mb-2">Customer Information</h3>
              {isLoadingCustomer ? (
                <div className="flex justify-center items-center h-24">
                  <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : customer ? (
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {customer.photo_url ? (
                      <img
                        src={customer.photo_url}
                        alt={`${customer.first_name} ${customer.last_name}`}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircle className="w-10 h-10 text-muted-foreground" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">
                      {customer.first_name} {customer.last_name}
                    </p>
                    {customer.email && <p className="text-sm">{customer.email}</p>}
                    {customer.phone && <p className="text-sm">{customer.phone}</p>}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Customer information not available</p>
              )}
            </>
          )}
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-sm font-medium mb-4">Items</h3>
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium">Item</th>
                  <th className="px-4 py-2 text-center text-sm font-medium">Quantity</th>
                  <th className="px-4 py-2 text-right text-sm font-medium">Price</th>
                  <th className="px-4 py-2 text-right text-sm font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {transaction.items && transaction.items.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm">{item.name}</td>
                    <td className="px-4 py-2 text-sm text-center">{item.quantity}</td>
                    <td className="px-4 py-2 text-sm text-right">{formatCurrency(item.price)}</td>
                    <td className="px-4 py-2 text-sm text-right">{formatCurrency(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm">Subtotal</span>
          <span>{formatCurrency(transaction.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Tax</span>
          <span>{formatCurrency(transaction.tax)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>{formatCurrency(transaction.total)}</span>
        </div>
      </div>
    </div>
  );
};
