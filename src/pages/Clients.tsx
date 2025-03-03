
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Users, CreditCard, ShoppingBag, Hourglass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPhoneNumber } from "@/utils/formatters";
import { supabase } from "@/integrations/supabase/client";
import type { Customer } from "@/types/index";
import StatCard from "@/components/StatCard";

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

  // Get customer loyalty tier badge
  const getLoyaltyBadge = (tier: string | null) => {
    if (!tier) return null;
    
    const variants: Record<string, string> = {
      'Bronze': 'secondary',
      'Silver': 'outline',
      'Gold': 'default'
    };
    
    return (
      <Badge variant={variants[tier] as any || 'secondary'}>
        {tier}
      </Badge>
    );
  };

  useEffect(() => {
    searchCustomers();
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Clients</h1>
        <Button onClick={handleCreateNewCustomer} className="gap-2">
          <Plus size={16} />
          <span>New Client</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Total Clients" 
          value={totalClients.toString()} 
          icon={<Users className="h-6 w-6" />} 
        />
        <StatCard 
          title="Top Spender" 
          value={formatCurrency(topSpender)} 
          description="Highest client spending"
          icon={<CreditCard className="h-6 w-6" />} 
        />
        <StatCard 
          title="Average Spend" 
          value={formatCurrency(averageSpend)} 
          icon={<ShoppingBag className="h-6 w-6" />} 
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Directory</CardTitle>
          <CardDescription>Search and manage your clients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                onKeyDown={(e) => e.key === 'Enter' && searchCustomers()}
              />
            </div>
            <Button onClick={searchCustomers} disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>

          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto" style={{ 
              scrollbarWidth: 'thin',
              scrollbarColor: 'var(--accent) transparent'  
            }}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Loyalty</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead className="text-right">Total Spend</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {loading ? (
                          <div className="flex items-center justify-center">
                            <Hourglass className="h-4 w-4 mr-2 animate-spin" />
                            <span>Searching clients...</span>
                          </div>
                        ) : "No clients found"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    customers.map((customer) => (
                      <TableRow key={customer.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleViewCustomer(customer.id)}>
                        <TableCell className="font-medium">
                          {customer.first_name} {customer.last_name}
                        </TableCell>
                        <TableCell>{customer.email || "—"}</TableCell>
                        <TableCell>{customer.phone ? formatPhoneNumber(customer.phone) : "—"}</TableCell>
                        <TableCell>{customer.loyalty_points || 0} points</TableCell>
                        <TableCell>{getLoyaltyBadge(customer.tier)}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(customer.total_spend || 0)}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewCustomer(customer.id);
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Clients;
