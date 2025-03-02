
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
      await signInMethod(email, password);
    } catch (error: any) {
      const errorMessage = error.message || "Failed to sign in";
      
      if (errorMessage.includes("Invalid login credentials")) {
        const { data: staffData } = await supabase
          .from('staff')
          .select('email')
          .eq('email', email)
          .single();
        
        if (staffData) {
          onFirstTimeLoginDetected(true);
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

  return {
    isLoading,
    handleSignIn,
  };
}
