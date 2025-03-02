
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { X, Minus, Plus, User, CreditCard, DollarSign, CheckCircle } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import POSPaymentModal from "./POSPaymentModal";

interface POSCartProps {
  items: any[];
  updateItemQuantity: (itemId: string, newQuantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  subtotal: number;
  tax: number;
  total: number;
  selectedCustomer: any | null;
  taxRate: number;
  storeName?: string;
}

const POSCart: React.FC<POSCartProps> = ({
  items,
  updateItemQuantity,
  removeItem,
  clearCart,
  subtotal,
  tax,
  total,
  selectedCustomer,
  taxRate,
  storeName = "NextPOS"
}) => {
  const [paymentModalOpen, setPaymentModalOpen] = React.useState(false);
  
  return (
    <>
      <Card className="flex-1 flex flex-col">
        <CardHeader className="py-4 px-6 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">{storeName}</CardTitle>
          {selectedCustomer ? (
            <div className="flex items-center gap-2 text-sm">
              <User size={16} className="text-primary" />
              <span>{selectedCustomer.name}</span>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Walk-in Customer</div>
          )}
        </CardHeader>
        
        <div className="flex-1 overflow-auto px-6 py-2">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <div className="text-4xl mb-2">🛒</div>
              <p>Your cart is empty</p>
              <p className="text-sm">Add items to get started</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item.id} className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(item.price)} × {item.quantity}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus size={14} />
                    </Button>
                    
                    <span className="w-8 text-center">{item.quantity}</span>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus size={14} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="px-6 py-4 bg-muted/10">
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Tax ({taxRate}%)</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between py-1 font-medium">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
        
        <CardFooter className="flex flex-col gap-2 p-4">
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full"
              onClick={() => setPaymentModalOpen(true)}
              disabled={items.length === 0}
            >
              <CreditCard className="mr-2" size={16} />
              Card
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full"
              onClick={() => setPaymentModalOpen(true)}
              disabled={items.length === 0}
            >
              <DollarSign className="mr-2" size={16} />
              Cash
            </Button>
          </div>
          
          <Button 
            className="w-full" 
            size="lg"
            onClick={() => setPaymentModalOpen(true)}
            disabled={items.length === 0}
          >
            <CheckCircle className="mr-2" size={16} />
            Complete Sale
          </Button>
          
          {items.length > 0 && (
            <Button
              variant="ghost"
              className="text-muted-foreground text-sm mt-2"
              onClick={clearCart}
            >
              Clear Cart
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <POSPaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        cartItems={items}
        subtotal={subtotal}
        tax={tax}
        total={total}
        customer={selectedCustomer}
        taxRate={taxRate}
        storeName={storeName}
        onSuccess={() => {
          clearCart();
          setPaymentModalOpen(false);
        }}
      />
    </>
  );
};

export default POSCart;
