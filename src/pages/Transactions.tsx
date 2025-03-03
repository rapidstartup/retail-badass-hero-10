
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import TransactionList from "@/components/transactions/TransactionList";
import TransactionFilters from "@/components/transactions/TransactionFilters";
import StatCard from "@/components/StatCard";
import { BanknoteIcon, ReceiptIcon, ShoppingBag, Users } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import type { TransactionFilters as TransactionFiltersType } from "@/types/transaction";

const fetchTransactionStats = async () => {
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('total, status, payment_method')
    .order('created_at', { ascending: false });

  if (error) throw error;

  const totalSales = transactions.reduce((sum, tx) => 
    tx.status === 'completed' ? sum + (tx.total || 0) : sum, 0);
  
  const completedCount = transactions.filter(tx => tx.status === 'completed').length;
  const openTabsCount = transactions.filter(tx => tx.status === 'open').length;
  
  const paymentMethods = transactions
    .filter(tx => tx.status === 'completed')
    .reduce((acc: Record<string, number>, tx) => {
      const method = tx.payment_method || 'unknown';
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {});
  
  const topPaymentMethod = Object.entries(paymentMethods)
    .sort((a, b) => b[1] - a[1])
    .map(([method]) => method)[0] || 'None';

  return {
    totalSales,
    completedCount,
    openTabsCount,
    topPaymentMethod
  };
};

const Transactions = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState<TransactionFiltersType>({
    dateRange: {
      from: new Date(new Date().setDate(new Date().getDate() - 30)),
      to: new Date()
    },
    searchQuery: ''
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["transaction-stats"],
    queryFn: fetchTransactionStats
  });

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Sales"
          value={statsLoading ? "Loading..." : formatCurrency(stats?.totalSales || 0)}
          icon={<BanknoteIcon />}
        />
        <StatCard
          title="Completed Transactions"
          value={statsLoading ? "Loading..." : stats?.completedCount || 0}
          icon={<ReceiptIcon />}
        />
        <StatCard
          title="Open Tabs"
          value={statsLoading ? "Loading..." : stats?.openTabsCount || 0}
          icon={<ShoppingBag />}
        />
        <StatCard
          title="Top Payment Method"
          value={statsLoading ? "Loading..." : stats?.topPaymentMethod || "None"}
          icon={<Users />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction List</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionFilters filters={filters} setFilters={setFilters} />
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto theme-section-bg mb-4">
              <TabsTrigger value="all" className="data-[state=active]:theme-section-selected-bg">All</TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:theme-section-selected-bg">Completed</TabsTrigger>
              <TabsTrigger value="open" className="data-[state=active]:theme-section-selected-bg">Open Tabs</TabsTrigger>
              <TabsTrigger value="refunded" className="data-[state=active]:theme-section-selected-bg">Refunded</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <TransactionList status="all" filters={filters} />
            </TabsContent>
            
            <TabsContent value="completed">
              <TransactionList status="completed" filters={filters} />
            </TabsContent>
            
            <TabsContent value="open">
              <TransactionList status="open" filters={filters} />
            </TabsContent>
            
            <TabsContent value="refunded">
              <TransactionList status="refunded" filters={filters} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Transactions;
