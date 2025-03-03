
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionList from "@/components/transactions/TransactionList";
import TransactionFilters from "@/components/transactions/TransactionFilters";
import { useSettings } from "@/contexts/SettingsContext";

const Transactions = () => {
  const { settings } = useSettings();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [filters, setFilters] = useState({
    dateRange: { from: undefined, to: undefined },
    paymentMethod: undefined,
    status: undefined,
    minimumAmount: undefined,
    maximumAmount: undefined,
    searchQuery: '',
  });

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Transaction Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionFilters filters={filters} setFilters={setFilters} />
        </CardContent>
      </Card>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
        <TabsList className="grid w-full grid-cols-4 theme-section-bg">
          <TabsTrigger value="all" className="data-[state=active]:theme-section-selected-bg">All Transactions</TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:theme-section-selected-bg">Completed</TabsTrigger>
          <TabsTrigger value="open" className="data-[state=active]:theme-section-selected-bg">Open Tabs</TabsTrigger>
          <TabsTrigger value="refunded" className="data-[state=active]:theme-section-selected-bg">Refunded</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardContent className="p-0">
              <TransactionList status={undefined} filters={filters} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed">
          <Card>
            <CardContent className="p-0">
              <TransactionList status="completed" filters={filters} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="open">
          <Card>
            <CardContent className="p-0">
              <TransactionList status="open" filters={filters} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="refunded">
          <Card>
            <CardContent className="p-0">
              <TransactionList status="refunded" filters={filters} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Transactions;
