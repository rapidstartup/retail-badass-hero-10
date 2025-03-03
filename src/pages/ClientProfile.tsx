
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, UserRound, CalendarRange, CreditCard, 
  Receipt, Edit, Trash, Clock, ShoppingBag 
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { formatCurrency, formatDateTime, formatPhoneNumber } from "@/utils/formatters";
import { supabase } from "@/integrations/supabase/client";
import type { Customer, Transaction } from "@/types/index";
import StatCard from "@/components/StatCard";

const ClientProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<string>("30days");
  const [metrics, setMetrics] = useState({
    avgTransaction: 0,
    numTransactions: 0,
    totalSpent: 0,
    mostPurchased: "None",
    currentTabBalance: 0
  });

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
      } catch (error) {
        console.error('Error fetching customer:', error);
      }
    };

    const fetchTransactions = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('customer_id', id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setTransactions(data || []);
        
        // Calculate metrics
        if (data && data.length > 0) {
          const totalSpent = data.reduce((sum, tx) => sum + (tx.total || 0), 0);
          const avgTransaction = totalSpent / data.length;
          const openTabs = data.filter(tx => tx.status === 'open');
          const tabBalance = openTabs.reduce((sum, tx) => sum + (tx.total || 0), 0);
          
          setMetrics({
            avgTransaction,
            numTransactions: data.length,
            totalSpent,
            mostPurchased: "Coffee", // Would need item-level analysis
            currentTabBalance: tabBalance
          });
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
    fetchTransactions();
  }, [id]);

  const handleGoBack = () => {
    navigate('/clients');
  };

  const handleEditCustomer = () => {
    navigate(`/clients/${id}/edit`);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="animate-pulse">Loading client profile...</div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="container mx-auto p-4">
        <Alert>
          <AlertDescription>Client not found. The client may have been deleted or the URL is incorrect.</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={handleGoBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Clients
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">
            {customer.first_name} {customer.last_name}
          </h1>
          {customer.tier && (
            <Badge variant={customer.tier === 'Gold' ? 'default' : customer.tier === 'Silver' ? 'outline' : 'secondary'}>
              {customer.tier}
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEditCustomer}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left column - Customer info */}
        <div className="md:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-6">
                {customer.photo_url ? (
                  <img 
                    src={customer.photo_url} 
                    alt={`${customer.first_name} ${customer.last_name}`} 
                    className="rounded-full w-32 h-32 object-cover border-4 border-primary/20" 
                  />
                ) : (
                  <div className="rounded-full w-32 h-32 bg-primary/10 flex items-center justify-center">
                    <UserRound className="h-16 w-16 text-primary/40" />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-6 flex-shrink-0">
                    <UserRound className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-medium">{customer.first_name} {customer.last_name}</div>
                    <div className="text-sm text-muted-foreground">Name</div>
                  </div>
                </div>
                
                {customer.email && (
                  <div className="flex items-start gap-2">
                    <div className="w-6 flex-shrink-0">
                      <svg className="h-5 w-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="16" x="2" y="4" rx="2"/>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">{customer.email}</div>
                      <div className="text-sm text-muted-foreground">Email</div>
                    </div>
                  </div>
                )}
                
                {customer.phone && (
                  <div className="flex items-start gap-2">
                    <div className="w-6 flex-shrink-0">
                      <svg className="h-5 w-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">{formatPhoneNumber(customer.phone)}</div>
                      <div className="text-sm text-muted-foreground">Phone</div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-2">
                  <div className="w-6 flex-shrink-0">
                    <CalendarRange className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {customer.created_at ? format(new Date(customer.created_at), 'MMM d, yyyy') : 'Unknown'}
                    </div>
                    <div className="text-sm text-muted-foreground">Customer since</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Loyalty Program</CardTitle>
              <CardDescription>Points and rewards status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold">{customer.loyalty_points || 0}</span>
                <span className="text-sm text-muted-foreground">Points</span>
              </div>
              <div className="h-2.5 bg-secondary/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: `${Math.min(((customer.loyalty_points || 0) / 100) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-sm text-muted-foreground text-center">
                {customer.loyalty_points || 0} / 100 points to next reward
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <span className="text-sm">Current Tier</span>
              <Badge variant={customer.tier === 'Gold' ? 'default' : customer.tier === 'Silver' ? 'outline' : 'secondary'}>
                {customer.tier || 'Bronze'}
              </Badge>
            </CardFooter>
          </Card>

          {customer.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{customer.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column - Metrics and transactions */}
        <div className="md:col-span-8 space-y-6">
          {/* Overview Section */}
          <Card>
            <CardHeader>
              <CardTitle>Client Overview</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className={timeframe === "30days" ? "bg-secondary/20" : ""} onClick={() => setTimeframe("30days")}>
                  Last 30 Days
                </Button>
                <Button variant="outline" size="sm" className={timeframe === "90days" ? "bg-secondary/20" : ""} onClick={() => setTimeframe("90days")}>
                  Last 90 Days
                </Button>
                <Button variant="outline" size="sm" className={timeframe === "alltime" ? "bg-secondary/20" : ""} onClick={() => setTimeframe("alltime")}>
                  All Time
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard 
                  title="Avg. Transaction" 
                  value={formatCurrency(metrics.avgTransaction)}
                  icon={<Receipt className="h-6 w-6" />}
                />
                <StatCard 
                  title="Transactions" 
                  value={metrics.numTransactions.toString()}
                  icon={<ShoppingBag className="h-6 w-6" />}
                />
                <StatCard 
                  title="Total Spent" 
                  value={formatCurrency(metrics.totalSpent)}
                  icon={<CreditCard className="h-6 w-6" />}
                />
              </div>
            </CardContent>
          </Card>

          {/* Transactions Section */}
          <Tabs defaultValue="history">
            <TabsList className="mb-4">
              <TabsTrigger value="history">Transaction History</TabsTrigger>
              <TabsTrigger value="payment">Payment Methods</TabsTrigger>
            </TabsList>
            
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>Recent purchases and payments</CardDescription>
                </CardHeader>
                <CardContent>
                  {transactions.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      No transactions found for this client.
                    </div>
                  ) : (
                    <Accordion type="single" collapsible className="w-full">
                      {transactions.map((transaction) => (
                        <AccordionItem key={transaction.id} value={transaction.id}>
                          <AccordionTrigger className="px-4 py-3 bg-card hover:bg-muted/50 rounded-md my-1">
                            <div className="flex justify-between w-full items-center pr-4">
                              <div className="flex items-center gap-3">
                                <div className="flex flex-col items-start">
                                  <span className="font-medium text-sm">
                                    {transaction.created_at ? formatDateTime(transaction.created_at) : 'Unknown date'}
                                  </span>
                                  <Badge variant={transaction.status === 'completed' ? 'success' : transaction.status === 'open' ? 'secondary' : 'outline'}>
                                    {transaction.status}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="font-bold">{formatCurrency(transaction.total)}</span>
                                <div className="text-xs text-muted-foreground">
                                  {transaction.payment_method || 'No payment method'}
                                </div>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-3">
                            <div className="space-y-4">
                              <div className="border rounded-md overflow-hidden">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Item</TableHead>
                                      <TableHead className="text-right">Quantity</TableHead>
                                      <TableHead className="text-right">Price</TableHead>
                                      <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {transaction.items && typeof transaction.items === 'object' ? 
                                      Object.values(transaction.items).map((item: any, index) => (
                                        <TableRow key={index}>
                                          <TableCell>{item.name}</TableCell>
                                          <TableCell className="text-right">{item.quantity}</TableCell>
                                          <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                                          <TableCell className="text-right">{formatCurrency(item.quantity * item.price)}</TableCell>
                                        </TableRow>
                                      )) : 
                                      <TableRow>
                                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                                          No items available
                                        </TableCell>
                                      </TableRow>
                                    }
                                  </TableBody>
                                </Table>
                              </div>
                              
                              <div className="flex justify-between text-sm">
                                <span>Subtotal:</span>
                                <span>{formatCurrency(transaction.subtotal)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Tax:</span>
                                <span>{formatCurrency(transaction.tax)}</span>
                              </div>
                              <div className="flex justify-between font-bold">
                                <span>Total:</span>
                                <span>{formatCurrency(transaction.total)}</span>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="payment">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Saved payment methods from Stripe</CardDescription>
                </CardHeader>
                <CardContent>
                  {customer.stripe_customer_id ? (
                    <div className="space-y-4">
                      <Card className="border border-muted">
                        <CardContent className="p-4 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-8 w-8 text-primary" />
                            <div>
                              <div className="font-medium">•••• •••• •••• 4242</div>
                              <div className="text-xs text-muted-foreground">Expires 12/25</div>
                            </div>
                          </div>
                          <Badge>Default</Badge>
                        </CardContent>
                      </Card>
                      
                      <Button className="w-full">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Add Payment Method
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="text-muted-foreground mb-4">No payment methods added yet</div>
                      <Button>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Add Payment Method
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
