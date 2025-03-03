
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createGiftCard, fetchGiftCardsByCustomer, GiftCard, deactivateGiftCard } from "@/api/giftCardApi";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { Plus, RefreshCw, Gift, Check, AlertCircle, Ban } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CustomerGiftCardsProps {
  customerId: string;
}

export const CustomerGiftCards: React.FC<CustomerGiftCardsProps> = ({ customerId }) => {
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const [cardAmount, setCardAmount] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  useEffect(() => {
    loadGiftCards();
  }, [customerId]);

  const loadGiftCards = async () => {
    setIsLoading(true);
    try {
      const cards = await fetchGiftCardsByCustomer(customerId);
      setGiftCards(cards);
    } catch (error) {
      console.error("Error loading gift cards:", error);
      toast.error("Failed to load gift cards");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGiftCard = async () => {
    setIsCreatingCard(true);
    try {
      // Validate amount
      const amount = parseFloat(cardAmount);
      if (isNaN(amount) || amount <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }

      // Parse expiry date if provided
      let expiryDateValue = null;
      if (expiryDate) {
        expiryDateValue = new Date(expiryDate).toISOString();
      }

      const newGiftCard = await createGiftCard({
        initial_value: amount,
        customer_id: customerId,
        expires_at: expiryDateValue
      });

      if (newGiftCard) {
        toast.success("Gift card created successfully");
        setGiftCards([newGiftCard, ...giftCards]);
        setIsOpenDialog(false);
        setCardAmount("");
        setExpiryDate("");
      } else {
        toast.error("Failed to create gift card");
      }
    } catch (error) {
      console.error("Error creating gift card:", error);
      toast.error("An error occurred while creating the gift card");
    } finally {
      setIsCreatingCard(false);
    }
  };

  const handleDeactivateGiftCard = async (id: string) => {
    try {
      const success = await deactivateGiftCard(id);
      if (success) {
        toast.success("Gift card deactivated successfully");
        // Update the list to reflect the change
        setGiftCards(
          giftCards.map(card => 
            card.id === id ? { ...card, is_active: false } : card
          )
        );
      } else {
        toast.error("Failed to deactivate gift card");
      }
    } catch (error) {
      console.error("Error deactivating gift card:", error);
      toast.error("An error occurred while deactivating the gift card");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Gift Cards</h3>
        <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
          <DialogTrigger asChild>
            <Button 
              size="sm"
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Gift Card
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Gift Card</DialogTitle>
              <DialogDescription>
                Add a new gift card to this customer's account
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Gift Card Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                  <Input
                    id="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-8"
                    value={cardAmount}
                    onChange={(e) => setCardAmount(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date (Optional)</Label>
                <Input
                  id="expiry"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsOpenDialog(false)}
                disabled={isCreatingCard}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateGiftCard}
                disabled={isCreatingCard}
              >
                {isCreatingCard ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Gift className="mr-2 h-4 w-4" />
                    Create Gift Card
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : giftCards.length === 0 ? (
        <div className="border rounded-lg p-6 text-center">
          <Gift className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Gift Cards</h3>
          <p className="text-muted-foreground mb-4">
            This customer doesn't have any gift cards yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {giftCards.map((card) => (
            <div 
              key={card.id} 
              className={`border rounded-lg p-4 ${!card.is_active ? 'bg-muted/50' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <Gift className={`h-5 w-5 ${card.is_active ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="font-mono text-sm">{card.code}</span>
                    {!card.is_active && <Badge variant="outline">Inactive</Badge>}
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-2 text-sm">
                      <span className="text-muted-foreground">Initial Value:</span>
                      <span>{formatCurrency(card.initial_value)}</span>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <span className="text-muted-foreground">Current Value:</span>
                      <span>{formatCurrency(card.current_value)}</span>
                    </div>
                    {card.expires_at && (
                      <div className="flex gap-2 text-sm">
                        <span className="text-muted-foreground">Expires:</span>
                        <span>{formatDate(card.expires_at)}</span>
                      </div>
                    )}
                    {card.created_at && (
                      <div className="flex gap-2 text-sm">
                        <span className="text-muted-foreground">Created:</span>
                        <span>{formatDate(card.created_at)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {card.is_active && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Ban className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Deactivate Gift Card</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will deactivate the gift card with code <span className="font-mono">{card.code}</span>.
                          The remaining balance of {formatCurrency(card.current_value)} will be lost.
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeactivateGiftCard(card.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Deactivate
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
