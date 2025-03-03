
import React from "react";
import { UserRound, CalendarRange } from "lucide-react";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatPhoneNumber } from "@/utils/formatters";
import type { Customer } from "@/types/index";

interface ClientInformationProps {
  customer: Customer;
}

const ClientInformation: React.FC<ClientInformationProps> = ({ customer }) => {
  return (
    <Card className="theme-container-bg border">
      <CardHeader>
        <CardTitle>Client Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center mb-6">
          {customer.photo_url ? (
            <img 
              src={customer.photo_url} 
              alt={`${customer.first_name} ${customer.last_name}`} 
              className="rounded-full w-32 h-32 object-cover border-4 border-theme-accent/20" 
            />
          ) : (
            <div className="rounded-full w-32 h-32 bg-theme-accent/10 flex items-center justify-center">
              <UserRound className="h-16 w-16 text-theme-accent/40" />
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <div className="w-6 flex-shrink-0">
              <UserRound className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <div className="font-medium">{customer.first_name} {customer.last_name}</div>
              <div className="text-sm text-muted-foreground">Name</div>
            </div>
          </div>
          
          {customer.email && (
            <div className="flex items-start gap-2">
              <div className="w-6 flex-shrink-0">
                <svg className="h-5 w-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </div>
              <div>
                <div className="font-medium">{customer.email}</div>
                <div className="text-sm text-muted-foreground">Email</div>
              </div>
            </div>
          )}
          
          {customer.phone && (
            <div className="flex items-start gap-2">
              <div className="w-6 flex-shrink-0">
                <svg className="h-5 w-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <div>
                <div className="font-medium">{formatPhoneNumber(customer.phone)}</div>
                <div className="text-sm text-muted-foreground">Phone</div>
              </div>
            </div>
          )}
          
          <div className="flex items-start gap-2">
            <div className="w-6 flex-shrink-0">
              <CalendarRange className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <div className="font-medium">
                {customer.created_at ? format(new Date(customer.created_at), 'MMM d, yyyy') : 'Unknown'}
              </div>
              <div className="text-sm text-muted-foreground">Customer since</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientInformation;
