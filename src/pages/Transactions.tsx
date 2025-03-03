
import React, { useState } from "react";
import Layout from "@/components/Layout";
import TransactionStats from "@/components/transactions/TransactionStats";
import TransactionContent from "@/components/transactions/TransactionContent";

const Transactions = () => {
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);

  const handleTransactionSelect = (transactionId: string) => {
    setSelectedTransactionId(transactionId);
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Transaction Tracking</h1>
      </div>

      <TransactionStats />
      
      <TransactionContent onSelectTransaction={handleTransactionSelect} />
    </Layout>
  );
};

export default Transactions;
