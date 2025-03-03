
import React, { useState } from "react";
import Layout from "@/components/Layout";
import TransactionStats from "@/components/transactions/TransactionStats";
import TransactionContent from "@/components/transactions/TransactionContent";
import TransactionDetailPanel from "@/components/transactions/TransactionDetailPanel";

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* This section is intentionally left empty as per user request */}
        </div>
        
        <div>
          <TransactionDetailPanel 
            transactionId={selectedTransactionId} 
            onClose={() => setSelectedTransactionId(null)} 
          />
        </div>
      </div>
    </Layout>
  );
};

export default Transactions;
