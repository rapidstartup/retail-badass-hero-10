import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import TransactionList from "@/components/transactions/TransactionList";
import TransactionFilters from "@/components/transactions/TransactionFilters";
import StatCard from "@/components/StatCard";
import { 
  BanknoteIcon, 
  ReceiptIcon, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Clock, 
  CalendarIcon 
} from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import type { TransactionFilters as TransactionFiltersType } from "@/types/transaction";
import TransactionTimeline from "@/components/transactions/TransactionTimeline";
import TransactionDetailPanel from "@/components/transactions/TransactionDetailPanel";

const fetchTransactionStats = async () => {
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('total, status, payment_method, created_at')
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
  
  const avgTransactionValue = completedCount > 0 
    ? totalSales / completedCount 
    : 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTransactions = transactions.filter(tx => 
    new Date(tx.created_at) >= today && 
    tx.status === 'completed'
  );
  const todaySales = todayTransactions.reduce((sum, tx) => sum + (tx.total || 0), 0);
  
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);
  
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
  fourteenDaysAgo.setHours(0, 0, 0, 0);
  
  const last7DaysTransactions = transactions.filter(tx => 
    new Date(tx.created_at) >= sevenDaysAgo && 
    tx.status === 'completed'
  );
  
  const previous7DaysTransactions = transactions.filter(tx => 
    new Date(tx.created_at) >= fourteenDaysAgo && 
    new Date(tx.created_at) < sevenDaysAgo && 
    tx.status === 'completed'
  );
  
  const last7DaysSales = last7DaysTransactions.reduce((sum, tx) => sum + (tx.total || 0), 0);
  const previous7DaysSales = previous7DaysTransactions.reduce((sum, tx) => sum + (tx.total || 0), 0);
  
  const salesTrend = previous7DaysSales > 0 
    ? ((last7DaysSales - previous7DaysSales) / previous7DaysSales) * 100 
    : 0;

  return {
    totalSales,
    completedCount,
    openTabsCount,
    topPaymentMethod,
    avgTransactionValue,
    todaySales,
    salesTrend
  };
};

const Transactions = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
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

  const handleTransactionSelect = (transactionId: string) => {
    setSelectedTransactionId(transactionId);
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Transaction Tracking</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Sales"
          value={statsLoading ? "Loading..." : formatCurrency(stats?.totalSales || 0)}
          icon={<BanknoteIcon />}
        />
        <StatCard
          title="Today's Sales"
          value={statsLoading ? "Loading..." : formatCurrency(stats?.todaySales || 0)}
          icon={<CalendarIcon />}
        />
        <StatCard
          title="Avg. Transaction"
          value={statsLoading ? "Loading..." : formatCurrency(stats?.avgTransactionValue || 0)}
          icon={<TrendingUp />}
        />
        <StatCard
          title="Weekly Trend"
          value={statsLoading ? "Loading..." : `${stats?.salesTrend.toFixed(1) || 0}%`}
          icon={<TrendingUp />}
          trend={stats?.salesTrend ? { value: stats.salesTrend, positive: stats.salesTrend > 0 } : undefined}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
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
                  <TransactionList 
                    status="all" 
                    filters={filters} 
                    onSelectTransaction={handleTransactionSelect} 
                  />
                </TabsContent>
                
                <TabsContent value="completed">
                  <TransactionList 
                    status="completed" 
                    filters={filters} 
                    onSelectTransaction={handleTransactionSelect} 
                  />
                </TabsContent>
                
                <TabsContent value="open">
                  <TransactionList 
                    status="open" 
                    filters={filters} 
                    onSelectTransaction={handleTransactionSelect} 
                  />
                </TabsContent>
                
                <TabsContent value="refunded">
                  <TransactionList 
                    status="refunded" 
                    filters={filters} 
                    onSelectTransaction={handleTransactionSelect} 
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionTimeline />
            </CardContent>
          </Card>
        </div>
      </div>

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
