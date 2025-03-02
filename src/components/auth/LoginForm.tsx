
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleSignIn: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  onFirstTimeLoginDetected: (isFirstTime: boolean) => void;
  onFirstTimeSetupClick: () => void;
  onNewStaffSetupClick: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  handleSignIn,
  isLoading,
  onFirstTimeLoginDetected,
  onFirstTimeSetupClick,
  onNewStaffSetupClick
}) => {
  return (
    <form onSubmit={handleSignIn}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="your.email@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Button 
              variant="link" 
              className="p-0 h-auto text-sm"
              type="button"
              onClick={async () => {
                if (!email) {
                  toast.error("Please enter your email first");
                  return;
                }
                try {
                  const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: window.location.origin + '/login?firstTime=true',
                  });
                  
                  if (error) throw error;
                  toast.success("Password reset email sent");
                } catch (error: any) {
                  toast.error(error.message || "Failed to send reset email");
                }
              }}
            >
              Forgot password?
            </Button>
          </div>
          <Input 
            id="password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </CardContent>
      <CardFooter className="flex-col space-y-2">
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
        
        <div className="w-full flex flex-col items-center space-y-2 mt-2">
          <div className="flex items-center w-full">
            <Separator className="flex-1" />
            <span className="px-2 text-xs text-muted-foreground">Staff Setup Options</span>
            <Separator className="flex-1" />
          </div>
          
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              className="text-xs"
              onClick={onFirstTimeSetupClick}
            >
              Existing Staff Setup
            </Button>
            
            <Button 
              type="button" 
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={onNewStaffSetupClick}
            >
              New Staff Registration
            </Button>
          </div>
        </div>
      </CardFooter>
    </form>
  );
};

export default LoginForm;
