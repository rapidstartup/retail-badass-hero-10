
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface IntegrationSettingsProps {
  stripeLiveSecretKey: string;
  setStripeLiveSecretKey: (value: string) => void;
  stripeLivePublicKey: string;
  setStripeLivePublicKey: (value: string) => void;
  stripeTestSecretKey: string;
  setStripeTestSecretKey: (value: string) => void;
  stripeTestPublicKey: string;
  setStripeTestPublicKey: (value: string) => void;
  stripeMode: "live" | "test";
  setStripeMode: (value: "live" | "test") => void;
  goHighLevelApiKey: string;
  setGoHighLevelApiKey: (value: string) => void;
}

const IntegrationSettings = ({
  stripeLiveSecretKey,
  setStripeLiveSecretKey,
  stripeLivePublicKey,
  setStripeLivePublicKey,
  stripeTestSecretKey,
  setStripeTestSecretKey,
  stripeTestPublicKey,
  setStripeTestPublicKey,
  stripeMode,
  setStripeMode,
  goHighLevelApiKey,
  setGoHighLevelApiKey,
}: IntegrationSettingsProps) => {
  // Password visibility toggles
  const [showSecretKey, setShowSecretKey] = useState<boolean>(false);
  const [showGoHighLevelKey, setShowGoHighLevelKey] = useState<boolean>(false);

  // Toggle function for password visibility
  const toggleKeyVisibility = (field: "secretKey" | "goHighLevel") => {
    if (field === "secretKey") setShowSecretKey(!showSecretKey);
    else if (field === "goHighLevel") setShowGoHighLevelKey(!showGoHighLevelKey);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Stripe Integration</CardTitle>
          <CardDescription>
            Configure your Stripe payment processing integration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="stripe-mode">Stripe Mode</Label>
              <p className="text-sm text-muted-foreground">
                Select Live mode for production, Test mode for development.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={stripeMode === "test" ? "font-medium" : "text-muted-foreground"}>Test</span>
              <Switch
                id="stripe-mode"
                checked={stripeMode === "live"}
                onCheckedChange={(checked) => setStripeMode(checked ? "live" : "test")}
              />
              <span className={stripeMode === "live" ? "font-medium" : "text-muted-foreground"}>Live</span>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-6">
            <h3 className="font-medium text-lg">
              {stripeMode === "live" ? "Live Mode API Keys" : "Test Mode API Keys"}
            </h3>
            <div className="space-y-1">
              <Label htmlFor="stripe-secret-key">Secret Key (SK)</Label>
              <div className="relative">
                <Input
                  id="stripe-secret-key"
                  value={stripeMode === "live" ? stripeLiveSecretKey : stripeTestSecretKey}
                  onChange={(e) => stripeMode === "live" 
                    ? setStripeLiveSecretKey(e.target.value) 
                    : setStripeTestSecretKey(e.target.value)
                  }
                  type={showSecretKey ? "text" : "password"}
                  className="pr-10"
                  placeholder={stripeMode === "live" ? "sk_live_..." : "sk_test_..."}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => toggleKeyVisibility("secretKey")}
                >
                  {showSecretKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Your Stripe {stripeMode === "live" ? "Live" : "Test"} mode Secret Key.
              </p>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="stripe-public-key">Publishable Key (PK)</Label>
              <Input
                id="stripe-public-key"
                value={stripeMode === "live" ? stripeLivePublicKey : stripeTestPublicKey}
                onChange={(e) => stripeMode === "live" 
                  ? setStripeLivePublicKey(e.target.value) 
                  : setStripeTestPublicKey(e.target.value)
                }
                placeholder={stripeMode === "live" ? "pk_live_..." : "pk_test_..."}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Your Stripe {stripeMode === "live" ? "Live" : "Test"} mode Publishable Key.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>GoHighLevel Integration</CardTitle>
          <CardDescription>
            Configure GoHighLevel CRM integration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="gohighlevel-api-key">API Key</Label>
            <div className="relative">
              <Input
                id="gohighlevel-api-key"
                value={goHighLevelApiKey}
                onChange={(e) => setGoHighLevelApiKey(e.target.value)}
                type={showGoHighLevelKey ? "text" : "password"}
                className="pr-10"
                placeholder="Enter your GoHighLevel API key"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => toggleKeyVisibility("goHighLevel")}
              >
                {showGoHighLevelKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Your GoHighLevel API key for connecting your POS to the CRM.
            </p>
          </div>
          
          <div className="p-4 bg-muted/20 rounded-md mt-4">
            <h3 className="font-medium mb-2">Integration Status</h3>
            <p className="text-sm text-muted-foreground">
              {goHighLevelApiKey 
                ? "GoHighLevel integration is configured. Save to apply changes."
                : "GoHighLevel integration is not configured yet."
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default IntegrationSettings;
