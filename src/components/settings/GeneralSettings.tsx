
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/contexts/SettingsContext";
import { toast } from "sonner";

const GeneralSettings = () => {
  const { settings, updateSettings } = useSettings();
  const [storeName, setStoreName] = useState(settings.storeName || "NextPOS");
  const [storeAddress, setStoreAddress] = useState(settings.storeAddress || "");
  const [storePhone, setStorePhone] = useState(settings.storePhone || "");
  
  // Update local state when settings change
  useEffect(() => {
    setStoreName(settings.storeName || "NextPOS");
    setStoreAddress(settings.storeAddress || "");
    setStorePhone(settings.storePhone || "");
  }, [settings.storeName, settings.storeAddress, settings.storePhone]);
  
  const handleSave = async () => {
    try {
      await updateSettings({
        storeName,
        storeAddress,
        storePhone
      });
      toast.success("General settings updated");
    } catch (error) {
      toast.error("Failed to update general settings");
      console.error("Error updating general settings:", error);
    }
  };

  // Update store name in real-time
  const handleStoreNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStoreName(value);
    updateSettings({ storeName: value });
  };

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
            onChange={handleStoreNameChange}
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
      <CardFooter>
        <Button onClick={handleSave}>
          Save General Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GeneralSettings;
