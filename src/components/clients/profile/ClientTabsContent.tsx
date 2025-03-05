
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientTransactionHistory from "./ClientTransactionHistory";
import ClientPaymentMethods from "./ClientPaymentMethods";
import type { Transaction } from "@/types/transaction";
import type { Customer } from "@/types/index";

interface ClientTabsContentProps {
  transactions: Transaction[];
  customer: Customer;
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
  };
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  loading: boolean;
}

const ClientTabsContent: React.FC<ClientTabsContentProps> = ({
  transactions,
  customer,
  pagination,
  onPageChange,
  onPageSizeChange,
  loading
}) => {
  return (
    <Tabs defaultValue="history">
      <TabsList className="mb-4 theme-container-bg">
        <TabsTrigger value="history">Transaction History</TabsTrigger>
        <TabsTrigger value="payment">Payment Methods</TabsTrigger>
      </TabsList>
      
      <TabsContent value="history">
        <ClientTransactionHistory 
          transactions={transactions} 
          pagination={pagination}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          loading={loading}
        />
      </TabsContent>
      
      <TabsContent value="payment">
        <ClientPaymentMethods customer={customer} />
      </TabsContent>
    </Tabs>
  );
};

export default ClientTabsContent;
