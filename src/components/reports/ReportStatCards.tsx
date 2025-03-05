
import React from "react";
import StatCard from "@/components/StatCard";
import { DollarSign, TrendingUp, Users } from "lucide-react";
import { formatCurrency, formatNumber } from "@/utils/formatters";

interface ReportStatCardsProps {
  stats: {
    totalRevenue: number;
    revenueTrend: number;
    avgTransaction: number;
    avgTransactionTrend: number;
    customerCount: number;
    customerTrend: number;
  };
  isLoading: boolean;
}

const ReportStatCards: React.FC<ReportStatCardsProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Revenue"
          value="Loading..."
          icon={<DollarSign />}
        />
        <StatCard
          title="Avg. Transaction"
          value="Loading..."
          icon={<DollarSign />}
        />
        <StatCard
          title="Total Customers"
          value="Loading..."
          icon={<Users />}
        />
        <StatCard
          title="Sales Growth"
          value="Loading..."
          icon={<TrendingUp />}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Revenue"
        value={formatCurrency(stats.totalRevenue)}
        icon={<DollarSign />}
        trend={stats.revenueTrend !== 0 ? { 
          value: stats.revenueTrend, 
          positive: stats.revenueTrend > 0,
          periodLabel: "last month"
        } : undefined}
      />
      <StatCard
        title="Avg. Transaction"
        value={formatCurrency(stats.avgTransaction)}
        icon={<DollarSign />}
        trend={stats.avgTransactionTrend !== 0 ? { 
          value: stats.avgTransactionTrend, 
          positive: stats.avgTransactionTrend > 0,
          periodLabel: "last month"
        } : undefined}
      />
      <StatCard
        title="Total Customers"
        value={formatNumber(stats.customerCount)}
        icon={<Users />}
        trend={stats.customerTrend !== 0 ? { 
          value: stats.customerTrend, 
          positive: stats.customerTrend > 0,
          periodLabel: "last month" 
        } : undefined}
      />
      <StatCard
        title="Sales Growth"
        value={`${stats.revenueTrend.toFixed(1)}%`}
        icon={<TrendingUp />}
        trend={stats.revenueTrend !== 0 ? { 
          value: stats.revenueTrend, 
          positive: stats.revenueTrend > 0,
          periodLabel: "last month"
        } : undefined}
      />
    </div>
  );
};

export default ReportStatCards;
