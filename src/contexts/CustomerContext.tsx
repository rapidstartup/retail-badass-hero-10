
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Customer, fetchCustomers, fetchCustomerById } from '@/api/customerApi';

interface CustomerContextType {
  customers: Customer[];
  loadingCustomers: boolean;
  selectedCustomer: Customer | null;
  setSelectedCustomer: (customer: Customer | null) => void;
  refreshCustomers: () => Promise<void>;
  getCustomerById: (id: string) => Promise<Customer | null>;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState<boolean>(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const refreshCustomers = async () => {
    setLoadingCustomers(true);
    const fetchedCustomers = await fetchCustomers();
    setCustomers(fetchedCustomers);
    setLoadingCustomers(false);
  };

  const getCustomerById = async (id: string): Promise<Customer | null> => {
    const customer = await fetchCustomerById(id);
    return customer;
  };

  useEffect(() => {
    refreshCustomers();
  }, []);

  return (
    <CustomerContext.Provider
      value={{
        customers,
        loadingCustomers,
        selectedCustomer,
        setSelectedCustomer,
        refreshCustomers,
        getCustomerById
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = (): CustomerContextType => {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
};
