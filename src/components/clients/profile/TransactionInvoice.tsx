
import React from 'react';
import { FileText, Send, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import type { Transaction } from "@/types/transaction";
import { useStore } from "@/hooks/useStore";

interface TransactionInvoiceProps {
  transaction: Transaction;
}

const TransactionInvoice: React.FC<TransactionInvoiceProps> = ({ transaction }) => {
  const { store } = useStore();

  const handleSendInvoice = async () => {
    // TODO: Implement email sending functionality
    console.log("Sending invoice...");
  };

  const handleDownloadInvoice = async () => {
    // TODO: Implement PDF generation and download
    console.log("Downloading invoice...");
  };

  return (
    <div className="space-y-6">
      {/* Store Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {store?.store_name || 'Store Name'}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          <p>{store?.store_address}</p>
          <p>{store?.store_phone}</p>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Customer Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          <p>
            {transaction.customers?.first_name} {transaction.customers?.last_name}
          </p>
          {transaction.customers?.email && (
            <p>{transaction.customers.email}</p>
          )}
        </CardContent>
      </Card>

      {/* Transaction Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Transaction Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Date</p>
                <p>{formatDateTime(transaction.created_at || '')}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Payment Method</p>
                <p className="capitalize">{transaction.payment_method || 'Not specified'}</p>
              </div>
            </div>

            <Separator />

            {/* Items */}
            <div className="space-y-2">
              <p className="font-medium">Items</p>
              {transaction.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <Separator />

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(transaction.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>{formatCurrency(transaction.tax)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatCurrency(transaction.total)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={handleDownloadInvoice}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
        <Button
          onClick={handleSendInvoice}
          className="flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
          Send Invoice
        </Button>
      </div>
    </div>
  );
};

export default TransactionInvoice;
