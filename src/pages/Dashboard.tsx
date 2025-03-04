
import React from "react";
import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import { formatCurrency, formatNumber } from "@/utils/formatters";
import { 
  CreditCard, 
  DollarSign, 
  Users, 
  ShoppingCart,
  BarChart,
  TrendingUp 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart as ReBarChart, Bar } from "recharts";
import { useNavigate } from "react-router-dom";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useSalesOverview } from "@/hooks/useSalesOverview";
import { useTopProducts } from "@/hooks/useTopProducts";
import { useRecentTransactions } from "@/hooks/useRecentTransactions";

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Fetch dashboard data
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: salesData, isLoading: salesLoading } = useSalesOverview();
  const { data: topProducts, isLoading: productsLoading } = useTopProducts();
  const { data: recentTransactions, isLoading: transactionsLoading } = useRecentTransactions();
  
  const handleNewTransaction = () => {
    navigate("/pos");
  };
  
  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button onClick={handleNewTransaction}>New Transaction</Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard 
          title="Today's Sales"
          description={!statsLoading ? stats?.formattedDate : undefined}
          value={statsLoading ? "Loading..." : formatCurrency(stats?.todaySales || 0)}
          trend={!statsLoading && stats ? { value: stats.salesTrend, positive: stats.salesTrend > 0 } : undefined}
          icon={<DollarSign className="h-6 w-6" />}
        />
        <StatCard 
          title="Transactions" 
          value={statsLoading ? "Loading..." : formatNumber(stats?.transactionCount || 0)}
          trend={!statsLoading && stats ? { value: stats.transactionTrend, positive: stats.transactionTrend > 0 } : undefined}
          icon={<CreditCard className="h-6 w-6" />}
        />
        <StatCard 
          title="New Customers" 
          value={statsLoading ? "Loading..." : formatNumber(stats?.newCustomersCount || 0)}
          trend={!statsLoading && stats ? { value: stats.customersTrend, positive: stats.customersTrend > 0 } : undefined}
          icon={<Users className="h-6 w-6" />}
        />
        <StatCard 
          title="Items Sold" 
          value={statsLoading ? "Loading..." : formatNumber(stats?.itemsSold || 0)}
          trend={!statsLoading && stats ? { value: stats.itemsSoldTrend, positive: stats.itemsSoldTrend > 0 } : undefined}
          icon={<ShoppingCart className="h-6 w-6" />}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Monthly sales performance</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              {salesLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Loading sales data...</p>
                </div>
              ) : (
                <AreaChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis 
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Revenue']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary) / 0.2)" 
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best selling items this week</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              {productsLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Loading product data...</p>
                </div>
              ) : (
                <ReBarChart data={topProducts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" />
                </ReBarChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest sales activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {transactionsLoading ? (
              <div className="flex items-center justify-center h-24">
                <p className="text-muted-foreground">Loading transactions...</p>
              </div>
            ) : recentTransactions && recentTransactions.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-medium py-2 px-4">ID</th>
                    <th className="text-left font-medium py-2 px-4">Customer</th>
                    <th className="text-left font-medium py-2 px-4">Items</th>
                    <th className="text-left font-medium py-2 px-4">Amount</th>
                    <th className="text-left font-medium py-2 px-4">Time</th>
                    <th className="text-left font-medium py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{transaction.id.substring(0, 8)}</td>
                      <td className="py-3 px-4">{transaction.customer}</td>
                      <td className="py-3 px-4">{transaction.items}</td>
                      <td className="py-3 px-4">{formatCurrency(transaction.amount)}</td>
                      <td className="py-3 px-4">
                        {transaction.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/transactions?id=${transaction.id}`)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No recent transactions</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Dashboard;
