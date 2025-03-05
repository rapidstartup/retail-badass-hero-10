
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { PeriodType } from "@/hooks/dashboard/types";
import { useDashboardStats } from "@/hooks/dashboard";
import { useSalesOverview } from "@/hooks/useSalesOverview";
import { useTopProducts } from "@/hooks/useTopProducts";
import { useRecentTransactions } from "@/hooks/useRecentTransactions";

// Import our new dashboard components
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCards from "@/components/dashboard/StatCards";
import ChartSection from "@/components/dashboard/ChartSection";
import RecentTransactionsTable from "@/components/dashboard/RecentTransactionsTable";

const Dashboard = () => {
  const [periodType, setPeriodType] = useState<PeriodType>('week');
  
  const { data: stats, isLoading: statsLoading } = useDashboardStats(periodType);
  const { data: salesData, isLoading: salesLoading } = useSalesOverview();
  const { data: topProducts, isLoading: productsLoading } = useTopProducts();
  const { data: recentTransactions, isLoading: transactionsLoading } = useRecentTransactions(5, periodType);
  
  const handlePeriodChange = (value: string) => {
    setPeriodType(value as PeriodType);
  };
  
  return (
    <Layout>
      <DashboardHeader 
        periodType={periodType} 
        onPeriodChange={handlePeriodChange} 
      />

      <StatCards
        stats={stats}
        statsLoading={statsLoading}
        periodType={periodType}
      />

      <ChartSection
        salesData={salesData}
        salesLoading={salesLoading}
        topProducts={topProducts}
        productsLoading={productsLoading}
      />

      <RecentTransactionsTable
        transactions={recentTransactions}
        isLoading={transactionsLoading}
        periodType={periodType}
      />
    </Layout>
  );
};

export default Dashboard;
