
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface GoHighLevelIntegrationProps {
  goHighLevelApiKey: string;
  setGoHighLevelApiKey: (value: string) => void;
}

const GoHighLevelIntegration = ({
  goHighLevelApiKey,
  setGoHighLevelApiKey,
}: GoHighLevelIntegrationProps) => {
  // Password visibility toggle
  const [showGoHighLevelKey, setShowGoHighLevelKey] = useState<boolean>(false);

  return (
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
              onClick={() => setShowGoHighLevelKey(!showGoHighLevelKey)}
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
  );
};

export default GoHighLevelIntegration;
