
import React, { useState } from "react";
import { 
  BanknoteIcon, 
  CalendarIcon, 
  TrendingUp
} from "lucide-react";
import StatCard from "@/components/StatCard";
import { formatCurrency } from "@/utils/formatters";
import { useTransactionStats } from "@/hooks/useTransactionStats";
import { DateRange } from "react-day-picker";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PeriodType = 'day' | 'week' | 'month';

interface TransactionStatsProps {
  dateRange?: DateRange;
}

const TransactionStats: React.FC<TransactionStatsProps> = ({ dateRange }) => {
  const [periodType, setPeriodType] = useState<PeriodType>('week');
  const { data: stats, isLoading: statsLoading } = useTransactionStats(dateRange, periodType);
  
  const getDateRangeDescription = () => {
    if (!dateRange?.from) return "";
    
    const fromDate = dateRange.from.toLocaleDateString();
    const toDate = dateRange.to ? dateRange.to.toLocaleDateString() : fromDate;
    
    return ` (${fromDate} - ${toDate})`;
  };

  // Get period subtitle text based on period type
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
    <div className="mb-6">
      <div className="flex justify-end mb-4">
        <Select value={periodType} onValueChange={(value) => setPeriodType(value as PeriodType)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Daily</SelectItem>
            <SelectItem value="week">Weekly</SelectItem>
            <SelectItem value="month">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Sales"
          subtitle={getDateRangeDescription()}
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
          subtitle={getDateRangeDescription()}
          value={statsLoading ? "Loading..." : formatCurrency(stats?.avgTransactionValue || 0)}
          icon={<TrendingUp />}
        />
        <StatCard
          title="Trend"
          subtitle={getPeriodSubtitle(periodType)}
          value={statsLoading ? "Loading..." : `${stats?.salesTrend.toFixed(1) || 0}%`}
          icon={<TrendingUp />}
          trend={stats?.salesTrend ? { 
            value: stats.salesTrend, 
            positive: stats.salesTrend > 0,
            periodLabel: stats?.periodLabel 
          } : undefined}
        />
      </div>
    </div>
  );
};

export default TransactionStats;
