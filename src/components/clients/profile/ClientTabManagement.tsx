
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowDownCircle, ArrowUpCircle, Receipt, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatCurrency } from "@/utils/formatters";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Customer } from "@/types/index";

interface WalletTransaction {
  id: string;
  amount: number;
  type: 'charge' | 'payment';
  description: string;
  created_at: string;
}

interface ClientWallet {
  id: string;
  customer_id: string;
  current_balance: number;
  last_charged_at: string | null;
}

interface ClientTabManagementProps {
  customer: Customer;
  onTabPaid?: () => void;
}

const useClientWallet = (customerId: string) => {
  return useQuery({
    queryKey: ['client-wallet', customerId],
    queryFn: async () => {
      try {
        // Get the client's wallet
        const { data: wallet, error: walletError } = await supabase
          .from('client_wallets')
          .select('*')
          .eq('customer_id', customerId)
          .single();
          
        if (walletError) {
          console.error('Error fetching wallet:', walletError);
          return { wallet: null, transactions: [] };
        }
        
        if (!wallet) {
          return { wallet: null, transactions: [] };
        }
        
        // Get wallet transactions
        const { data: transactions, error: txError } = await supabase
          .from('wallet_transactions')
          .select('*')
          .eq('wallet_id', wallet.id)
          .order('created_at', { ascending: false });
          
        if (txError) {
          console.error('Error fetching wallet transactions:', txError);
          return { wallet, transactions: [] };
        }
        
        return { 
          wallet, 
          transactions: transactions || [] 
        };
      } catch (error) {
        console.error('Error in useClientWallet:', error);
        return { wallet: null, transactions: [] };
      }
    },
    staleTime: 60000 // 1 minute
  });
};

export const ClientTabManagement: React.FC<ClientTabManagementProps> = ({ 
  customer,
  onTabPaid
}) => {
  const { data, isLoading, refetch } = useClientWallet(customer.id);
  const { toast } = useToast();
  const [isCharging, setIsCharging] = useState(false);
  
  const wallet = data?.wallet;
  const transactions = data?.transactions as WalletTransaction[];
  
  // Handle charging the tab
  const handleChargeTab = async () => {
    if (!wallet || wallet.current_balance <= 0) {
      toast({
        title: "No balance to charge",
        description: "This customer doesn't have an outstanding tab balance.",
        variant: "destructive"
      });
      return;
    }
    
    setIsCharging(true);
    try {
      // In a real implementation, this would process the payment via Stripe, etc.
      // For now, we'll just mark it as paid in the database
      
      // 1. Update open transactions to completed
      const { error: txError } = await supabase
        .from('transactions')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('customer_id', customer.id)
        .eq('status', 'open')
        .eq('payment_method', 'tab');
        
      if (txError) throw txError;
      
      // 2. Create a payment record in wallet_transactions
      const { error: walletTxError } = await supabase
        .from('wallet_transactions')
        .insert([{
          wallet_id: wallet.id,
          amount: wallet.current_balance,
          type: 'payment',
          description: 'Tab payment processed manually'
        }]);
        
      if (walletTxError) throw walletTxError;
      
      // 3. Update the wallet balance to zero
      const { error: walletError } = await supabase
        .from('client_wallets')
        .update({ 
          current_balance: 0,
          last_charged_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', wallet.id);
        
      if (walletError) throw walletError;
      
      toast({
        title: "Tab charged successfully",
        description: `Charged ${formatCurrency(wallet.current_balance)} to the customer's tab.`,
        variant: "default"
      });
      
      // Refresh data
      refetch();
      if (onTabPaid) onTabPaid();
      
    } catch (error) {
      console.error('Error charging tab:', error);
      toast({
        title: "Failed to charge tab",
        description: "There was an error processing this tab payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCharging(false);
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tab Management</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="animate-pulse flex flex-col items-center">
            <Receipt className="h-12 w-12 opacity-30 mb-2" />
            <div className="h-4 w-32 bg-muted rounded my-2"></div>
            <div className="h-3 w-24 bg-muted rounded mt-1"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tab Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!wallet ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Tab Information</AlertTitle>
            <AlertDescription>
              This customer doesn't have any tab history yet.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {/* Current Balance Indicator */}
            <div className={`p-4 rounded-lg flex flex-col items-center ${
              wallet.current_balance > 0 
                ? "bg-amber-50 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-800"
                : "bg-green-50 border border-green-200 dark:bg-green-950/20 dark:border-green-800"
            }`}>
              <div className="text-3xl font-bold mb-1">
                {formatCurrency(wallet.current_balance || 0)}
              </div>
              <div className="text-sm text-muted-foreground">
                Current Tab Balance
              </div>
              {wallet.last_charged_at && (
                <div className="text-xs mt-2">
                  Last charged: {format(new Date(wallet.last_charged_at), "MMM d, yyyy 'at' h:mm a")}
                </div>
              )}
            </div>
            
            {/* Tab History */}
            <div>
              <h3 className="text-sm font-medium mb-2">Tab History</h3>
              {transactions.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  No transaction history
                </div>
              ) : (
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2 pr-4">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="border rounded p-3">
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            {tx.type === 'charge' ? (
                              <ArrowUpCircle className="h-4 w-4 text-amber-500 mr-2" />
                            ) : (
                              <ArrowDownCircle className="h-4 w-4 text-green-500 mr-2" />
                            )}
                            <div>{tx.description || (tx.type === 'charge' ? 'Charged to tab' : 'Payment')}</div>
                          </div>
                          <Badge variant={tx.type === 'charge' ? "outline" : "secondary"}>
                            {tx.type === 'charge' ? '+' : '-'}{formatCurrency(tx.amount)}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {format(new Date(tx.created_at), "MMM d, yyyy 'at' h:mm a")}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </>
        )}
      </CardContent>
      {wallet && wallet.current_balance > 0 && (
        <CardFooter>
          <Button 
            onClick={handleChargeTab} 
            className="w-full"
            disabled={isCharging}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            {isCharging ? 'Processing...' : `Charge Tab (${formatCurrency(wallet.current_balance)})`}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ClientTabManagement;
