
import React from "react";
import { UserRound, CalendarRange, Receipt, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatPhoneNumber, formatCurrency } from "@/utils/formatters";
import type { Customer } from "@/types/index";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface ClientInformationProps {
  customer: Customer;
}

// Custom hook to fetch client tab information - now using the client_wallets table
const useClientTabInfo = (customerId: string) => {
  return useQuery({
    queryKey: ['client-tab', customerId],
    queryFn: async () => {
      try {
        // First try to get the wallet information
        const { data: wallet, error: walletError } = await supabase
          .from('client_wallets')
          .select('*')
          .eq('customer_id', customerId)
          .single();
          
        if (walletError) {
          console.error('Wallet error:', walletError);
          // Fallback to the old method if wallet doesn't exist yet
          const { data, error } = await supabase
            .from('transactions')
            .select('total')
            .eq('customer_id', customerId)
            .eq('status', 'open')
            .eq('payment_method', 'tab');
            
          if (error) throw error;
          
          const totalTabAmount = data?.reduce((sum, tx) => sum + (tx.total || 0), 0) || 0;
          return {
            hasOpenTab: data && data.length > 0,
            tabCount: data?.length || 0,
            totalAmount: totalTabAmount
          };
        }
        
        // If we have a wallet, get the open transactions count
        const { data: transactions, error: txError } = await supabase
          .from('transactions')
          .select('id')
          .eq('customer_id', customerId)
          .eq('status', 'open')
          .eq('payment_method', 'tab');
          
        if (txError) throw txError;
        
        return {
          hasOpenTab: wallet.current_balance > 0,
          tabCount: transactions?.length || 0,
          totalAmount: wallet.current_balance
        };
      } catch (error) {
        console.error('Error fetching client tab info:', error);
        return { hasOpenTab: false, tabCount: 0, totalAmount: 0 };
      }
    },
    staleTime: 60000 // 1 minute
  });
}

const ClientInformation: React.FC<ClientInformationProps> = ({ customer }) => {
  const { data: tabInfo, isLoading } = useClientTabInfo(customer.id);
  
  return (
    <Card className="theme-container-bg border">
      <CardHeader>
        <CardTitle>Client Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tab Balance Widget - replacing the profile photo */}
        <div className="flex justify-center mb-6">
          <div className={`rounded-full w-32 h-32 flex flex-col items-center justify-center ${
            tabInfo?.hasOpenTab 
              ? tabInfo.totalAmount > 100 
                ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400" 
                : "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
              : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
          }`}>
            {isLoading ? (
              <div className="animate-pulse">
                <Receipt className="h-12 w-12 opacity-50" />
              </div>
            ) : (
              <>
                <Receipt className="h-8 w-8 mb-1" />
                <div className="text-lg font-bold">
                  {formatCurrency(tabInfo?.totalAmount || 0)}
                </div>
                <div className="text-xs text-center px-2">
                  {tabInfo?.hasOpenTab 
                    ? `${tabInfo.tabCount} open tab${tabInfo.tabCount !== 1 ? 's' : ''}`
                    : "No open tabs"}
                </div>
              </>
            )}
          </div>
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
          
          {tabInfo?.hasOpenTab && (
            <div className="mt-4 p-2 rounded border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 pt-0.5">
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="text-sm text-amber-700 dark:text-amber-400">
                  <p className="font-medium">Open Tab Alert</p>
                  <p>This customer has an open tab of {formatCurrency(tabInfo.totalAmount)}.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientInformation;
