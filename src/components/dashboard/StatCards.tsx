
import React from "react";
import StatCard from "@/components/StatCard";
import { formatCurrency, formatNumber, formatDate } from "@/utils/formatters";
import { 
  CreditCard, 
  DollarSign, 
  Users, 
  ShoppingCart 
} from "lucide-react";
import { DashboardStats, PeriodType } from "@/hooks/dashboard/types";

interface StatCardsProps {
  stats: DashboardStats | undefined;
  statsLoading: boolean;
  periodType: PeriodType;
}

const StatCards: React.FC<StatCardsProps> = ({ 
  stats, 
  statsLoading,
  periodType
}) => {
  const getPeriodSubtitle = (type: PeriodType): string => {
    switch (type) {
      case 'day':
        return 'Today';
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      default:
        return '';
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <StatCard 
        title="Today's Sales"
        description={!statsLoading ? formatDate(new Date()) : undefined}
        value={statsLoading ? "Loading..." : formatCurrency(stats?.todaySales || 0)}
        trend={!statsLoading && stats ? { 
          value: stats.todaySalesTrend, 
          positive: stats.todaySalesTrend > 0,
          periodLabel: "yesterday"
        } : undefined}
        icon={<DollarSign className="h-6 w-6" />}
      />
      <StatCard 
        title="Transactions"
        subtitle={getPeriodSubtitle(periodType)}
        value={statsLoading ? "Loading..." : formatNumber(stats?.transactionCount || 0)}
        trend={!statsLoading && stats ? { 
          value: stats.transactionTrend, 
          positive: stats.transactionTrend > 0,
          periodLabel: stats.periodLabel
        } : undefined}
        icon={<CreditCard className="h-6 w-6" />}
      />
      <StatCard 
        title="New Customers"
        subtitle={getPeriodSubtitle(periodType)}
        value={statsLoading ? "Loading..." : formatNumber(stats?.newCustomersCount || 0)}
        trend={!statsLoading && stats ? { 
          value: stats.customersTrend, 
          positive: stats.customersTrend > 0,
          periodLabel: stats.periodLabel
        } : undefined}
        icon={<Users className="h-6 w-6" />}
      />
      <StatCard 
        title="Items Sold"
        subtitle={getPeriodSubtitle(periodType)}
        value={statsLoading ? "Loading..." : formatNumber(periodType === 'day' ? stats?.todayItemsSold || 0 : stats?.itemsSold || 0)}
        trend={!statsLoading && stats ? { 
          value: stats.itemsSoldTrend, 
          positive: stats.itemsSoldTrend > 0,
          periodLabel: stats.periodLabel
        } : undefined}
        icon={<ShoppingCart className="h-6 w-6" />}
      />
    </div>
  );
};

export default StatCards;
