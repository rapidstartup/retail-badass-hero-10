
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CreditCard, Plus, Trash2, RefreshCw, Check, AlertCircle, 
  Visa, CreditCard as CreditCardIcon 
} from "lucide-react";
import { Customer, updateCustomer } from "@/api/customerApi";
import { 
  fetchCustomerCards, addCardToCustomer, removeCard, 
  createStripeCustomer, StripeCard 
} from "@/api/stripeApi";
import { toast } from "sonner";

interface CustomerCardsProps {
  customer: Customer;
}

export const CustomerCards: React.FC<CustomerCardsProps> = ({ customer }) => {
  const [cards, setCards] = useState<StripeCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadCards();
  }, [customer.id]);

  const loadCards = async () => {
    setIsLoading(true);
    try {
      if (!customer.stripe_customer_id) {
        setCards([]);
        setIsLoading(false);
        return;
      }
      
      const cards = await fetchCustomerCards(customer.stripe_customer_id);
      setCards(cards);
    } catch (error) {
      console.error("Error loading cards:", error);
      toast.error("Failed to load payment cards");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validation
      if (!cardData.cardNumber || !cardData.expiryMonth || !cardData.expiryYear || !cardData.cvc) {
        toast.error("Please fill in all card fields");
        return;
      }
      
      // Check if we need to create a Stripe customer first
      let stripeCustomerId = customer.stripe_customer_id;
      if (!stripeCustomerId) {
        const newStripeId = await createStripeCustomer(
          customer.id,
          customer.email || "",
          `${customer.first_name} ${customer.last_name}`
        );
        
        if (!newStripeId) {
          toast.error("Failed to create Stripe customer");
          return;
        }
        
        // Update the customer with the new Stripe ID
        const updatedCustomer = await updateCustomer(customer.id, {
          stripe_customer_id: newStripeId
        });
        
        if (!updatedCustomer) {
          toast.error("Failed to update customer with Stripe ID");
          return;
        }
        
        stripeCustomerId = newStripeId;
      }
      
      // Add the card
      const newCard = await addCardToCustomer(
        stripeCustomerId,
        cardData.cardNumber,
        parseInt(cardData.expiryMonth),
        parseInt(cardData.expiryYear),
        cardData.cvc
      );
      
      if (newCard) {
        toast.success("Card added successfully");
        setCards([...cards, newCard]);
        setIsAddingCard(false);
        setCardData({
          cardNumber: "",
          expiryMonth: "",
          expiryYear: "",
          cvc: ""
        });
      } else {
        toast.error("Failed to add card");
      }
    } catch (error) {
      console.error("Error adding card:", error);
      toast.error("An error occurred while adding the card");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveCard = async (cardId: string) => {
    try {
      const success = await removeCard(cardId);
      if (success) {
        toast.success("Card removed successfully");
        setCards(cards.filter(card => card.id !== cardId));
      } else {
        toast.error("Failed to remove card");
      }
    } catch (error) {
      console.error("Error removing card:", error);
      toast.error("An error occurred while removing the card");
    }
  };

  const getCardIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return <Visa className="h-5 w-5 text-blue-600" />;
      case 'mastercard':
        return <CreditCardIcon className="h-5 w-5 text-orange-600" />;
      default:
        return <CreditCard className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-4">
      {!customer.stripe_customer_id && !isAddingCard && (
        <div className="bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 p-4 rounded-md flex items-start gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-medium">No Stripe customer account</p>
            <p className="text-sm mt-1">Add a card to automatically create a Stripe customer.</p>
          </div>
        </div>
      )}
      
      {isAddingCard ? (
        <Card>
          <form onSubmit={handleAddCard}>
            <CardHeader>
              <CardTitle className="text-xl">Add Payment Card</CardTitle>
              <CardDescription>
                Add a new credit or debit card to this customer's account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  value={cardData.cardNumber}
                  onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                  placeholder="4242 4242 4242 4242"
                  required
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryMonth">Expiry Month</Label>
                  <Input
                    id="expiryMonth"
                    value={cardData.expiryMonth}
                    onChange={(e) => setCardData({ ...cardData, expiryMonth: e.target.value })}
                    placeholder="MM"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryYear">Expiry Year</Label>
                  <Input
                    id="expiryYear"
                    value={cardData.expiryYear}
                    onChange={(e) => setCardData({ ...cardData, expiryYear: e.target.value })}
                    placeholder="YYYY"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    value={cardData.cvc}
                    onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                    placeholder="123"
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddingCard(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Add Card
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      ) : isLoading ? (
        <div className="flex justify-center items-center h-32">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : cards.length === 0 ? (
        <div className="border rounded-lg p-6 text-center">
          <CreditCard className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Payment Cards</h3>
          <p className="text-muted-foreground mb-4">
            This customer doesn't have any payment cards yet.
          </p>
          <Button 
            onClick={() => setIsAddingCard(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Card
          </Button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Saved Payment Cards</h3>
            <Button 
              onClick={() => setIsAddingCard(true)}
              size="sm"
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Card
            </Button>
          </div>
          
          <div className="space-y-4">
            {cards.map((card) => (
              <div 
                key={card.id} 
                className="flex justify-between items-center p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getCardIcon(card.brand)}
                  <div>
                    <p className="font-medium">•••• •••• •••• {card.last4}</p>
                    <p className="text-sm text-muted-foreground">
                      Expires {card.exp_month.toString().padStart(2, '0')}/{card.exp_year}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveCard(card.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
