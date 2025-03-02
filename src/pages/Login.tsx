
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSettings } from "@/contexts/SettingsContext";
import LoginForm from "@/components/auth/LoginForm";
import PasswordSetupForm from "@/components/auth/PasswordSetupForm";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstTimeLogin, setIsFirstTimeLogin] = useState(false);
  const { signIn, isAuthenticated } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();

  // Check if URL has firstTime parameter
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('firstTime') === 'true') {
      setIsFirstTimeLogin(true);
    }
  }, [location]);

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
      // Check if the staff member exists in the database
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('id, email')
        .eq('email', email)
        .single();
      
      if (staffError) {
        if (staffError.code === 'PGRST116') {
          throw new Error("No staff account found with this email. Please contact your administrator.");
        }
        throw staffError;
      }
      
      // First create the user account since it doesn't exist yet
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password: newPassword,
      });
      
      if (signUpError) throw signUpError;
      
      // Update the staff record with the auth_id
      if (data?.user?.id) {
        const { error: updateError } = await supabase
          .from('staff')
          .update({ auth_id: data.user.id })
          .eq('email', email);
          
        if (updateError) throw updateError;
      }
      
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

  // Handle first time setup click
  const handleFirstTimeSetupClick = () => {
    setIsFirstTimeLogin(true);
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
    <div className="min-h-screen flex items-center justify-center theme-bg p-4">
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
          <PasswordSetupForm
            email={email}
            setEmail={setEmail}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            handleSetPassword={handleSetPassword}
            handleBackToLogin={handleBackToLogin}
            isLoading={isLoading}
          />
        ) : (
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleSignIn={handleSignIn}
            isLoading={isLoading}
            onFirstTimeLoginDetected={setIsFirstTimeLogin}
            onFirstTimeSetupClick={handleFirstTimeSetupClick}
          />
        )}
      </Card>
    </div>
  );
};

export default Login;
