
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

// Mock data for the dashboard
const salesData = [
  { name: "Jan", total: 1500 },
  { name: "Feb", total: 2300 },
  { name: "Mar", total: 2000 },
  { name: "Apr", total: 2780 },
  { name: "May", total: 1890 },
  { name: "Jun", total: 2390 },
  { name: "Jul", total: 3490 },
];

const topProducts = [
  { name: "Coffee", sales: 124, revenue: 496 },
  { name: "Pastry", sales: 98, revenue: 392 },
  { name: "Sandwich", sales: 65, revenue: 455 },
  { name: "Juice", sales: 45, revenue: 225 },
];

const recentTransactions = [
  { id: "TRX-001", customer: "John Doe", amount: 42.50, items: 3, date: new Date(2023, 6, 15, 14, 30) },
  { id: "TRX-002", customer: "Sarah Smith", amount: 127.80, items: 7, date: new Date(2023, 6, 15, 13, 15) },
  { id: "TRX-003", customer: "Michael Brown", amount: 65.25, items: 2, date: new Date(2023, 6, 15, 11, 45) },
  { id: "TRX-004", customer: "Emily Johnson", amount: 32.10, items: 1, date: new Date(2023, 6, 15, 10, 20) },
];

const Index = () => {
  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button>New Transaction</Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard 
          title="Today's Sales" 
          value={formatCurrency(3240.50)}
          trend={{ value: 12, positive: true }}
          icon={<DollarSign className="h-6 w-6" />}
        />
        <StatCard 
          title="Transactions" 
          value={formatNumber(42)}
          trend={{ value: 8, positive: true }}
          icon={<CreditCard className="h-6 w-6" />}
        />
        <StatCard 
          title="New Customers" 
          value={formatNumber(5)}
          trend={{ value: 2, positive: false }}
          icon={<Users className="h-6 w-6" />}
        />
        <StatCard 
          title="Items Sold" 
          value={formatNumber(187)}
          trend={{ value: 10, positive: true }}
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
              <ReBarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="hsl(var(--primary))" />
              </ReBarChart>
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
                    <td className="py-3 px-4">{transaction.id}</td>
                    <td className="py-3 px-4">{transaction.customer}</td>
                    <td className="py-3 px-4">{transaction.items}</td>
                    <td className="py-3 px-4">{formatCurrency(transaction.amount)}</td>
                    <td className="py-3 px-4">
                      {transaction.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Index;
