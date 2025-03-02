
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
      const cleanEmail = email.trim().toLowerCase();
      console.log("Proceeding with email:", cleanEmail);
      
      // TEMPORARY: Bypassing staff check
      console.log("Staff verification temporarily disabled");
      
      // Try to sign in with provided credentials
      await signInMethod(cleanEmail, password);
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
