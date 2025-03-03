
import React from "react";
import { 
  BanknoteIcon, 
  CalendarIcon, 
  TrendingUp
} from "lucide-react";
import StatCard from "@/components/StatCard";
import { formatCurrency } from "@/utils/formatters";
import { useTransactionStats } from "@/hooks/useTransactionStats";
import { DateRange } from "react-day-picker";

interface TransactionStatsProps {
  dateRange?: DateRange;
}

const TransactionStats: React.FC<TransactionStatsProps> = ({ dateRange }) => {
  const { data: stats, isLoading: statsLoading } = useTransactionStats(dateRange);
  
  const getDateRangeDescription = () => {
    if (!dateRange?.from) return "";
    
    const fromDate = dateRange.from.toLocaleDateString();
    const toDate = dateRange.to ? dateRange.to.toLocaleDateString() : fromDate;
    
    return ` (${fromDate} - ${toDate})`;
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <StatCard
        title={`Total Sales${getDateRangeDescription()}`}
        value={statsLoading ? "Loading..." : formatCurrency(stats?.totalSales || 0)}
        icon={<BanknoteIcon />}
      />
      <StatCard
        title="Today's Sales"
        value={statsLoading ? "Loading..." : formatCurrency(stats?.todaySales || 0)}
        icon={<CalendarIcon />}
      />
      <StatCard
        title={`Avg. Transaction${getDateRangeDescription()}`}
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
