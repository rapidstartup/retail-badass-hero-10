
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface StripeIntegrationProps {
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
}

const StripeIntegration = ({
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
}: StripeIntegrationProps) => {
  // Password visibility toggle
  const [showSecretKey, setShowSecretKey] = useState<boolean>(false);

  return (
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
                onClick={() => setShowSecretKey(!showSecretKey)}
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
  );
};

export default StripeIntegration;
