
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { CustomerList } from "@/components/customers/CustomerList";
import CustomerDetails from "@/components/customers/CustomerDetails";
import { NewCustomerForm } from "@/components/customers/NewCustomerForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CustomerProvider } from "@/contexts/CustomerContext";

const Customers = () => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [isAddingCustomer, setIsAddingCustomer] = useState<boolean>(false);

  return (
    <CustomerProvider>
      <Layout>
        <div className="container mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Customers</h1>
            <Button 
              onClick={() => {
                setSelectedCustomerId(null);
                setIsAddingCustomer(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus size={16} /> Add Customer
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
              <CustomerList 
                selectedCustomerId={selectedCustomerId}
                onSelectCustomer={(id) => {
                  setSelectedCustomerId(id);
                  setIsAddingCustomer(false);
                }}
              />
            </div>
            
            <div className="md:col-span-2">
              {isAddingCustomer ? (
                <NewCustomerForm 
                  onCancel={() => setIsAddingCustomer(false)}
                  onSuccess={(newCustomer) => {
                    setIsAddingCustomer(false);
                    setSelectedCustomerId(newCustomer.id);
                  }}
                />
              ) : selectedCustomerId ? (
                <CustomerDetails 
                  customer={{
                    id: selectedCustomerId,
                    first_name: "Demo",
                    last_name: "Customer",
                    email: "demo@example.com",
                    phone: null,
                    notes: null,
                    photo_url: null,
                    stripe_customer_id: null,
                    gohighlevel_id: null,
                    loyalty_points: 0,
                    tier: "Bronze",
                    total_spend: 0,
                    created_at: null,
                    updated_at: null
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-64 border rounded-lg bg-muted/40">
                  <p className="text-muted-foreground">
                    Select a customer to view details or click "Add Customer" to create a new one
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </CustomerProvider>
  );
};

export default Customers;
