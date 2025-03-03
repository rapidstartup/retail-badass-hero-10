
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/utils/formatters";
import { Gift, Award, TrendingUp } from "lucide-react";
import type { Customer } from '@/types/database.types';

export interface CustomerLoyaltyProps {
  customer: Customer;
  onUpdate: () => Promise<void>;
}

export const CustomerLoyalty: React.FC<CustomerLoyaltyProps> = ({ customer, onUpdate }) => {
  const tierThresholds = {
    Bronze: 0,
    Silver: 500,
    Gold: 1000,
    Platinum: 2500
  };
  
  const pointsToNextTier = () => {
    if (customer.tier === 'Platinum') return 0;
    
    const nextTier = customer.tier === 'Bronze' ? 'Silver' : 
                     customer.tier === 'Silver' ? 'Gold' : 'Platinum';
    
    return Math.max(0, tierThresholds[nextTier] - (customer.total_spend || 0));
  };
  
  const getNextTier = () => {
    if (customer.tier === 'Platinum') return 'Platinum';
    return customer.tier === 'Bronze' ? 'Silver' : 
           customer.tier === 'Silver' ? 'Gold' : 'Platinum';
  };
  
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Bronze': return 'text-amber-600';
      case 'Silver': return 'text-gray-400';
      case 'Gold': return 'text-yellow-500';
      case 'Platinum': return 'text-emerald-600';
      default: return '';
    }
  };
  
  const calculateProgress = () => {
    if (customer.tier === 'Platinum') return 100;
    
    const currentTierThreshold = tierThresholds[customer.tier || 'Bronze'];
    const nextTierThreshold = tierThresholds[getNextTier()];
    
    const range = nextTierThreshold - currentTierThreshold;
    const progress = (customer.total_spend || 0) - currentTierThreshold;
    
    return Math.min(100, Math.max(0, (progress / range) * 100));
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center">
            <Award className="mr-2 h-5 w-5 text-primary" />
            Loyalty Program
          </span>
          <Badge variant="outline" className={getTierColor(customer.tier || 'Bronze')}>
            {customer.tier || 'Bronze'} Member
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Loyalty Points</div>
            <div className="text-2xl font-semibold">{customer.loyalty_points || 0}</div>
            <div className="text-xs text-muted-foreground">
              Worth {formatCurrency((customer.loyalty_points || 0) * 0.10)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Total Spend</div>
            <div className="text-2xl font-semibold">{formatCurrency(customer.total_spend || 0)}</div>
            <div className="text-xs text-muted-foreground">Lifetime value</div>
          </div>
        </div>
        
        {(customer.tier !== 'Platinum') && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to {getNextTier()}</span>
              <span>{formatCurrency(pointsToNextTier())} more needed</span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
          </div>
        )}
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => {}}>
            <Gift className="mr-2 h-4 w-4" />
            Add Gift Card
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={() => {}}>
            <TrendingUp className="mr-2 h-4 w-4" />
            View Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
