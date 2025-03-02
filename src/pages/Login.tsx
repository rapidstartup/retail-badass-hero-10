
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSettings } from "@/contexts/SettingsContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstTimeLogin, setIsFirstTimeLogin] = useState(false);
  const { signIn, isAuthenticated } = useAuth();
  const { settings } = useSettings();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(email, password);
    } catch (error: any) {
      const errorMessage = error.message || "Failed to sign in";
      
      if (errorMessage.includes("Invalid login credentials")) {
        const { data: staffData } = await supabase
          .from('staff')
          .select('email')
          .eq('email', email)
          .single();
        
        if (staffData) {
          setIsFirstTimeLogin(true);
          toast.info("First time login detected. Please set your password.");
        } else {
          toast.error("No staff account found with this email");
        }
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    setIsLoading(true);
    try {
      // First create the user account since it doesn't exist yet
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password: newPassword,
      });
      
      if (signUpError) throw signUpError;
      
      toast.success("Password set successfully! You can now login");
      
      // Automatically sign in with the new credentials
      await signIn(email, newPassword);
    } catch (error: any) {
      // Handle case where user might already exist in auth but failed login
      if (error.message.includes("User already registered")) {
        try {
          // Try to update password instead
          const { error: updateError } = await supabase.auth.updateUser({
            password: newPassword
          });
          
          if (updateError) throw updateError;
          
          toast.success("Password updated successfully! You can now login");
          await signIn(email, newPassword);
        } catch (updateError: any) {
          toast.error(updateError.message || "Failed to update password");
        }
      } else {
        toast.error(error.message || "Failed to set password");
      }
    } finally {
      setIsLoading(false);
      setIsFirstTimeLogin(false);
    }
  };

  // Return to login form
  const handleBackToLogin = () => {
    setIsFirstTimeLogin(false);
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {isFirstTimeLogin ? `Set Your Password` : `${settings.storeName || "NextPOS"} Staff Login`}
          </CardTitle>
          <CardDescription className="text-center">
            {isFirstTimeLogin 
              ? "Welcome! Please set your password to continue" 
              : "Enter your credentials to sign in to your account"}
          </CardDescription>
        </CardHeader>
        
        {isFirstTimeLogin ? (
          <form onSubmit={handleSetPassword}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
        ) : (
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
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
};

export default Login;
