
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatters";
import { Gift, Award, TrendingUp, Zap } from "lucide-react";

interface CustomerLoyaltyProps {
  loyalty_points: number;
  tier: string;
  total_spend: number;
}

const TIER_CONFIG = {
  Bronze: {
    color: "bg-amber-700",
    icon: <Award className="h-4 w-4 text-amber-700" />,
    nextTier: "Silver",
    nextTierPoints: 1000
  },
  Silver: {
    color: "bg-slate-400",
    icon: <Award className="h-4 w-4 text-slate-400" />,
    nextTier: "Gold",
    nextTierPoints: 5000
  },
  Gold: {
    color: "bg-amber-400",
    icon: <Award className="h-4 w-4 text-amber-400" />,
    nextTier: null,
    nextTierPoints: null
  }
};

export const CustomerLoyalty: React.FC<CustomerLoyaltyProps> = ({ 
  loyalty_points = 0, 
  tier = "Bronze", 
  total_spend = 0 
}) => {
  const currentTierConfig = TIER_CONFIG[tier as keyof typeof TIER_CONFIG] || TIER_CONFIG.Bronze;
  
  const pointsToNextTier = currentTierConfig.nextTierPoints 
    ? currentTierConfig.nextTierPoints - loyalty_points 
    : 0;
  
  const progressPercent = currentTierConfig.nextTierPoints 
    ? Math.min(100, Math.round((loyalty_points / currentTierConfig.nextTierPoints) * 100)) 
    : 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Loyalty Status</h3>
        <Badge className={`${currentTierConfig.color} text-white`}>
          {currentTierConfig.icon}
          <span className="ml-1">{tier}</span>
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardHeader className="p-3 pb-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Points</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-1">
            <div className="flex items-center">
              <Gift className="h-4 w-4 mr-1 text-primary" />
              <span className="text-xl font-bold">{loyalty_points}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-3 pb-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Lifetime Spend</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-1">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-1 text-primary" />
              <span className="text-xl font-bold">{formatCurrency(total_spend)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {currentTierConfig.nextTier && (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Progress to {currentTierConfig.nextTier}</span>
            <span className="font-medium">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{loyalty_points} points</span>
            <div className="flex items-center">
              <Zap className="h-3 w-3 mr-1" />
              <span>{pointsToNextTier} more points needed</span>
            </div>
            <span>{currentTierConfig.nextTierPoints} points</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerLoyalty;
