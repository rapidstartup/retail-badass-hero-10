
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatCurrency } from "@/utils/formatters";

// Import the new component modules
import { CashPayment } from "./payment-methods/CashPayment";
import { CardPayment } from "./payment-methods/CardPayment";
import { CheckPayment } from "./payment-methods/CheckPayment";
import { TabPayment } from "./payment-methods/TabPayment";
import { TransactionSummary } from "./TransactionSummary";

export interface POSPaymentModalProps {
  open: boolean;
  onClose: () => void;
  cartItems: any[];
  subtotal: number;
  tax: number;
  total: number;
  customer: any;
  taxRate: number;
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

    if ([10, 20, 50, 100].includes(Number(value))) {
      setAmountTendered(value);
      return;
    }

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
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
              
              <TabsContent value="cash" className="mt-4">
                <CashPayment 
                  amountTendered={amountTendered}
                  setAmountTendered={setAmountTendered}
                  total={total}
                  handleNumpadInput={handleNumpadInput}
                />
              </TabsContent>
              
              <TabsContent value="card" className="mt-4">
                <CardPayment 
                  cardNumber={cardNumber}
                  setCardNumber={setCardNumber}
                  cardExpiryMonth={cardExpiryMonth}
                  setCardExpiryMonth={setCardExpiryMonth}
                  cardExpiryYear={cardExpiryYear}
                  setCardExpiryYear={setCardExpiryYear}
                  cardCVC={cardCVC}
                  setCardCVC={setCardCVC}
                />
              </TabsContent>
              
              <TabsContent value="check" className="mt-4">
                <CheckPayment 
                  checkNumber={checkNumber}
                  setCheckNumber={setCheckNumber}
                  total={total}
                  storeName={storeName}
                />
              </TabsContent>
              
              <TabsContent value="tab" className="mt-4">
                <TabPayment customer={customer} />
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <TransactionSummary 
              cartItems={cartItems}
              subtotal={subtotal}
              tax={tax}
              total={total}
              taxRate={taxRate}
              customer={customer}
            />
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
