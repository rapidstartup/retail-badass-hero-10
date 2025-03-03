
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useClientProfile } from "@/hooks/useClientProfile";
import type { Customer } from "@/types/index";

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
  const [timeframe, setTimeframe] = useState<string>("30days");
  const [isEditing, setIsEditing] = useState(false);
  
  const { 
    customer, 
    transactions, 
    loading, 
    metrics, 
    updateCustomer,
    pagination,
    changePage,
    changePageSize,
    isSaving
  } = useClientProfile(id);

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

  // Update form values when customer data is loaded
  React.useEffect(() => {
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
  }, [customer, form]);

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
    const success = await updateCustomer(values);
    if (success) {
      setIsEditing(false);
    }
  };

  if (loading && !customer) {
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
            pagination={pagination}
            onPageChange={changePage}
            onPageSizeChange={changePageSize}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
