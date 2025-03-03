
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, History, Star, PieChart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import type { Customer, Transaction } from "@/types/index";
import { formatCurrency } from "@/utils/formatters";
import ClientOverviewSection from "@/components/clients/ClientOverviewSection";
import ClientTransactionHistory from "@/components/clients/ClientTransactionHistory";
import ClientPaymentMethods from "@/components/clients/ClientPaymentMethods";

const ClientProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        setCustomer(data);
        
        // Fetch customer transactions
        const { data: txData, error: txError } = await supabase
          .from('transactions')
          .select('*')
          .eq('customer_id', id)
          .order('created_at', { ascending: false });
        
        if (txError) throw txError;
        setTransactions(txData || []);
      } catch (error) {
        console.error('Error fetching customer:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomer();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading client data...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-2">Client Not Found</h2>
          <p className="text-muted-foreground mb-4">The client you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/clients')}>Back to Clients</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/clients')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">
          {customer.first_name} {customer.last_name}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Client Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-4">
                {customer.photo_url ? (
                  <img
                    src={customer.photo_url}
                    alt={`${customer.first_name} ${customer.last_name}`}
                    className="rounded-full h-32 w-32 object-cover border-4 border-muted"
                  />
                ) : (
                  <div className="rounded-full h-32 w-32 bg-muted flex items-center justify-center">
                    <User className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{customer.email || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{customer.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Loyalty Tier</p>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <p className="font-medium">{customer.tier || "Bronze"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Spend</p>
                  <p className="font-medium">{formatCurrency(customer.total_spend || 0)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Loyalty Points</p>
                  <p className="font-medium">{customer.loyalty_points || 0} points</p>
                </div>
                {customer.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="text-sm">{customer.notes}</p>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(`/clients/edit/${customer.id}`)}
                >
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="transactions" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                <span>Transactions</span>
              </TabsTrigger>
              <TabsTrigger value="payment-methods" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>Payment Methods</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <ClientOverviewSection customer={customer} transactions={transactions} />
            </TabsContent>

            <TabsContent value="transactions">
              <ClientTransactionHistory transactions={transactions} />
            </TabsContent>

            <TabsContent value="payment-methods">
              <ClientPaymentMethods customerId={customer.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
