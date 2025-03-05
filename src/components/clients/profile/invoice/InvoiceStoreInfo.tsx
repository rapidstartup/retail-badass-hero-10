
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image } from "lucide-react";

interface InvoiceStoreInfoProps {
  storeName: string;
  storeAddress: string;
  storePhone: string;
  logoUrl?: string;
}

const InvoiceStoreInfo: React.FC<InvoiceStoreInfoProps> = ({
  storeName,
  storeAddress,
  storePhone,
  logoUrl
}) => {
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">
            {storeName}
          </CardTitle>
        </div>
        {logoUrl ? (
          <div className="w-16 h-16 overflow-hidden">
            <img 
              src={logoUrl} 
              alt={`${storeName} logo`} 
              className="object-contain w-full h-full" 
            />
          </div>
        ) : (
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-muted/20">
            <Image className="w-8 h-8 text-muted-foreground/60" />
          </div>
        )}
      </CardHeader>
      <CardContent className="grid gap-2 text-sm pt-0">
        <p>{storeAddress}</p>
        <p>{storePhone}</p>
      </CardContent>
    </Card>
  );
};

export default InvoiceStoreInfo;
