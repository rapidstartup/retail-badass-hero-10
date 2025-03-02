
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";

interface PasswordSetupFormProps {
  email: string;
  newPassword: string;
  setNewPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  handleSetPassword: (e: React.FormEvent) => Promise<void>;
  handleBackToLogin: () => void;
  isLoading: boolean;
}

const PasswordSetupForm: React.FC<PasswordSetupFormProps> = ({
  email,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  handleSetPassword,
  handleBackToLogin,
  isLoading
}) => {
  return (
    <form onSubmit={handleSetPassword}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            value={email}
            onChange={() => {}} // Disabled input doesn't need an onChange handler
            disabled={true}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input 
            id="newPassword" 
            type="password" 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input 
            id="confirmPassword" 
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          type="button" 
          variant="outline"
          onClick={handleBackToLogin}
        >
          Back to Login
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? "Setting password..." : "Set Password & Login"}
        </Button>
      </CardFooter>
    </form>
  );
};

export default PasswordSetupForm;
