
import React, { useState } from 'react';
import { CustomerEditForm } from './CustomerEditForm';
import { CustomerTransactionList } from './CustomerTransactionList';
import { CustomerLoyalty } from './CustomerLoyalty';
import { Customer } from '@/types/database.types';
import { CustomerGiftCards } from './CustomerGiftCards';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Edit, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    <div className="space-y-4">
      {isEditing ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Edit Customer</CardTitle>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsEditing(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <CustomerEditForm 
              customer={currentCustomer} 
              onSubmit={handleSubmit} 
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{currentCustomer.first_name} {currentCustomer.last_name}</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {currentCustomer.email && (
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground">Email</span>
                  <span>{currentCustomer.email}</span>
                </div>
              )}
              {currentCustomer.phone && (
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground">Phone</span>
                  <span>{currentCustomer.phone}</span>
                </div>
              )}
              {currentCustomer.address && (
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground">Address</span>
                  <span>{currentCustomer.address}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
          <TabsTrigger value="giftcards">Gift Cards</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="mt-4">
          <CustomerTransactionList customerId={currentCustomer.id} />
        </TabsContent>
        
        <TabsContent value="loyalty" className="mt-4">
          <CustomerLoyalty customer={currentCustomer} />
        </TabsContent>
        
        <TabsContent value="giftcards" className="mt-4">
          <CustomerGiftCards customerId={currentCustomer.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerDetails;
