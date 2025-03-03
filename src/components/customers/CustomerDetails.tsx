
import React, { useState } from 'react';
import { CustomerEditForm } from './CustomerEditForm';
import { CustomerTransactionList } from './CustomerTransactionList';
import { CustomerCards } from './CustomerCards';
import { CustomerLoyalty } from './CustomerLoyalty';
import { CustomerGiftCards } from './CustomerGiftCards';
import { Customer } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface CustomerDetailsProps {
  customer: Customer;
  onUpdate?: (customer: Customer) => Promise<void>;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({ customer, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer>(customer);
  
  const handleSubmit = async (data: Partial<Customer>) => {
    try {
      const updatedCustomer = { ...currentCustomer, ...data };
      if (onUpdate) {
        await onUpdate(updatedCustomer as Customer);
      }
      setCurrentCustomer(updatedCustomer as Customer);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };
  
  return (
    <div className="space-y-6">
      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomerEditForm 
              customer={currentCustomer} 
              onSubmit={handleSubmit} 
              onCancel={() => setIsEditing(false)}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Customer Information</CardTitle>
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                  <p>{currentCustomer.first_name} {currentCustomer.last_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <p>{currentCustomer.email || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                  <p>{currentCustomer.phone || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Tier</h3>
                  <p>{currentCustomer.tier || 'Bronze'}</p>
                </div>
              </div>
              
              {currentCustomer.notes && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                  <p>{currentCustomer.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="transactions">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
          <TabsTrigger value="giftcards">Gift Cards</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions">
          <CustomerTransactionList customerId={currentCustomer.id} />
        </TabsContent>
        
        <TabsContent value="loyalty">
          <CustomerLoyalty customer={currentCustomer} />
        </TabsContent>
        
        <TabsContent value="giftcards">
          <CustomerGiftCards customerId={currentCustomer.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerDetails;
