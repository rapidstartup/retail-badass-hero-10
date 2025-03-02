
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
      // Try to sign in with provided credentials
      await signInMethod(email, password);
    } catch (error: any) {
      console.log("Sign in error:", error.message);
      const errorMessage = error.message || "Failed to sign in";
      
      if (errorMessage.includes("Invalid login credentials")) {
        // Check if staff record exists with this email
        const { data: staffData } = await supabase
          .from('staff')
          .select('*')
          .eq('email', email)
          .single();
        
        if (staffData) {
          // Staff exists but no auth account or wrong password
          if (!staffData.auth_id) {
            // This is likely a first-time login for a staff member without auth account
            onFirstTimeLoginDetected(true);
            toast.info("First time login detected. Please set your password.");
          } else {
            // Auth account exists but password is wrong
            toast.error("Invalid password. Please try again or reset your password.");
          }
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

  return {
    isLoading,
    handleSignIn,
  };
}
