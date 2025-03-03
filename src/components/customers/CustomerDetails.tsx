
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, Edit, Trash2, CreditCard, Clock, FileText } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { toast } from "sonner";
import CustomerCards from "./CustomerCards";
import CustomerTransactionList from "./CustomerTransactionList";
import CustomerLoyalty from "./CustomerLoyalty";
import CustomerEditForm from "./CustomerEditForm";
import { Badge } from "@/components/ui/badge";

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  total_spend: number | null;
  loyalty_points: number | null;
  tier: string | null;
  created_at: string | null;
  notes: string | null;
}

interface CustomerDetailsProps {
  customer: Customer;
  onEdit?: (customer: Customer) => void;
  onDelete?: (customerId: string) => void;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({
  customer,
  onEdit,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const getTierColor = (tier: string | null) => {
    switch (tier?.toLowerCase()) {
      case "silver":
        return "bg-gray-200 text-gray-800";
      case "gold":
        return "bg-yellow-100 text-yellow-800";
      case "platinum":
        return "bg-blue-100 text-blue-800";
      case "diamond":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-orange-100 text-orange-800";
    }
  };
  
  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  const handleEditCancel = () => {
    setIsEditing(false);
  };
  
  const handleEditSuccess = (updatedCustomer: Customer) => {
    setIsEditing(false);
    if (onEdit) {
      onEdit(updatedCustomer);
    }
  };
  
  const handleDeleteClick = () => {
    if (window.confirm(`Are you sure you want to delete customer: ${customer.first_name} ${customer.last_name}?`)) {
      if (onDelete) {
        onDelete(customer.id);
      }
    }
  };
  
  const refreshCustomerData = async () => {
    // This function would normally fetch the latest customer data
    toast.success("Customer data refreshed");
  };
  
  if (isEditing) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Edit Customer</CardTitle>
          <CardDescription>Update customer information</CardDescription>
        </CardHeader>
        <CardContent>
          <CustomerEditForm 
            customer={customer} 
            onCancel={handleEditCancel} 
            onSuccess={handleEditSuccess} 
          />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">
                {customer.first_name} {customer.last_name}
              </CardTitle>
              <CardDescription>
                Customer since {formatDate(customer.created_at)}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleEditClick}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={handleDeleteClick}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium">Customer ID</div>
                  <div className="text-sm text-muted-foreground">{customer.id}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-sm text-muted-foreground">{customer.email || "—"}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium">Phone</div>
                  <div className="text-sm text-muted-foreground">{customer.phone || "—"}</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium">Total Spend</div>
                  <div className="text-sm text-muted-foreground">{formatCurrency(customer.total_spend || 0)}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium">Loyalty Points</div>
                  <div className="text-sm text-muted-foreground">{customer.loyalty_points || 0} points</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium">Tier</div>
                  <div className="mt-1">
                    <Badge className={getTierColor(customer.tier)}>
                      {customer.tier || "Bronze"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="font-medium mb-1">Notes</div>
              <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md h-[90px] overflow-auto">
                {customer.notes || "No notes available for this customer."}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full border-b rounded-none justify-start">
          <TabsTrigger value="overview" className="rounded-none">Overview</TabsTrigger>
          <TabsTrigger value="transactions" className="rounded-none">Transactions</TabsTrigger>
          <TabsTrigger value="loyalty" className="rounded-none">Loyalty</TabsTrigger>
          <TabsTrigger value="payment-methods" className="rounded-none">Payment Methods</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomerTransactionList customerId={customer.id} />
            <CustomerLoyalty customer={customer} onUpdate={refreshCustomerData} />
          </div>
        </TabsContent>
        
        <TabsContent value="transactions" className="pt-4">
          <CustomerTransactionList customerId={customer.id} />
        </TabsContent>
        
        <TabsContent value="loyalty" className="pt-4">
          <CustomerLoyalty customer={customer} onUpdate={refreshCustomerData} />
        </TabsContent>
        
        <TabsContent value="payment-methods" className="pt-4">
          <CustomerCards cards={[]} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerDetails;
