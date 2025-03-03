
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { calculateTierFromSpend, calculateSpendToNextTier } from "@/utils/tierCalculator";
import type { Customer, Transaction } from "@/types/index";

// Import refactored components
import ClientProfileHeader from "@/components/clients/profile/ClientProfileHeader";
import ClientInformation from "@/components/clients/profile/ClientInformation";
import ClientLoyaltyCard from "@/components/clients/profile/ClientLoyaltyCard";
import ClientNotesCard from "@/components/clients/profile/ClientNotesCard";
import ClientEditForm from "@/components/clients/profile/ClientEditForm";
import ClientOverview from "@/components/clients/profile/ClientOverview";
import ClientTabsContent from "@/components/clients/profile/ClientTabsContent";

const customerFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").optional().nullable(),
  phone: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  tier: z.string().optional().nullable(),
  loyalty_points: z.number().nonnegative().optional().nullable(),
});

type CustomerFormValues = z.infer<typeof customerFormSchema>;

const ClientProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<string>("30days");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [metrics, setMetrics] = useState({
    avgTransaction: 0,
    numTransactions: 0,
    totalSpent: 0,
    mostPurchased: "None",
    currentTabBalance: 0,
    spendToNextTier: 0
  });

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      notes: "",
      tier: "Bronze",
      loyalty_points: 0,
    },
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
        
        form.reset({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
          notes: data.notes,
          tier: data.tier || "Bronze",
          loyalty_points: data.loyalty_points || 0,
        });
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
        
        if (data && data.length > 0) {
          const totalSpent = data.reduce((sum, tx) => sum + (tx.total || 0), 0);
          const avgTransaction = totalSpent / data.length;
          const openTabs = data.filter(tx => tx.status === 'open');
          const tabBalance = openTabs.reduce((sum, tx) => sum + (tx.total || 0), 0);
          const spendToNextTier = calculateSpendToNextTier(totalSpent);
          
          setMetrics({
            avgTransaction,
            numTransactions: data.length,
            totalSpent,
            mostPurchased: "Coffee",
            currentTabBalance: tabBalance,
            spendToNextTier
          });
          
          const updateCustomerTier = async (totalSpent: number) => {
            if (!customer || !id) return;
            
            const calculatedTier = calculateTierFromSpend(totalSpent);
            
            const tierRanking = { "Bronze": 1, "Silver": 2, "Gold": 3 };
            const currentTierRank = tierRanking[customer.tier as keyof typeof tierRanking] || 1;
            const calculatedTierRank = tierRanking[calculatedTier as keyof typeof tierRanking];
            
            if (calculatedTierRank > currentTierRank) {
              try {
                const { error } = await supabase
                  .from('customers')
                  .update({
                    tier: calculatedTier,
                    total_spend: totalSpent,
                    updated_at: new Date().toISOString(),
                  })
                  .eq('id', id);
                
                if (error) throw error;
                
                setCustomer(prev => {
                  if (!prev) return null;
                  return { ...prev, tier: calculatedTier, total_spend: totalSpent };
                });
                
                toast.success(`Customer tier upgraded to ${calculatedTier}!`);
              } catch (error) {
                console.error('Error updating customer tier:', error);
              }
            }
          };
          
          updateCustomerTier(totalSpent);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
    fetchTransactions();
  }, [id, form]);

  const handleGoBack = () => {
    navigate('/clients');
  };

  const handleEditCustomer = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (customer) {
      form.reset({
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
        phone: customer.phone,
        notes: customer.notes,
        tier: customer.tier || "Bronze",
        loyalty_points: customer.loyalty_points || 0,
      });
    }
    setIsEditing(false);
  };

  const onSubmit = async (values: CustomerFormValues) => {
    if (!id) return;
    
    setIsSaving(true);
    try {
      const totalSpend = customer?.total_spend || 0;
      
      const calculatedTier = calculateTierFromSpend(totalSpend);
      
      const tierRanking = { "Bronze": 1, "Silver": 2, "Gold": 3 };
      const formTierRank = tierRanking[values.tier as keyof typeof tierRanking] || 1;
      const calculatedTierRank = tierRanking[calculatedTier as keyof typeof tierRanking];
      const finalTier = formTierRank >= calculatedTierRank ? values.tier : calculatedTier;
      
      const { error } = await supabase
        .from('customers')
        .update({
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          phone: values.phone,
          notes: values.notes,
          tier: finalTier,
          loyalty_points: values.loyalty_points,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      
      if (error) throw error;
      
      setCustomer(prev => {
        if (!prev) return null;
        return { 
          ...prev, 
          ...values, 
          tier: finalTier,
          updated_at: new Date().toISOString() 
        };
      });
      
      setIsEditing(false);
      toast.success("Client updated successfully");
    } catch (error) {
      console.error('Error updating customer:', error);
      toast.error("Failed to update client");
    } finally {
      setIsSaving(false);
    }
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
        <Button 
          className="mt-4 border-theme-accent text-theme-accent hover:bg-theme-accent hover:text-white" 
          variant="outline" 
          onClick={handleGoBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Clients
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <ClientProfileHeader 
        customer={customer}
        isEditing={isEditing}
        isSaving={isSaving}
        handleGoBack={handleGoBack}
        handleEditCustomer={handleEditCustomer}
        handleCancelEdit={handleCancelEdit}
        handleSubmit={form.handleSubmit(onSubmit)}
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4 space-y-6">
          {isEditing ? (
            <ClientEditForm form={form} />
          ) : (
            <>
              <ClientInformation customer={customer} />
              <ClientLoyaltyCard customer={customer} spendToNextTier={metrics.spendToNextTier} />
              <ClientNotesCard notes={customer.notes} />
            </>
          )}
        </div>

        <div className="md:col-span-8 space-y-6">
          <ClientOverview 
            metrics={metrics}
            timeframe={timeframe}
            setTimeframe={setTimeframe}
          />

          <ClientTabsContent 
            transactions={transactions}
            customer={customer}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
