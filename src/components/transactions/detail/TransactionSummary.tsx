
import React from 'react';
import { formatCurrency } from '@/utils/formatters';
import { Separator } from '@/components/ui/separator';

interface TransactionSummaryProps {
  subtotal: number;
  tax: number;
  total: number;
}

const TransactionSummary: React.FC<TransactionSummaryProps> = ({ 
  subtotal, 
  tax, 
  total 
}) => {
  return (
    <div className="rounded-md bg-muted p-3">
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default TransactionSummary;
