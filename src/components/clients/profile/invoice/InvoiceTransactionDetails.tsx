
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import type { TransactionItem } from "@/types/transaction";

interface InvoiceTransactionDetailsProps {
  transactionDate: string;
  paymentMethod?: string;
  items: TransactionItem[];
  subtotal: number;
  tax: number;
  total: number;
}

const InvoiceTransactionDetails: React.FC<InvoiceTransactionDetailsProps> = ({
  transactionDate,
  paymentMethod,
  items,
  subtotal,
  tax,
  total
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Transaction Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Date</p>
              <p>{formatDateTime(transactionDate)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Payment Method</p>
              <p className="capitalize">{paymentMethod || 'Not specified'}</p>
            </div>
          </div>

          <Separator />

          {/* Items */}
          <div className="space-y-2">
            <p className="font-medium">Items</p>
            {items.map((item, index) => (
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
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceTransactionDetails;
