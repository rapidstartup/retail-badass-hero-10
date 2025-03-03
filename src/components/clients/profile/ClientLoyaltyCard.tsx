
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatters";
import { TIER_THRESHOLDS } from "@/utils/tierCalculator";
import type { Customer } from "@/types/index";

interface ClientLoyaltyCardProps {
  customer: Customer;
  spendToNextTier: number;
}

const ClientLoyaltyCard: React.FC<ClientLoyaltyCardProps> = ({ customer, spendToNextTier }) => {
  return (
    <Card className="theme-container-bg border">
      <CardHeader>
        <CardTitle>Loyalty Program</CardTitle>
        <CardDescription>Points and rewards status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold">{customer.loyalty_points || 0}</span>
          <span className="text-sm text-muted-foreground">Points</span>
        </div>
        <div className="h-2.5 bg-secondary/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-theme-accent rounded-full" 
            style={{ width: `${Math.min(((customer.loyalty_points || 0) / 100) * 100, 100)}%` }}
          ></div>
        </div>
        <div className="text-sm text-muted-foreground text-center">
          {customer.loyalty_points || 0} / 100 points to next reward
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Spending Tier Progress</span>
            <Badge variant={customer.tier === 'Gold' ? 'default' : customer.tier === 'Silver' ? 'outline' : 'secondary'}>
              {customer.tier || 'Bronze'}
            </Badge>
          </div>
          
          {customer.tier !== 'Gold' && (
            <>
              <div className="h-2.5 bg-secondary/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-theme-accent rounded-full" 
                  style={{ 
                    width: customer.tier === 'Silver' 
                      ? `${Math.min(((customer.total_spend || 0) / TIER_THRESHOLDS.GOLD) * 100, 100)}%`
                      : `${Math.min(((customer.total_spend || 0) / TIER_THRESHOLDS.SILVER) * 100, 100)}%`
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>
                  {formatCurrency(customer.total_spend || 0)}
                </span>
                <span>
                  {customer.tier === 'Silver' 
                    ? formatCurrency(TIER_THRESHOLDS.GOLD)
                    : formatCurrency(TIER_THRESHOLDS.SILVER)
                  }
                </span>
              </div>
              <div className="text-sm text-center mt-2">
                {spendToNextTier > 0 
                  ? `${formatCurrency(spendToNextTier)} more to reach ${customer.tier === 'Silver' ? 'Gold' : 'Silver'}`
                  : customer.tier === 'Gold' 
                    ? 'Highest tier reached!' 
                    : ''
                }
              </div>
            </>
          )}
          
          {customer.tier === 'Gold' && (
            <div className="text-sm text-center py-2 text-theme-accent">
              Highest tier reached!
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <span className="text-sm">Current Tier</span>
        <Badge variant={customer.tier === 'Gold' ? 'default' : customer.tier === 'Silver' ? 'outline' : 'secondary'}>
          {customer.tier || 'Bronze'}
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default ClientLoyaltyCard;
