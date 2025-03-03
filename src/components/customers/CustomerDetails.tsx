import React, { useState } from 'react';
import { CustomerEditForm } from './CustomerEditForm';
import { CustomerTransactionList } from './CustomerTransactionList';
import CustomerCards from './CustomerCards';
import { CustomerLoyalty } from './CustomerLoyalty';
import type { Customer, GiftCard } from '@/types/database.types';

export interface CustomerDetailsProps {
  customer: Customer;
  onUpdate?: (customer: Customer) => Promise<void>;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({ customer, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer>(customer);
  
  const handleSubmit = async (data: Partial<Customer>) => {
    try {
      const updatedCustomer = { ...currentCustomer, ...data };
      if (onUpdate) {
        await onUpdate(updatedCustomer as Customer);
      }
      setCurrentCustomer(updatedCustomer as Customer);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };
  
  return (
    <div>
      {isEditing ? (
        <CustomerEditForm 
          customer={currentCustomer} 
          onSubmit={handleSubmit}
          onCancel={handleCancel} 
        />
      ) : (
        <div>
          {/* Customer details view */}
          <h2>{currentCustomer.first_name} {currentCustomer.last_name}</h2>
          <p>Email: {currentCustomer.email}</p>
          {/* Other customer fields */}
          
          <CustomerLoyalty 
            customer={currentCustomer} 
            onUpdate={onUpdate} 
          />
          
          <CustomerTransactionList customerId={currentCustomer.id} />
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;
