
import React from "react";
import StatCard from "@/components/StatCard";
import { DollarSign, TrendingUp, Users } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

const ReportStatCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Revenue"
        value={formatCurrency(12458.67)}
        icon={<DollarSign />}
        trend={{ value: 12.4, positive: true }}
      />
      <StatCard
        title="Avg. Transaction"
        value={formatCurrency(42.56)}
        icon={<DollarSign />}
        trend={{ value: 3.2, positive: true }}
      />
      <StatCard
        title="Total Customers"
        value="128"
        icon={<Users />}
        trend={{ value: 5.6, positive: true }}
      />
      <StatCard
        title="Sales Growth"
        value="24.8%"
        icon={<TrendingUp />}
        trend={{ value: 8.1, positive: true }}
      />
    </div>
  );
};

export default ReportStatCards;
