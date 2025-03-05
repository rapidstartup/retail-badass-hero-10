
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface StoreInformationFieldsProps {
  storeName: string;
  storeAddress: string;
  storePhone: string;
  onStoreNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStoreAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStorePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const StoreInformationFields: React.FC<StoreInformationFieldsProps> = ({
  storeName,
  storeAddress,
  storePhone,
  onStoreNameChange,
  onStoreAddressChange,
  onStorePhoneChange
}) => {
  return (
    <>
      <div className="space-y-1">
        <Label htmlFor="store-name">Store Name</Label>
        <Input 
          id="store-name" 
          placeholder="Enter your store name" 
          value={storeName}
          onChange={onStoreNameChange}
        />
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="store-address">Store Address</Label>
        <Input 
          id="store-address" 
          placeholder="Enter your store address" 
          value={storeAddress}
          onChange={onStoreAddressChange}
        />
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="store-phone">Store Phone</Label>
        <Input 
          id="store-phone" 
          placeholder="Enter your store phone" 
          value={storePhone}
          onChange={onStorePhoneChange}
        />
      </div>
    </>
  );
};

export default StoreInformationFields;
