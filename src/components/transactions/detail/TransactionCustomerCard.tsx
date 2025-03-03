
import React from 'react';

interface CustomerData {
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

interface TransactionCustomerCardProps {
  customer: CustomerData | null;
}

const TransactionCustomerCard: React.FC<TransactionCustomerCardProps> = ({ customer }) => {
  return (
    <div>
      <p className="text-sm font-medium mb-1">Customer</p>
      <div className="rounded-md bg-muted p-3">
        {customer ? (
          <div className="space-y-1">
            <p className="font-medium">{customer.first_name} {customer.last_name}</p>
            {customer.email && <p className="text-sm">{customer.email}</p>}
            {customer.phone && <p className="text-sm">{customer.phone}</p>}
          </div>
        ) : (
          <p>Walk-in Customer</p>
        )}
      </div>
    </div>
  );
};

export default TransactionCustomerCard;
