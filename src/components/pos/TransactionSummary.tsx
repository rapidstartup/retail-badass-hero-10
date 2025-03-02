
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";

interface TransactionSummaryProps {
  cartItems: any[];
  subtotal: number;
  tax: number;
  total: number;
  taxRate: number;
  customer: any;
}

export function TransactionSummary({
  cartItems,
  subtotal,
  tax,
  total,
  taxRate,
  customer,
}: TransactionSummaryProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="font-semibold">Transaction Summary</span>
            <span className="text-sm text-muted-foreground">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          
          <div className="max-h-[300px] overflow-y-auto space-y-2">
            {cartItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          
          <div className="pt-2 space-y-2 border-t">
            <div className="flex justify-between items-center text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Tax ({taxRate}%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between items-center font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
          
          {customer && (
            <div className="pt-2 border-t">
              <div className="text-sm">
                <span className="font-semibold">Customer: </span>
                <span>{customer.first_name} {customer.last_name}</span>
              </div>
              {customer.email && (
                <div className="text-sm">
                  <span className="font-semibold">Email: </span>
                  <span>{customer.email}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
