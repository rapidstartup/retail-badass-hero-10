
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/StatCard";
import { Receipt, ShoppingBag, CreditCard } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

interface ClientOverviewProps {
  metrics: {
    avgTransaction: number;
    numTransactions: number;
    totalSpent: number;
    mostPurchased: string;
    currentTabBalance: number;
    spendToNextTier: number;
  };
  timeframe: string;
  setTimeframe: (timeframe: string) => void;
}

const ClientOverview: React.FC<ClientOverviewProps> = ({ metrics, timeframe, setTimeframe }) => {
  const periodLabels = {
    "30days": "previous 30 days",
    "90days": "previous 90 days",
    "alltime": "all time"
  };

  return (
    <Card className="theme-container-bg border">
      <CardHeader>
        <CardTitle>Client Overview</CardTitle>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className={`${timeframe === "30days" ? "bg-theme-section-selected" : ""} border-theme-accent text-theme-accent hover:bg-theme-accent hover:text-white`}
            onClick={() => setTimeframe("30days")}
          >
            Last 30 Days
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className={`${timeframe === "90days" ? "bg-theme-section-selected" : ""} border-theme-accent text-theme-accent hover:bg-theme-accent hover:text-white`}
            onClick={() => setTimeframe("90days")}
          >
            Last 90 Days
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className={`${timeframe === "alltime" ? "bg-theme-section-selected" : ""} border-theme-accent text-theme-accent hover:bg-theme-accent hover:text-white`}
            onClick={() => setTimeframe("alltime")}
          >
            All Time
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            title="Avg. Transaction" 
            value={formatCurrency(metrics.avgTransaction)}
            icon={<Receipt className="h-6 w-6" />}
            trend={timeframe !== "alltime" ? {
              value: 0, // This would need to be calculated based on previous periods
              positive: true,
              periodLabel: periodLabels[timeframe as keyof typeof periodLabels]
            } : undefined}
          />
          <StatCard 
            title="Transactions" 
            value={metrics.numTransactions.toString()}
            icon={<ShoppingBag className="h-6 w-6" />}
            trend={timeframe !== "alltime" ? {
              value: 0, // This would need to be calculated based on previous periods
              positive: true,
              periodLabel: periodLabels[timeframe as keyof typeof periodLabels]
            } : undefined}
          />
          <StatCard 
            title="Total Spent" 
            value={formatCurrency(metrics.totalSpent)}
            icon={<CreditCard className="h-6 w-6" />}
            trend={timeframe !== "alltime" ? {
              value: 0, // This would need to be calculated based on previous periods
              positive: true,
              periodLabel: periodLabels[timeframe as keyof typeof periodLabels]
            } : undefined}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientOverview;
