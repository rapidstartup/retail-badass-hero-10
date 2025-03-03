
import React from "react";
import { Hourglass } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Customer } from "@/types/index";
import { formatCurrency, formatPhoneNumber } from "@/utils/formatters";
import { cn } from "@/lib/utils";
import { useSettings } from "@/contexts/SettingsContext";

interface ClientTableProps {
  customers: Customer[];
  loading: boolean;
  onViewCustomer: (customerId: string) => void;
}

const ClientTable: React.FC<ClientTableProps> = ({ 
  customers, 
  loading, 
  onViewCustomer 
}) => {
  const { settings } = useSettings();

  // Get customer loyalty tier badge
  const getLoyaltyBadge = (tier: string | null) => {
    if (!tier) return null;
    
    const tierColors = {
      'Bronze': 'secondary',
      'Silver': 'outline',
      'Gold': settings.theme === 'light' ? 'default' : 'default'
    };
    
    return (
      <Badge 
        variant={tierColors[tier as keyof typeof tierColors] as any || 'secondary'}
        className={tier === 'Gold' ? 'bg-theme-accent text-white' : ''}
      >
        {tier}
      </Badge>
    );
  };

  return (
    <div className="rounded-md border theme-section-bg overflow-hidden">
      <div className="overflow-x-auto" style={{ 
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--theme-accent-color) transparent'  
      }}>
        <Table>
          <TableHeader className="theme-section-bg">
            <TableRow className="hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Loyalty</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead className="text-right">Total Spend</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="theme-section-bg">
            {customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Hourglass className="h-4 w-4 mr-2 animate-spin" />
                      <span>Searching clients...</span>
                    </div>
                  ) : "No clients found"}
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow 
                  key={customer.id} 
                  className={cn(
                    "cursor-pointer hover:bg-theme-section-selected",
                  )}
                  onClick={() => onViewCustomer(customer.id)}
                >
                  <TableCell className="font-medium">
                    {customer.first_name} {customer.last_name}
                  </TableCell>
                  <TableCell>{customer.email || "—"}</TableCell>
                  <TableCell>{customer.phone ? formatPhoneNumber(customer.phone) : "—"}</TableCell>
                  <TableCell>{customer.loyalty_points || 0} points</TableCell>
                  <TableCell>{getLoyaltyBadge(customer.tier)}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(customer.total_spend || 0)}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="hover:bg-theme-section-selected"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewCustomer(customer.id);
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClientTable;
