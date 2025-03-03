
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/StatCard";
import { Calendar, DollarSign, TrendingUp, Users } from "lucide-react";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { DateRange } from "react-day-picker";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("sales");
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date | undefined;
  }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
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

  // Sample data for demonstration
  const topProducts = [
    { name: "Coffee", quantity: 152, revenue: 456 },
    { name: "Tea", quantity: 98, revenue: 294 },
    { name: "Sandwich", quantity: 64, revenue: 384 },
    { name: "Cookie", quantity: 87, revenue: 174 },
    { name: "Muffin", quantity: 45, revenue: 135 },
  ];

  const dailySales = [
    { date: new Date("2023-05-01"), sales: 345.67 },
    { date: new Date("2023-05-02"), sales: 412.89 },
    { date: new Date("2023-05-03"), sales: 298.45 },
    { date: new Date("2023-05-04"), sales: 512.34 },
    { date: new Date("2023-05-05"), sales: 389.75 },
  ];

  const topCustomers = [
    { name: "John Doe", spent: 1245.67, visits: 12 },
    { name: "Jane Smith", spent: 987.45, visits: 8 },
    { name: "Bob Johnson", spent: 754.32, visits: 5 },
    { name: "Alice Brown", spent: 643.21, visits: 4 },
    { name: "Charlie Wilson", spent: 512.98, visits: 3 },
  ];

  const inventoryStatus = [
    { product: "Coffee Beans", stock: 24, reorderLevel: 10, status: "Good" },
    { product: "Tea Bags", stock: 8, reorderLevel: 15, status: "Low" },
    { product: "Cups", stock: 150, reorderLevel: 50, status: "Good" },
    { product: "Milk", stock: 3, reorderLevel: 5, status: "Low" },
    { product: "Sugar", stock: 2, reorderLevel: 5, status: "Critical" },
  ];

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        
        <div className="flex flex-col md:flex-row items-center gap-4">
          <DatePickerWithRange
            dateRange={{
              from: dateRange.from,
              to: dateRange.to as Date
            }}
            setDateRange={handleDateRangeChange}
          />
          <Button>
            Export Report
          </Button>
        </div>
      </div>

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

      <Tabs defaultValue="sales" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 theme-section-bg mb-6">
          <TabsTrigger value="sales" className="data-[state=active]:theme-section-selected-bg">Sales</TabsTrigger>
          <TabsTrigger value="inventory" className="data-[state=active]:theme-section-selected-bg">Inventory</TabsTrigger>
          <TabsTrigger value="customers" className="data-[state=active]:theme-section-selected-bg">Customers</TabsTrigger>
          <TabsTrigger value="predictive" className="data-[state=active]:theme-section-selected-bg">Predictive</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProducts.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell className="text-right">{product.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(product.revenue)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Sales</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dailySales.map((day, index) => (
                      <TableRow key={index}>
                        <TableCell>{formatDate(day.date)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(day.sales)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Current Stock</TableHead>
                    <TableHead className="text-right">Reorder Level</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryStatus.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.product}</TableCell>
                      <TableCell className="text-right">{item.stock}</TableCell>
                      <TableCell className="text-right">{item.reorderLevel}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          item.status === 'Good' ? 'bg-green-100 text-green-800' :
                          item.status === 'Low' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Total Spent</TableHead>
                    <TableHead className="text-right">Visits</TableHead>
                    <TableHead className="text-right">Avg. Per Visit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topCustomers.map((customer, index) => (
                    <TableRow key={index}>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell className="text-right">{formatCurrency(customer.spent)}</TableCell>
                      <TableCell className="text-right">{customer.visits}</TableCell>
                      <TableCell className="text-right">{formatCurrency(customer.spent / customer.visits)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="predictive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Predictive Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">Predictive analytics are being calculated...</p>
                <p className="mt-2">This feature is coming soon!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Reports;
