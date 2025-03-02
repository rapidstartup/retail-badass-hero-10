
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CardPaymentProps {
  cardNumber: string;
  setCardNumber: (value: string) => void;
  cardExpiryMonth: string;
  setCardExpiryMonth: (value: string) => void;
  cardExpiryYear: string;
  setCardExpiryYear: (value: string) => void;
  cardCVC: string;
  setCardCVC: (value: string) => void;
}

export function CardPayment({
  cardNumber,
  setCardNumber,
  cardExpiryMonth,
  setCardExpiryMonth,
  cardExpiryYear,
  setCardExpiryYear,
  cardCVC,
  setCardCVC,
}: CardPaymentProps) {
  return (
    <div className="space-y-4">
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
    </div>
  );
}
