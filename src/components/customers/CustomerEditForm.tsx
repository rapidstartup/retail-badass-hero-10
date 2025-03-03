import React from 'react';
import type { Customer } from '@/types/database.types';

export interface CustomerEditFormProps {
  customer: Customer;
  onSubmit: (data: Partial<Customer>) => Promise<void>;
}

export const CustomerEditForm: React.FC<CustomerEditFormProps> = ({ customer, onSubmit }) => {
  return (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-medium">Edit Customer</h3>
      <div>Form goes here</div>
      <div className="flex justify-end space-x-2">
        <button 
          className="px-4 py-2 border rounded bg-gray-100" 
          onClick={() => {}}
        >
          Cancel
        </button>
        <button 
          className="px-4 py-2 border rounded bg-blue-500 text-white" 
          onClick={() => onSubmit({first_name: customer.first_name})}
        >
          Save
        </button>
      </div>
    </div>
  );
}
