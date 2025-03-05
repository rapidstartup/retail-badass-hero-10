
import { useDateRange } from "./useDateRange";
import { useTransactionReport } from "./useTransactionReport";
import { useReportTabs } from "./useReportTabs";
import { useCustomerReport } from "./useCustomerReport";

export const useReportData = () => {
  const { dateRange, handleDateRangeChange } = useDateRange();
  const { activeTab, setActiveTab } = useReportTabs();
  const { topCustomers } = useCustomerReport();
  
  const { data: transactionData, isLoading: transactionsLoading } = useTransactionReport(dateRange);

  return {
    activeTab,
    setActiveTab,
    dateRange,
    handleDateRangeChange,
    isLoading: transactionsLoading,
    topProducts: transactionData?.topProducts || [],
    dailySales: transactionData?.dailySales || [],
    topCustomers,
    stats: {
      totalRevenue: transactionData?.totalRevenue || 0,
      revenueTrend: transactionData?.revenueTrend || 0,
      avgTransaction: transactionData?.avgTransaction || 0,
      avgTransactionTrend: transactionData?.avgTransactionTrend || 0,
      customerCount: transactionData?.customerCount || 0,
      customerTrend: transactionData?.customerTrend || 0
    }
  };
};
