
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const GeneralSettings = () => {
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
          <Input id="store-name" placeholder="Enter your store name" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="store-address">Store Address</Label>
          <Input id="store-address" placeholder="Enter your store address" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="store-phone">Store Phone</Label>
          <Input id="store-phone" placeholder="Enter your store phone" />
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralSettings;
