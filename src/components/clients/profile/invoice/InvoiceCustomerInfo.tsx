
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InvoiceCustomerInfoProps {
  firstName?: string;
  lastName?: string;
  email?: string;
}

const InvoiceCustomerInfo: React.FC<InvoiceCustomerInfoProps> = ({
  firstName,
  lastName,
  email
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Customer Details</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm">
        <p>
          {firstName} {lastName}
        </p>
        {email && (
          <p>{email}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoiceCustomerInfo;
