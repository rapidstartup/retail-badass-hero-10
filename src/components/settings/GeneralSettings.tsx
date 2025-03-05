
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/contexts/SettingsContext";
import { toast } from "sonner";
import LogoUploader from "./general/LogoUploader";
import StoreInformationFields from "./general/StoreInformationFields";

const GeneralSettings = () => {
  const { settings, updateSettings, saveSettings } = useSettings();
  const [storeName, setStoreName] = useState(settings.storeName || "NextPOS");
  const [storeAddress, setStoreAddress] = useState(settings.storeAddress || "");
  const [storePhone, setStorePhone] = useState(settings.storePhone || "");
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || "");
  
  useEffect(() => {
    setStoreName(settings.storeName || "NextPOS");
    setStoreAddress(settings.storeAddress || "");
    setStorePhone(settings.storePhone || "");
    setLogoUrl(settings.logoUrl || "");
  }, [settings.storeName, settings.storeAddress, settings.storePhone, settings.logoUrl]);
  
  const handleSave = async () => {
    try {
      await updateSettings({
        storeName,
        storeAddress,
        storePhone,
        logoUrl
      });
      
      await saveSettings();
      
      toast.success("General settings updated");
    } catch (error) {
      toast.error("Failed to update general settings");
      console.error("Error updating general settings:", error);
    }
  };

  const handleStoreAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStoreAddress(value);
  };
  
  const handleStorePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStorePhone(value);
  };

  const handleStoreNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStoreName(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>
          Configure general system settings for your POS.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <StoreInformationFields 
          storeName={storeName}
          storeAddress={storeAddress}
          storePhone={storePhone}
          onStoreNameChange={handleStoreNameChange}
          onStoreAddressChange={handleStoreAddressChange}
          onStorePhoneChange={handleStorePhoneChange}
        />
        
        <LogoUploader 
          logoUrl={logoUrl}
          setLogoUrl={setLogoUrl}
        />
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
