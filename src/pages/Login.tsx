
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
    
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("Please enter your first and last name");
      return;
    }
    
    setIsLoading(true);
    try {
      // Check if the staff member already exists in the database
      const { data: existingStaff } = await supabase
        .from('staff')
        .select('id, email, auth_id')
        .eq('email', email)
        .maybeSingle();
      
      let staffId;
      
      // If the staff doesn't exist, create a new staff record
      if (!existingStaff) {
        const { data: newStaff, error: createStaffError } = await supabase
          .from('staff')
          .insert({
            email,
            first_name: firstName,
            last_name: lastName,
            role: 'staff'
          })
          .select('id')
          .single();
          
        if (createStaffError) throw createStaffError;
        staffId = newStaff.id;
      } else {
        staffId = existingStaff.id;
      }
      
      // Try to sign up the user (create auth record)
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password: newPassword,
      });
      
      if (signUpError && !signUpError.message.includes("User already registered")) {
        throw signUpError;
      }
      
      // Update the staff record with the auth_id if the auth account was created
      if (data?.user?.id) {
        const { error: updateError } = await supabase
          .from('staff')
          .update({ auth_id: data.user.id })
          .eq('id', staffId);
          
        if (updateError) throw updateError;
        
        toast.success("Account created successfully! You can now login");
      } else if (signUpError?.message.includes("User already registered")) {
        // If the auth user already exists, try to update password instead
        try {
          // First try to sign in with current credentials
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password: newPassword,
          });
          
          if (signInError) {
            // If can't sign in, try to update password
            const { error: updateError } = await supabase.auth.updateUser({
              password: newPassword
            });
            
            if (updateError) throw updateError;
          }
          
          // Update staff record in case it wasn't linked before
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user?.id) {
            await supabase
              .from('staff')
              .update({ auth_id: userData.user.id })
              .eq('id', staffId);
          }
          
          toast.success("Password updated successfully! You can now login");
        } catch (updateError: any) {
          toast.error(updateError.message || "Failed to update password");
          throw updateError;
        }
      }
      
      // Try to sign in with the new credentials
      await signIn(email, newPassword);
    } catch (error: any) {
      toast.error(error.message || "Failed to setup account");
      console.error("Setup error:", error);
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
    setFirstName("");
    setLastName("");
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
            {isFirstTimeLogin ? `Set Up Your Account` : `${settings.storeName || "NextPOS"} Staff Login`}
          </CardTitle>
          <CardDescription className="text-center">
            {isFirstTimeLogin 
              ? "Welcome! Please set up your account to continue" 
              : "Enter your credentials to sign in to your account"}
          </CardDescription>
        </CardHeader>
        
        {isFirstTimeLogin ? (
          <PasswordSetupForm
            email={email}
            setEmail={setEmail}
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
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
