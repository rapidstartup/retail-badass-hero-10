
import React from 'react';
import { formatCurrency } from '@/utils/formatters';
import { TransactionItem } from '@/types/transaction';

interface TransactionItemsListProps {
  items: TransactionItem[] | null;
}

const TransactionItemsList: React.FC<TransactionItemsListProps> = ({ items }) => {
  return (
    <div>
      <p className="text-sm font-medium mb-1">Items</p>
      <div 
        className="rounded-md border p-3 max-h-[180px] overflow-y-auto" 
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--color-accent) transparent'
        }}
      >
        {items && Array.isArray(items) ? (
          <div className="space-y-2">
            {items.map((item: TransactionItem, index: number) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <div>
                  <span className="font-medium">{item.quantity}x </span>
                  <span>{item.name}</span>
                </div>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No item details available</p>
        )}
      </div>
    </div>
  );
};

export default TransactionItemsList;
