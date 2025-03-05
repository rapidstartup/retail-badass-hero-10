
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import type { TransactionItem } from "@/types/transaction";

interface InvoiceTransactionDetailsProps {
  transactionDate: string;
  transactionId?: string;
  paymentMethod?: string;
  items: TransactionItem[];
  subtotal: number;
  tax: number;
  total: number;
}

const InvoiceTransactionDetails: React.FC<InvoiceTransactionDetailsProps> = ({
  transactionDate,
  transactionId,
  paymentMethod,
  items,
  subtotal,
  tax,
  total
}) => {
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex justify-between items-center">
          <span>Transaction Details</span>
          {transactionId && (
            <span className="text-sm font-normal text-muted-foreground">
              #{transactionId.slice(0, 8)}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Date</p>
              <p className="font-medium">{formatDateTime(transactionDate)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Payment Method</p>
              <p className="font-medium capitalize">{paymentMethod || 'Not specified'}</p>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Items */}
          <div className="space-y-2">
            <p className="font-medium">Items</p>
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-2">Item</th>
                    <th className="text-center p-2">Qty</th>
                    <th className="text-right p-2">Price</th>
                    <th className="text-right p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-muted/20' : ''}>
                      <td className="p-2">{item.name}</td>
                      <td className="text-center p-2">{item.quantity}</td>
                      <td className="text-right p-2">{formatCurrency(item.price)}</td>
                      <td className="text-right p-2">{formatCurrency(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Totals */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-medium text-lg">
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
