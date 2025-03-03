
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, CreditCard } from 'lucide-react';

interface CustomerCardsProps {
  cards: any[]; // Array of customer's saved cards
  onAddCard: () => void;
  onSelectCard: (card: any) => void;
}

const CustomerCards: React.FC<CustomerCardsProps> = ({
  cards = [],
  onAddCard,
  onSelectCard,
}) => {
  // Helper function to format card number with asterisks
  const formatCardNumber = (last4: string) => {
    return `•••• •••• •••• ${last4}`;
  };

  // Helper function to get brand icon
  const getBrandIcon = (brand: string) => {
    return <CreditCard className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Payment Methods</h3>
        <Button size="sm" variant="outline" onClick={onAddCard}>
          <PlusCircle className="mr-1 h-4 w-4" /> Add Card
        </Button>
      </div>

      {cards.length === 0 ? (
        <Card className="bg-muted/50">
          <CardContent className="py-6 text-center">
            <CreditCard className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <CardTitle className="text-base font-medium mb-1">No Cards Saved</CardTitle>
            <p className="text-sm text-muted-foreground mb-4">
              This customer doesn't have any payment methods on file
            </p>
            <Button variant="outline" size="sm" onClick={onAddCard}>
              <PlusCircle className="mr-1 h-4 w-4" /> Add Payment Method
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {cards.map((card, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => onSelectCard(card)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    {getBrandIcon(card.brand)}
                    <span className="ml-2 font-medium">{card.brand}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Expires {card.exp_month}/{card.exp_year}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="font-mono">{formatCardNumber(card.last4)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerCards;
