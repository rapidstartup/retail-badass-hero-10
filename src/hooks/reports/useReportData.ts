
import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { addMonths, startOfWeek, endOfWeek, startOfDay, endOfDay } from "date-fns";
import { toast } from "sonner";

export const useReportData = () => {
  const [activeTab, setActiveTab] = useState("sales");
  
  // Set default date range to current week (Monday-Sunday)
  const today = new Date();
  const defaultFrom = startOfWeek(today, { weekStartsOn: 1 }); // 1 = Monday
  const defaultTo = endOfWeek(today, { weekStartsOn: 1 }); // Sunday
  
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date | undefined;
  }>({
    from: defaultFrom,
    to: defaultTo,
  });

  // Handler for date range changes that correctly types the data
  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range?.from) {
      setDateRange({
        from: range.from,
        to: range.to || range.from
      });
    }
  };

  // Fetch transactions based on the selected date range
  const { data: transactionData, isLoading: transactionsLoading } = useQuery({
    queryKey: ['report-transactions', dateRange],
    queryFn: async () => {
      try {
        // Make sure we have end of day for the to date
        const toDate = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);
        
        const { data: transactions, error } = await supabase
          .from('transactions')
          .select('id, total, created_at, items, tax, subtotal, customer_id')
          .gte('created_at', startOfDay(dateRange.from).toISOString())
          .lte('created_at', toDate.toISOString())
          .eq('status', 'completed');

        if (error) throw error;
        
        // Calculate previous period (same days from previous month)
        const previousFrom = addMonths(dateRange.from, -1);
        const previousTo = dateRange.to ? addMonths(dateRange.to, -1) : addMonths(dateRange.from, -1);
        
        const { data: previousTransactions, error: prevError } = await supabase
          .from('transactions')
          .select('id, total, created_at, items, tax, subtotal, customer_id')
          .gte('created_at', startOfDay(previousFrom).toISOString())
          .lte('created_at', endOfDay(previousTo).toISOString())
          .eq('status', 'completed');

        if (prevError) throw prevError;

        // Get unique customers for the selected period
        const uniqueCustomers = [...new Set(transactions.map(t => t.customer_id).filter(Boolean))];
        const previousUniqueCustomers = [...new Set(previousTransactions.map(t => t.customer_id).filter(Boolean))];

        // Calculate revenue totals
        const totalRevenue = transactions.reduce((sum, tx) => sum + (tx.total || 0), 0);
        const previousTotalRevenue = previousTransactions.reduce((sum, tx) => sum + (tx.total || 0), 0);
        
        // Calculate average transaction value
        const avgTransaction = transactions.length > 0 ? totalRevenue / transactions.length : 0;
        const previousAvgTransaction = previousTransactions.length > 0 ? 
          previousTotalRevenue / previousTransactions.length : 0;
        
        // Calculate growth percentages
        const revenueTrend = previousTotalRevenue > 0 ? 
          ((totalRevenue - previousTotalRevenue) / previousTotalRevenue) * 100 : 0;
          
        const avgTransactionTrend = previousAvgTransaction > 0 ? 
          ((avgTransaction - previousAvgTransaction) / previousAvgTransaction) * 100 : 0;
          
        const customerTrend = previousUniqueCustomers.length > 0 ? 
          ((uniqueCustomers.length - previousUniqueCustomers.length) / previousUniqueCustomers.length) * 100 : 0;
        
        // Process transactions to get daily sales data
        const dailySalesMap = new Map();
        transactions.forEach(tx => {
          const date = new Date(tx.created_at).toISOString().split('T')[0];
          const current = dailySalesMap.get(date) || 0;
          dailySalesMap.set(date, current + tx.total);
        });
        
        const dailySales = Array.from(dailySalesMap.entries()).map(([date, sales]) => ({
          date: new Date(date),
          sales
        })).sort((a, b) => a.date.getTime() - b.date.getTime());

        // Process items to get top products
        const productSales = new Map();
        transactions.forEach(tx => {
          try {
            const items = typeof tx.items === 'string' ? JSON.parse(tx.items) : tx.items;
            if (Array.isArray(items)) {
              items.forEach(item => {
                const productName = item.name;
                const quantity = item.quantity || 1;
                const revenue = item.price * quantity;
                
                const current = productSales.get(productName) || { quantity: 0, revenue: 0 };
                productSales.set(productName, {
                  quantity: current.quantity + quantity,
                  revenue: current.revenue + revenue
                });
              });
            }
          } catch (e) {
            console.error("Error parsing transaction items:", e);
          }
        });
        
        const topProducts = Array.from(productSales.entries())
          .map(([name, { quantity, revenue }]) => ({ name, quantity, revenue, sales: quantity }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);

        return {
          transactions,
          previousTransactions,
          totalRevenue,
          previousTotalRevenue,
          revenueTrend,
          avgTransaction,
          previousAvgTransaction,
          avgTransactionTrend,
          customerCount: uniqueCustomers.length,
          previousCustomerCount: previousUniqueCustomers.length,
          customerTrend,
          dailySales,
          topProducts
        };
      } catch (error) {
        console.error("Error fetching report data:", error);
        toast.error("Failed to load report data. Please try again.");
        return {
          transactions: [],
          previousTransactions: [],
          totalRevenue: 0,
          previousTotalRevenue: 0,
          revenueTrend: 0,
          avgTransaction: 0,
          previousAvgTransaction: 0,
          avgTransactionTrend: 0,
          customerCount: 0,
          previousCustomerCount: 0,
          customerTrend: 0,
          dailySales: [],
          topProducts: []
        };
      }
    },
    enabled: !!dateRange.from,
  });

  // Sample inventory status data (we'll implement real data in a future update)
  const inventoryStatus = [
    { product: "Coffee Beans", stock: 24, reorderLevel: 10, status: "Good" as const },
    { product: "Tea Bags", stock: 8, reorderLevel: 15, status: "Low" as const },
    { product: "Cups", stock: 150, reorderLevel: 50, status: "Good" as const },
    { product: "Milk", stock: 3, reorderLevel: 5, status: "Low" as const },
    { product: "Sugar", stock: 2, reorderLevel: 5, status: "Critical" as const },
  ];

  // Sample customer data (we'll implement real data in a future update)
  const topCustomers = [
    { name: "John Doe", spent: 1245.67, visits: 12 },
    { name: "Jane Smith", spent: 987.45, visits: 8 },
    { name: "Bob Johnson", spent: 754.32, visits: 5 },
    { name: "Alice Brown", spent: 643.21, visits: 4 },
    { name: "Charlie Wilson", spent: 512.98, visits: 3 },
  ];

  return {
    activeTab,
    setActiveTab,
    dateRange,
    handleDateRangeChange,
    isLoading: transactionsLoading,
    topProducts: transactionData?.topProducts || [],
    dailySales: transactionData?.dailySales || [],
    topCustomers,
    inventoryStatus,
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
