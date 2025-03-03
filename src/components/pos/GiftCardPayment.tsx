
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { fetchGiftCardByCode, redeemGiftCard } from "@/api/giftCardApi";
import { formatCurrency } from "@/utils/formatters";
import { RefreshCw, Gift, Search, AlertCircle, Check } from "lucide-react";
import { toast } from "sonner";

interface GiftCardPaymentProps {
  total: number;
  onPaymentComplete: (paymentMethod: string, cardCode: string) => void;
}

export function GiftCardPayment({ total, onPaymentComplete }: GiftCardPaymentProps) {
  const [cardCode, setCardCode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [giftCard, setGiftCard] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSearchCard = async () => {
    if (!cardCode.trim()) {
      setError("Please enter a gift card code");
      return;
    }
    
    setError(null);
    setIsSearching(true);
    try {
      const foundCard = await fetchGiftCardByCode(cardCode);
      
      if (!foundCard) {
        setError("Gift card not found");
        setGiftCard(null);
        return;
      }
      
      if (!foundCard.is_active) {
        setError("This gift card is no longer active");
        setGiftCard(null);
        return;
      }
      
      if (foundCard.current_value < total) {
        setError(`Insufficient balance on gift card. Available: ${formatCurrency(foundCard.current_value)}`);
        setGiftCard(null);
        return;
      }
      
      setGiftCard(foundCard);
    } catch (error) {
      setError("An error occurred while searching for the gift card");
      console.error("Error searching gift card:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePayment = async () => {
    if (!giftCard) return;
    
    setIsProcessing(true);
    try {
      const result = await redeemGiftCard({
        code: giftCard.code,
        amount: total
      });
      
      if (result) {
        toast.success(`Gift card payment successful. Remaining balance: ${formatCurrency(result.current_value)}`);
        onPaymentComplete("gift_card", giftCard.code);
      } else {
        setError("Payment failed");
      }
    } catch (error) {
      setError("An error occurred while processing the payment");
      console.error("Error processing gift card payment:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2">
        <div className="flex-1 space-y-2">
          <Label htmlFor="gift-card-code">Gift Card Code</Label>
          <Input
            id="gift-card-code"
            placeholder="Enter gift card code"
            value={cardCode}
            onChange={(e) => setCardCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchCard()}
          />
        </div>
        <Button 
          variant="secondary" 
          onClick={handleSearchCard}
          disabled={isSearching}
        >
          {isSearching ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </div>
      
      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
      
      {giftCard && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                <span className="font-medium">Gift Card Found</span>
              </div>
              <span className="font-mono text-sm">{giftCard.code}</span>
            </div>
            
            <div className="space-y-1 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Available Balance:</span>
                <span className="font-medium">{formatCurrency(giftCard.current_value)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Amount:</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-sm pt-1 border-t">
                <span className="text-muted-foreground">Remaining Balance:</span>
                <span>{formatCurrency(giftCard.current_value - total)}</span>
              </div>
            </div>
            
            <Button 
              className="w-full" 
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Complete Payment
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
      
      {!giftCard && !error && (
        <div className="p-6 flex flex-col items-center justify-center text-center">
          <Gift className="h-10 w-10 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium mb-1">Enter Gift Card Code</h3>
          <p className="text-sm text-muted-foreground">
            Enter the gift card code to apply it to this transaction
          </p>
        </div>
      )}
    </div>
  );
}

export default GiftCardPayment;
