
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import type { Customer } from "@/types/index";

// Import refactored components
import ClientSearchBar from "@/components/clients/ClientSearchBar";
import ClientStats from "@/components/clients/ClientStats";
import ClientTable from "@/components/clients/ClientTable";

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalClients, setTotalClients] = useState(0);
  const [topSpender, setTopSpender] = useState(0);
  const [averageSpend, setAverageSpend] = useState(0);
  const navigate = useNavigate();

  const searchCustomers = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('customers')
        .select('*');
      
      if (searchTerm) {
        query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query.order('first_name', { ascending: true });
      
      if (error) throw error;
      setCustomers(data || []);
      
      // Calculate stats
      if (data && data.length > 0) {
        setTotalClients(data.length);
        
        const topAmount = Math.max(...data.map(c => c.total_spend || 0));
        setTopSpender(topAmount);
        
        const totalSpend = data.reduce((sum, c) => sum + (c.total_spend || 0), 0);
        setAverageSpend(data.length ? totalSpend / data.length : 0);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCustomer = (customerId: string) => {
    navigate(`/clients/${customerId}`);
  };

  const handleCreateNewCustomer = () => {
    navigate('/clients/new');
  };

  useEffect(() => {
    searchCustomers();
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-6 theme-bg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Button 
          onClick={() => navigate('/pos')} 
          variant="outline" 
          className="gap-2 border-theme-accent text-theme-accent hover:bg-theme-accent hover:text-white"
        >
          <ArrowLeft size={16} />
          <span>Back to POS</span>
        </Button>
        
        <div className="flex w-full sm:w-auto justify-between sm:justify-end">
          <h1 className="text-3xl font-bold">Clients</h1>
          <div className="sm:hidden">
            <Button 
              onClick={handleCreateNewCustomer} 
              className="gap-2 bg-theme-accent hover:bg-theme-accent-hover text-white"
            >
              <Plus size={16} />
              <span>New</span>
            </Button>
          </div>
        </div>
        
        <div className="hidden sm:block">
          <Button 
            onClick={handleCreateNewCustomer} 
            className="gap-2 bg-theme-accent hover:bg-theme-accent-hover text-white"
          >
            <Plus size={16} />
            <span>New Client</span>
          </Button>
        </div>
      </div>

      <ClientStats 
        totalClients={totalClients}
        topSpender={topSpender}
        averageSpend={averageSpend}
      />

      <Card className="theme-container-bg border">
        <CardHeader>
          <CardTitle>Client Directory</CardTitle>
          <CardDescription>Search and manage your clients</CardDescription>
        </CardHeader>
        <CardContent>
          <ClientSearchBar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearch={searchCustomers}
            loading={loading}
          />

          <ClientTable 
            customers={customers}
            loading={loading}
            onViewCustomer={handleViewCustomer}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Clients;
