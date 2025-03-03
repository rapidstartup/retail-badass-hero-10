
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientTransactionHistory from "./ClientTransactionHistory";
import ClientPaymentMethods from "./ClientPaymentMethods";
import type { Transaction, Customer } from "@/types/index";

interface ClientTabsContentProps {
  transactions: Transaction[];
  customer: Customer;
}

const ClientTabsContent: React.FC<ClientTabsContentProps> = ({ transactions, customer }) => {
  return (
    <Tabs defaultValue="history">
      <TabsList className="mb-4 theme-container-bg">
        <TabsTrigger value="history">Transaction History</TabsTrigger>
        <TabsTrigger value="payment">Payment Methods</TabsTrigger>
      </TabsList>
      
      <TabsContent value="history">
        <ClientTransactionHistory transactions={transactions} />
      </TabsContent>
      
      <TabsContent value="payment">
        <ClientPaymentMethods customer={customer} />
      </TabsContent>
    </Tabs>
  );
};

export default ClientTabsContent;
