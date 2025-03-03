
import React from "react";
import { 
  BanknoteIcon, 
  CalendarIcon, 
  TrendingUp
} from "lucide-react";
import StatCard from "@/components/StatCard";
import { formatCurrency } from "@/utils/formatters";
import { useTransactionStats } from "@/hooks/useTransactionStats";

const TransactionStats = () => {
  const { data: stats, isLoading: statsLoading } = useTransactionStats();
  
  return (
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
  );
};

export default TransactionStats;
