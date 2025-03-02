
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function useSignIn(
  signInMethod: (email: string, password: string) => Promise<void>,
  onFirstTimeLoginDetected: (isFirstTime: boolean) => void
) {
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignIn = async (email: string, password: string) => {
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!password.trim()) {
      toast.error("Please enter your password");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Checking for staff with email:", email);
      
      // First check if a staff record exists with this email
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .single();
      
      console.log("Staff check result:", { staffData, staffError });
      
      if (staffError && staffError.code !== 'PGRST116') {
        // This is a server error, not a "not found" error
        console.error("Staff lookup error:", staffError);
        toast.error("Error checking staff records. Please try again.");
        setIsLoading(false);
        return;
      }
      
      if (!staffData) {
        toast.error("No staff account found with this email");
        setIsLoading(false);
        return;
      }
      
      // Check if staff has an auth_id (has completed setup)
      if (!staffData.auth_id) {
        // This is a first-time login for a staff member without auth account
        onFirstTimeLoginDetected(true);
        toast.info("First time login detected. Please set your password.");
        setIsLoading(false);
        return;
      }
      
      // Try to sign in with provided credentials
      await signInMethod(email, password);
    } catch (error: any) {
      console.error("Sign in error:", error);
      const errorMessage = error.message || "Failed to sign in";
      
      if (errorMessage.includes("Invalid login credentials")) {
        toast.error("Invalid password. Please try again or reset your password.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSignIn,
  };
}
