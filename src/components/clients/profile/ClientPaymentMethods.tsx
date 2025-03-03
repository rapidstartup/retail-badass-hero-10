
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";
import type { Customer } from "@/types/index";

interface ClientPaymentMethodsProps {
  customer: Customer;
}

const ClientPaymentMethods: React.FC<ClientPaymentMethodsProps> = ({ customer }) => {
  return (
    <Card className="theme-container-bg border">
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>Saved payment methods from Stripe</CardDescription>
      </CardHeader>
      <CardContent>
        {customer.stripe_customer_id ? (
          <div className="space-y-4">
            <Card className="border theme-section-bg">
              <CardContent className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-8 w-8 text-theme-accent" />
                  <div>
                    <div className="font-medium">•••• •••• •••• 4242</div>
                    <div className="text-xs text-muted-foreground">Expires 12/25</div>
                  </div>
                </div>
                <Badge>Default</Badge>
              </CardContent>
            </Card>
            
            <Button className="w-full bg-theme-accent hover:bg-theme-accent-hover text-white">
              <CreditCard className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="text-muted-foreground mb-4">No payment methods added yet</div>
            <Button className="bg-theme-accent hover:bg-theme-accent-hover text-white">
              <CreditCard className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientPaymentMethods;
