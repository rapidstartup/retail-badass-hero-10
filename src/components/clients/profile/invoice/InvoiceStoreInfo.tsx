
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InvoiceStoreInfoProps {
  storeName: string;
  storeAddress: string;
  storePhone: string;
}

const InvoiceStoreInfo: React.FC<InvoiceStoreInfoProps> = ({
  storeName,
  storeAddress,
  storePhone
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {storeName}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm">
        <p>{storeAddress}</p>
        <p>{storePhone}</p>
      </CardContent>
    </Card>
  );
};

export default InvoiceStoreInfo;
