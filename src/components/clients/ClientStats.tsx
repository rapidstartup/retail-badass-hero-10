
import React from "react";
import { Users, CreditCard, ShoppingBag } from "lucide-react";
import StatCard from "@/components/StatCard";
import { formatCurrency } from "@/utils/formatters";

interface ClientStatsProps {
  totalClients: number;
  topSpender: number;
  averageSpend: number;
}

const ClientStats: React.FC<ClientStatsProps> = ({ 
  totalClients, 
  topSpender, 
  averageSpend 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard 
        title="Total Clients" 
        value={totalClients.toString()} 
        icon={<Users className="h-6 w-6" />} 
        className="theme-container-bg border"
      />
      <StatCard 
        title="Top Spender" 
        value={formatCurrency(topSpender)} 
        description="Highest client spending"
        icon={<CreditCard className="h-6 w-6" />} 
        className="theme-container-bg border"
      />
      <StatCard 
        title="Average Spend" 
        value={formatCurrency(averageSpend)} 
        icon={<ShoppingBag className="h-6 w-6" />} 
        className="theme-container-bg border"
      />
    </div>
  );
};

export default ClientStats;
