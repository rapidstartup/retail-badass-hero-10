
import React, { useState, useEffect } from "react";
import { CreditCard, Plus, Trash, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

interface ClientPaymentMethodsProps {
  customerId: string;
}

const ClientPaymentMethods: React.FC<ClientPaymentMethodsProps> = ({ customerId }) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock payment methods for now
  useEffect(() => {
    // In a real implementation, you would fetch from Stripe via your API
    const mockPaymentMethods: PaymentMethod[] = [
      {
        id: "pm_1",
        brand: "visa",
        last4: "4242",
        expMonth: 12,
        expYear: 25,
        isDefault: true,
      },
      {
        id: "pm_2",
        brand: "mastercard",
        last4: "8888",
        expMonth: 10,
        expYear: 26,
        isDefault: false,
      },
    ];
    
    setPaymentMethods(mockPaymentMethods);
    setLoading(false);
  }, [customerId]);

  const getCardIcon = (brand: string) => {
    // Simplified for demo purposes
    return <CreditCard className="h-6 w-6" />;
  };

  const formatExpiryDate = (month: number, year: number) => {
    return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`;
  };

  const handleAddPaymentMethod = () => {
    // In a real implementation, you would redirect to a Stripe form
    alert("This would open a Stripe payment form in production.");
  };

  const handleRemovePaymentMethod = (paymentMethodId: string) => {
    // Mock removal - in real implementation, call Stripe API
    setPaymentMethods(paymentMethods.filter(pm => pm.id !== paymentMethodId));
  };

  const handleSetDefaultPaymentMethod = (paymentMethodId: string) => {
    // Mock set default - in real implementation, call Stripe API
    setPaymentMethods(
      paymentMethods.map(pm => ({
        ...pm,
        isDefault: pm.id === paymentMethodId,
      }))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Saved Payment Methods</h2>
        <Button onClick={handleAddPaymentMethod} className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Payment Method</span>
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading payment methods...</p>
        </div>
      ) : paymentMethods.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Payment Methods</h3>
            <p className="text-muted-foreground text-center mb-4">
              This client doesn't have any saved payment methods yet.
            </p>
            <Button onClick={handleAddPaymentMethod} className="gap-2">
              <Plus className="h-4 w-4" />
              <span>Add First Payment Method</span>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((method) => (
            <Card key={method.id} className={method.isDefault ? "border-primary" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {getCardIcon(method.brand)}
                    <div>
                      <CardTitle className="text-base">
                        {method.brand.charAt(0).toUpperCase() + method.brand.slice(1)}
                      </CardTitle>
                      <CardDescription>
                        •••• {method.last4}
                      </CardDescription>
                    </div>
                  </div>
                  {method.isDefault && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      Default
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Expires: {formatExpiryDate(method.expMonth, method.expYear)}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                {!method.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleSetDefaultPaymentMethod(method.id)}
                  >
                    <Check className="h-4 w-4" />
                    <span>Set as Default</span>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 gap-2 ml-auto"
                  onClick={() => handleRemovePaymentMethod(method.id)}
                >
                  <Trash className="h-4 w-4" />
                  <span>Remove</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>About Payment Methods</CardTitle>
          <CardDescription>
            Client payment methods are securely stored through Stripe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-1">Security</h4>
              <p className="text-sm text-muted-foreground">
                Card information is securely stored by Stripe and never touches your servers. 
                Only the last 4 digits and expiration dates are visible to you.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Charging Cards</h4>
              <p className="text-sm text-muted-foreground">
                You can use these saved payment methods to charge clients for purchases in your POS system.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientPaymentMethods;
