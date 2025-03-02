import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { POSNumpad } from "./POSNumpad";
import { formatCurrency } from "@/utils/formatters";
import { toast } from "sonner";

export interface POSPaymentModalProps {
  open: boolean;
  onClose: () => void;
  cartItems: any[];
  subtotal: number;
  tax: number;
  total: number;
  customer: any;
  taxRate: number; // Add taxRate prop
  storeName: string;
  onSuccess: () => void;
}

export function POSPaymentModal({
  open,
  onClose,
  cartItems,
  subtotal,
  tax,
  total,
  customer,
  taxRate,
  storeName,
  onSuccess,
}: POSPaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [amountTendered, setAmountTendered] = useState<string>(total.toFixed(2));
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardExpiryMonth, setCardExpiryMonth] = useState<string>("");
  const [cardExpiryYear, setCardExpiryYear] = useState<string>("");
  const [cardCVC, setCardCVC] = useState<string>("");
  const [checkNumber, setCheckNumber] = useState<string>("");
  const [processing, setProcessing] = useState<boolean>(false);

  const calculateChange = (): number => {
    const tendered = parseFloat(amountTendered) || 0;
    return Math.max(0, tendered - total);
  };

  const handleNumpadInput = (value: string) => {
    if (value === "clear") {
      setAmountTendered("0");
      return;
    }

    if (value === "backspace") {
      setAmountTendered((prev) => 
        prev.length > 1 ? prev.slice(0, -1) : "0"
      );
      return;
    }

    // If value is a preset amount, replace the current amount
    if ([10, 20, 50, 100].includes(Number(value))) {
      setAmountTendered(value);
      return;
    }

    // Otherwise add digit
    setAmountTendered((prev) => {
      if (prev === "0" && value !== ".") {
        return value;
      }
      if (value === "." && prev.includes(".")) {
        return prev;
      }
      return prev + value;
    });
  };

  const processPayment = async () => {
    setProcessing(true);
    
    try {
      // Validation based on payment method
      if (paymentMethod === "cash") {
        const tendered = parseFloat(amountTendered) || 0;
        if (tendered < total) {
          toast.error("Amount tendered must be equal to or greater than the total");
          setProcessing(false);
          return;
        }
      } else if (paymentMethod === "card") {
        if (!cardNumber || !cardExpiryMonth || !cardExpiryYear || !cardCVC) {
          toast.error("Please enter all card details");
          setProcessing(false);
          return;
        }
        // Simple card validation
        if (cardNumber.length < 13 || cardNumber.length > 19) {
          toast.error("Invalid card number");
          setProcessing(false);
          return;
        }
      } else if (paymentMethod === "check") {
        if (!checkNumber) {
          toast.error("Please enter a check number");
          setProcessing(false);
          return;
        }
      }
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Record transaction in database would go here
      
      let successMessage = "";
      switch (paymentMethod) {
        case "cash":
          const change = calculateChange();
          successMessage = `Payment complete. Change: ${formatCurrency(change)}`;
          break;
        case "card":
          successMessage = "Card payment processed successfully";
          break;
        case "check":
          successMessage = `Check #${checkNumber} accepted`;
          break;
        case "tab":
          successMessage = "Transaction added to customer tab";
          break;
      }
      
      toast.success(successMessage);
      onSuccess();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment processing failed");
    } finally {
      setProcessing(false);
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] lg:max-w-[900px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Payment</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Tabs defaultValue="cash" className="w-full" onValueChange={setPaymentMethod}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="cash">Cash</TabsTrigger>
                <TabsTrigger value="card">Card</TabsTrigger>
                <TabsTrigger value="check">Check</TabsTrigger>
                <TabsTrigger 
                  value="tab" 
                  disabled={!customer}
                >
                  Tab
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="cash" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount-tendered">Amount Tendered</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="amount-tendered"
                      value={amountTendered}
                      onChange={(e) => setAmountTendered(e.target.value)}
                      className="text-xl font-bold"
                    />
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Change:</span>
                      <span className="text-xl font-bold">
                        {formatCurrency(calculateChange())}
                      </span>
                    </div>
                  </div>
                </div>
                
                <POSNumpad onKeyPress={handleNumpadInput} />
              </TabsContent>
              
              <TabsContent value="card" className="mt-4 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input
                      id="card-number"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                      maxLength={19}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-month">Month</Label>
                      <Input
                        id="card-month"
                        placeholder="MM"
                        value={cardExpiryMonth}
                        onChange={(e) => setCardExpiryMonth(e.target.value.replace(/\D/g, ''))}
                        maxLength={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card-year">Year</Label>
                      <Input
                        id="card-year"
                        placeholder="YY"
                        value={cardExpiryYear}
                        onChange={(e) => setCardExpiryYear(e.target.value.replace(/\D/g, ''))}
                        maxLength={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card-cvc">CVC</Label>
                      <Input
                        id="card-cvc"
                        placeholder="123"
                        value={cardCVC}
                        onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, ''))}
                        maxLength={4}
                      />
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    This is a demo. No actual payment will be processed.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="check" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="check-number">Check Number</Label>
                  <Input
                    id="check-number"
                    placeholder="Check #"
                    value={checkNumber}
                    onChange={(e) => setCheckNumber(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                  <p className="text-sm mb-2">
                    Please verify the check amount matches the total: {formatCurrency(total)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Make checks payable to: {storeName}
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="tab" className="mt-4 space-y-4">
                {customer ? (
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                    <p className="font-semibold mb-2">
                      Add to tab for: {customer.first_name} {customer.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      This will add the current transaction to the customer's tab for future payment.
                    </p>
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded border border-amber-200 dark:border-amber-800">
                      <p className="text-sm">
                        The customer will need to settle their tab in the future.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                    <p className="text-center text-sm text-muted-foreground">
                      Please select a customer to use the tab feature.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="font-semibold">Transaction Summary</span>
                    <span className="text-sm text-muted-foreground">
                      {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                  
                  <div className="max-h-[300px] overflow-y-auto space-y-2">
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span>{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-2 space-y-2 border-t">
                    <div className="flex justify-between items-center text-sm">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Tax ({taxRate}%)</span>
                      <span>{formatCurrency(tax)}</span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                  
                  {customer && (
                    <div className="pt-2 border-t">
                      <div className="text-sm">
                        <span className="font-semibold">Customer: </span>
                        <span>{customer.first_name} {customer.last_name}</span>
                      </div>
                      {customer.email && (
                        <div className="text-sm">
                          <span className="font-semibold">Email: </span>
                          <span>{customer.email}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={processing}
          >
            Cancel
          </Button>
          <Button 
            onClick={processPayment}
            disabled={processing}
          >
            {processing ? "Processing..." : `Complete ${paymentMethod === 'tab' ? 'Tab' : 'Payment'}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
