
import React, { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils/formatters";
import { Check, CreditCard, DollarSign, Receipt } from "lucide-react";

interface POSPaymentModalProps {
  open: boolean;
  onClose: () => void;
  cartItems: any[];
  subtotal: number;
  tax: number;
  total: number;
  customer: any | null;
  onSuccess: () => void;
}

const POSPaymentModal: React.FC<POSPaymentModalProps> = ({
  open,
  onClose,
  cartItems,
  subtotal,
  tax,
  total,
  customer,
  onSuccess
}) => {
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("card");
  const [amountTendered, setAmountTendered] = useState(total.toFixed(2));
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const change = parseFloat(amountTendered) - total;
  
  const handlePayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);
      
      // Reset state after showing success screen
      setTimeout(() => {
        onSuccess();
        setIsCompleted(false);
        setPaymentMethod("card");
        setAmountTendered(total.toFixed(2));
      }, 2000);
    }, 1500);
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        {isCompleted ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Payment Successful!</h2>
            <p className="text-muted-foreground mb-6">Transaction complete</p>
            <div className="flex gap-4">
              <Button variant="outline" className="gap-2">
                <Receipt size={16} />
                <span>Print Receipt</span>
              </Button>
              <Button variant="outline" className="gap-2">
                <Receipt size={16} />
                <span>Email Receipt</span>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Complete Payment</DialogTitle>
              <DialogDescription>
                Total amount: {formatCurrency(total)}
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="card" onValueChange={(v) => setPaymentMethod(v as "cash" | "card")}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="card" className="gap-2">
                  <CreditCard size={16} />
                  <span>Card</span>
                </TabsTrigger>
                <TabsTrigger value="cash" className="gap-2">
                  <DollarSign size={16} />
                  <span>Cash</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="card">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Card Information</label>
                    <Input placeholder="Card number" disabled={isProcessing} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Expiration</label>
                      <Input placeholder="MM/YY" disabled={isProcessing} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">CVV</label>
                      <Input placeholder="123" disabled={isProcessing} />
                    </div>
                  </div>
                  
                  {customer && (
                    <div className="flex items-center gap-2 p-2 bg-primary/5 rounded-md">
                      <CreditCard size={16} className="text-primary" />
                      <span className="text-sm">
                        Use saved card for {customer.name}
                      </span>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="cash">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Amount Tendered</label>
                    <Input 
                      type="number" 
                      min={total}
                      step="0.01"
                      value={amountTendered}
                      onChange={(e) => setAmountTendered(e.target.value)}
                      disabled={isProcessing}
                    />
                  </div>
                  
                  <div className="p-4 bg-muted/20 rounded-md">
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Tendered</span>
                      <span>{formatCurrency(parseFloat(amountTendered) || 0)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between py-1 font-medium">
                      <span>Change</span>
                      <span>{formatCurrency(Math.max(0, change))}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {[5, 10, 20, 50, 100].map(amount => (
                      <Button
                        key={amount}
                        variant="outline"
                        onClick={() => setAmountTendered(amount.toFixed(2))}
                        disabled={isProcessing}
                      >
                        ${amount}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => setAmountTendered(total.toFixed(2))}
                      disabled={isProcessing}
                    >
                      Exact
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" onClick={onClose} disabled={isProcessing}>
                Cancel
              </Button>
              <Button 
                onClick={handlePayment}
                disabled={
                  isProcessing || 
                  (paymentMethod === "cash" && parseFloat(amountTendered) < total)
                }
              >
                {isProcessing ? "Processing..." : `Pay ${formatCurrency(total)}`}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default POSPaymentModal;
