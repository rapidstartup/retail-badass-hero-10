
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CalendarRange, BarChart3 } from "lucide-react";
import type { Customer, Transaction } from "@/types/index";
import { format, subDays, subWeeks, subMonths, isAfter } from "date-fns";

interface TimeframeOption {
  label: string;
  value: string;
  icon: React.ReactNode;
  getStartDate: () => Date;
}

interface ClientOverviewSectionProps {
  customer: Customer;
  transactions: Transaction[];
}

const ClientOverviewSection: React.FC<ClientOverviewSectionProps> = ({
  customer,
  transactions,
}) => {
  const timeframeOptions: TimeframeOption[] = [
    {
      label: "Today",
      value: "today",
      icon: <Clock className="h-4 w-4" />,
      getStartDate: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
      },
    },
    {
      label: "This Week",
      value: "this-week",
      icon: <Calendar className="h-4 w-4" />,
      getStartDate: () => subDays(new Date(), 7),
    },
    {
      label: "This Month",
      value: "this-month",
      icon: <CalendarRange className="h-4 w-4" />,
      getStartDate: () => subDays(new Date(), 30),
    },
    {
      label: "All Time",
      value: "all-time",
      icon: <BarChart3 className="h-4 w-4" />,
      getStartDate: () => new Date(0), // Beginning of time
    },
  ];

  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("this-month");
  
  const getTimeframeStartDate = () => {
    const option = timeframeOptions.find(o => o.value === selectedTimeframe);
    return option ? option.getStartDate() : subDays(new Date(), 30);
  };
  
  const getFilteredTransactions = () => {
    const startDate = getTimeframeStartDate();
    return transactions.filter(transaction => {
      const txDate = transaction.created_at ? new Date(transaction.created_at) : null;
      return txDate && isAfter(txDate, startDate);
    });
  };
  
  const filteredTransactions = getFilteredTransactions();
  
  // Calculate metrics
  const calculateMetrics = () => {
    const txCount = filteredTransactions.length;
    const totalSpent = filteredTransactions.reduce((sum, tx) => sum + (tx.total || 0), 0);
    const avgTransaction = txCount > 0 ? totalSpent / txCount : 0;
    
    // Calculate most purchased item
    const itemCounts: Record<string, number> = {};
    filteredTransactions.forEach(tx => {
      if (tx.items && Array.isArray(tx.items)) {
        tx.items.forEach(item => {
          const itemName = typeof item === 'object' ? item.name : String(item);
          itemCounts[itemName] = (itemCounts[itemName] || 0) + 1;
        });
      }
    });
    
    let mostPurchasedItem = "None";
    let highestCount = 0;
    
    Object.entries(itemCounts).forEach(([item, count]) => {
      if (count > highestCount) {
        mostPurchasedItem = item;
        highestCount = count;
      }
    });
    
    return {
      txCount,
      totalSpent,
      avgTransaction,
      mostPurchasedItem,
    };
  };
  
  const metrics = calculateMetrics();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {timeframeOptions.map((option) => (
          <Button
            key={option.value}
            variant={selectedTimeframe === option.value ? "default" : "outline"}
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setSelectedTimeframe(option.value)}
          >
            {option.icon}
            <span>{option.label}</span>
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalSpent)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Over {filteredTransactions.length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Transaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.avgTransaction)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Per transaction
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Loyalty Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customer.loyalty_points || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Current balance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Most Purchased
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold truncate">{metrics.mostPurchasedItem}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Favorite item
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Spending Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">
            Spending chart will be implemented here using Recharts
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientOverviewSection;
