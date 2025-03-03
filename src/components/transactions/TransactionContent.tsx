
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionList from "@/components/transactions/TransactionList";
import TransactionFilters from "@/components/transactions/TransactionFilters";
import type { TransactionFilters as TransactionFiltersType } from "@/types/transaction";
import { useIsMobile } from "@/hooks/use-mobile";

interface TransactionContentProps {
  onSelectTransaction: (transactionId: string) => void;
}

const TransactionContent: React.FC<TransactionContentProps> = ({ onSelectTransaction }) => {
  const [activeTab, setActiveTab] = useState("all");
  const isMobile = useIsMobile();
  const [filters, setFilters] = useState<TransactionFiltersType>({
    dateRange: {
      from: new Date(new Date().setDate(new Date().getDate() - 30)),
      to: new Date()
    },
    searchQuery: ''
  });

  return (
    <div className="grid grid-cols-1 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Transaction List</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionFilters filters={filters} setFilters={setFilters} />
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto theme-section-bg mb-4">
              <TabsTrigger value="all" className="data-[state=active]:theme-section-selected-bg">All</TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:theme-section-selected-bg">Completed</TabsTrigger>
              <TabsTrigger value="open" className="data-[state=active]:theme-section-selected-bg">Open Tabs</TabsTrigger>
              <TabsTrigger value="refunded" className="data-[state=active]:theme-section-selected-bg">Refunded</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <TransactionList 
                status="all" 
                filters={filters} 
                onSelectTransaction={onSelectTransaction} 
              />
            </TabsContent>
            
            <TabsContent value="completed">
              <TransactionList 
                status="completed" 
                filters={filters} 
                onSelectTransaction={onSelectTransaction} 
              />
            </TabsContent>
            
            <TabsContent value="open">
              <TransactionList 
                status="open" 
                filters={filters} 
                onSelectTransaction={onSelectTransaction} 
              />
            </TabsContent>
            
            <TabsContent value="refunded">
              <TransactionList 
                status="refunded" 
                filters={filters} 
                onSelectTransaction={onSelectTransaction} 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionContent;
