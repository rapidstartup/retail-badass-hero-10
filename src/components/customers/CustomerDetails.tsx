
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, Edit, Trash2, RefreshCw, CreditCard, GiftIcon, 
  Clock, ReceiptText, TicketPercent, UserCircle
} from "lucide-react";
import { toast } from "sonner";
import { Customer, fetchCustomerById, deleteCustomer } from "@/api/customerApi";
import { useCustomer } from "@/contexts/CustomerContext";
import { CustomerTransactionList } from "./CustomerTransactionList";
import { CustomerEditForm } from "./CustomerEditForm";
import { CustomerCards } from "./CustomerCards";
import { CustomerGiftCards } from "./CustomerGiftCards";
import { CustomerLoyalty } from "./CustomerLoyalty";
import { formatCurrency, formatPhoneNumber } from "@/utils/formatters";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CustomerDetailsProps {
  customerId: string;
}

export const CustomerDetails: React.FC<CustomerDetailsProps> = ({ customerId }) => {
  const { refreshCustomers } = useCustomer();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadCustomer();
  }, [customerId]);

  const loadCustomer = async () => {
    setIsLoading(true);
    const data = await fetchCustomerById(customerId);
    setCustomer(data);
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!customer) return;
    
    setIsDeleting(true);
    try {
      const success = await deleteCustomer(customer.id);
      if (success) {
        toast.success("Customer deleted successfully");
        refreshCustomers();
      } else {
        toast.error("Failed to delete customer");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("An error occurred while deleting the customer");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!customer) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Customer not found</p>
        </CardContent>
      </Card>
    );
  }

  if (isEditing) {
    return (
      <CustomerEditForm 
        customer={customer} 
        onCancel={() => setIsEditing(false)}
        onSuccess={(updatedCustomer) => {
          setCustomer(updatedCustomer);
          setIsEditing(false);
          refreshCustomers();
        }}
      />
    );
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Gold':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200';
      case 'Silver':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/60 dark:text-gray-200';
      default:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-2">
              {customer.photo_url ? (
                <img
                  src={customer.photo_url}
                  alt={`${customer.first_name} ${customer.last_name}`}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <UserCircle className="w-16 h-16 text-primary" />
              )}
            </div>
            <div>
              <CardTitle className="text-2xl">
                {customer.first_name} {customer.last_name}
              </CardTitle>
              {customer.tier && (
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTierColor(customer.tier)}`}>
                    {customer.tier} Tier
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="icon"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete {customer.first_name} {customer.last_name}'s customer profile
                    and all associated data. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            {customer.email && (
              <div className="flex items-start gap-2 text-sm mb-2">
                <span className="text-muted-foreground w-20">Email:</span>
                <span>{customer.email}</span>
              </div>
            )}
            
            {customer.phone && (
              <div className="flex items-start gap-2 text-sm mb-2">
                <span className="text-muted-foreground w-20">Phone:</span>
                <span>{formatPhoneNumber(customer.phone)}</span>
              </div>
            )}
          </div>
          
          <div>
            {customer.total_spend !== null && (
              <div className="flex items-start gap-2 text-sm mb-2">
                <span className="text-muted-foreground w-20">Total Spend:</span>
                <span className="font-medium">{formatCurrency(customer.total_spend)}</span>
              </div>
            )}
            
            {customer.loyalty_points !== null && (
              <div className="flex items-start gap-2 text-sm mb-2">
                <span className="text-muted-foreground w-20">Loyalty Points:</span>
                <span className="font-medium">{customer.loyalty_points}</span>
              </div>
            )}
          </div>
        </div>
        
        {customer.notes && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Notes</h3>
            <div className="bg-muted/40 p-3 rounded-md text-sm">
              {customer.notes}
            </div>
          </div>
        )}
        
        <Tabs defaultValue="transactions" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="transactions" className="flex items-center gap-1">
              <ReceiptText className="h-4 w-4" /> Transactions
            </TabsTrigger>
            <TabsTrigger value="cards" className="flex items-center gap-1">
              <CreditCard className="h-4 w-4" /> Payment Cards
            </TabsTrigger>
            <TabsTrigger value="gift-cards" className="flex items-center gap-1">
              <GiftIcon className="h-4 w-4" /> Gift Cards
            </TabsTrigger>
            <TabsTrigger value="loyalty" className="flex items-center gap-1">
              <TicketPercent className="h-4 w-4" /> Loyalty
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions" className="pt-4">
            <CustomerTransactionList customerId={customer.id} />
          </TabsContent>
          
          <TabsContent value="cards" className="pt-4">
            <CustomerCards customer={customer} />
          </TabsContent>
          
          <TabsContent value="gift-cards" className="pt-4">
            <CustomerGiftCards customerId={customer.id} />
          </TabsContent>
          
          <TabsContent value="loyalty" className="pt-4">
            <CustomerLoyalty customer={customer} onUpdate={loadCustomer} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
