
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSettings } from "@/contexts/SettingsContext";

const GeneralSettings = () => {
  const { settings, updateSettings } = useSettings();
  const [storeName, setStoreName] = useState(settings.storeName || "NextPOS");
  const [storeAddress, setStoreAddress] = useState(settings.storeAddress || "");
  const [storePhone, setStorePhone] = useState(settings.storePhone || "");

  // Update the context when input values change
  useEffect(() => {
    updateSettings({
      storeName,
      storeAddress,
      storePhone
    });
  }, [storeName, storeAddress, storePhone, updateSettings]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>
          Configure general system settings for your POS.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="store-name">Store Name</Label>
          <Input 
            id="store-name" 
            placeholder="Enter your store name" 
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="store-address">Store Address</Label>
          <Input 
            id="store-address" 
            placeholder="Enter your store address" 
            value={storeAddress}
            onChange={(e) => setStoreAddress(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="store-phone">Store Phone</Label>
          <Input 
            id="store-phone" 
            placeholder="Enter your store phone" 
            value={storePhone}
            onChange={(e) => setStorePhone(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralSettings;
