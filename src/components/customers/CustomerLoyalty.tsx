
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Gift, Award } from "lucide-react";

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  loyalty_points: number | null;
  tier: string | null;
  total_spend: number | null;
}

interface CustomerLoyaltyProps {
  customer: Customer;
  onUpdate: () => Promise<void>;
}

export const CustomerLoyalty: React.FC<CustomerLoyaltyProps> = ({ customer, onUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  
  const getTierInfo = (tier: string | null) => {
    switch (tier?.toLowerCase()) {
      case "silver":
        return { next: "Gold", threshold: 1000, color: "bg-gray-400" };
      case "gold":
        return { next: "Platinum", threshold: 2000, color: "bg-yellow-400" };
      case "platinum":
        return { next: "Diamond", threshold: 5000, color: "bg-blue-400" };
      case "diamond":
        return { next: "Diamond", threshold: 10000, color: "bg-purple-400" };
      default:
        return { next: "Silver", threshold: 500, color: "bg-brown-400" };
    }
  };
  
  const tierInfo = getTierInfo(customer.tier);
  const loyaltyPoints = customer.loyalty_points || 0;
  const totalSpend = customer.total_spend || 0;
  const progress = Math.min(100, Math.round((totalSpend / tierInfo.threshold) * 100));
  
  const handleAddPoints = async () => {
    setIsUpdating(true);
    try {
      // Mock implementation - in real app, would call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Added 100 loyalty points");
      await onUpdate();
    } catch (error) {
      toast.error("Failed to add points");
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Loyalty Program</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium">{customer.tier || "Bronze"} Member</div>
              <div className="text-sm text-muted-foreground">{loyaltyPoints} points</div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleAddPoints} disabled={isUpdating}>
            {isUpdating ? "Adding..." : "Add Points"}
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress to {tierInfo.next}</span>
            <span>${totalSpend.toFixed(2)} / ${tierInfo.threshold}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="mt-4 border-t pt-4">
          <div className="text-sm font-medium mb-2">Available Rewards</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-primary" />
                <span>10% Off Next Purchase</span>
              </div>
              <Button variant="outline" size="sm" disabled={loyaltyPoints < 100}>
                Redeem (100pts)
              </Button>
            </div>
            <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-primary" />
                <span>Free Item Under $20</span>
              </div>
              <Button variant="outline" size="sm" disabled={loyaltyPoints < 200}>
                Redeem (200pts)
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerLoyalty;
