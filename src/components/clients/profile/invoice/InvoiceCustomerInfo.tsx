
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPhoneNumber } from "@/utils/formatters";

interface InvoiceCustomerInfoProps {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

const InvoiceCustomerInfo: React.FC<InvoiceCustomerInfoProps> = ({
  firstName,
  lastName,
  email,
  phone
}) => {
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Customer Details</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm pt-0">
        {(firstName || lastName) ? (
          <p className="font-medium">
            {firstName || ''} {lastName || ''}
          </p>
        ) : (
          <p className="text-muted-foreground italic">Guest Customer</p>
        )}
        {email && (
          <p className="text-muted-foreground">{email}</p>
        )}
        {phone && (
          <p className="text-muted-foreground">{formatPhoneNumber(phone)}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoiceCustomerInfo;
