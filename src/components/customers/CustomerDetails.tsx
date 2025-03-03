
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CustomerTransactionList from './CustomerTransactionList';
import CustomerGiftCards from './CustomerGiftCards';
import CustomerLoyalty from './CustomerLoyalty';
import { CustomerEditForm } from './CustomerEditForm';
import { Mail, Phone, Edit, FileText, CreditCard, Gift, ShoppingBag } from "lucide-react";

interface CustomerDetailsProps {
  customer: any;
  onUpdate: () => Promise<void>;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({ customer, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleSaveEdit = async (data: any) => {
    // Handle saving customer edits
    setIsEditing(false);
    if (onUpdate) {
      await onUpdate();
    }
  };
  
  if (isEditing) {
    return (
      <Card>
        <CardContent className="p-6">
          <CustomerEditForm 
            customer={customer}
            onSubmit={handleSaveEdit}
          />
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {customer.first_name} {customer.last_name}
          </h1>
          {customer.email && (
            <div className="flex items-center mt-1 text-muted-foreground">
              <Mail className="mr-2 h-4 w-4" />
              <span>{customer.email}</span>
            </div>
          )}
          {customer.phone && (
            <div className="flex items-center mt-1 text-muted-foreground">
              <Phone className="mr-2 h-4 w-4" />
              <span>{customer.phone}</span>
            </div>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">
            <FileText className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="transactions">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="cards">
            <CreditCard className="mr-2 h-4 w-4" />
            Cards
          </TabsTrigger>
          <TabsTrigger value="gift-cards">
            <Gift className="mr-2 h-4 w-4" />
            Gift Cards
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomerLoyalty 
              customer={customer}
              onUpdate={onUpdate}
            />
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-2">Customer Information</h3>
                
                <div className="space-y-3">
                  {customer.notes && (
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Notes</div>
                      <div className="text-sm text-muted-foreground">
                        {customer.notes}
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Customer Since</div>
                    <div className="text-sm text-muted-foreground">
                      {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'Unknown'}
                    </div>
                  </div>
                  
                  {customer.stripe_customer_id && (
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Stripe Customer ID</div>
                      <div className="text-sm font-mono text-muted-foreground">
                        {customer.stripe_customer_id}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="transactions">
          <CustomerTransactionList customerId={customer.id} />
        </TabsContent>
        
        <TabsContent value="cards">
          <Card>
            <CardContent className="p-6">
              <div className="text-center p-8 text-muted-foreground">
                <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-25" />
                <p>No payment cards linked to this customer.</p>
                <Button className="mt-4" variant="outline" size="sm">
                  Add Payment Card
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="gift-cards">
          <CustomerGiftCards customerId={customer.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerDetails;
