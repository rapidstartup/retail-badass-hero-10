
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
      console.log("Checking for staff with email:", cleanEmail);
      
      // Query staff table with case-insensitive email search
      const { data: staffList, error: staffListError } = await supabase
        .from('staff')
        .select('*')
        .ilike('email', cleanEmail);
      
      console.log("Staff check result:", { staffList, staffListError });
      
      if (staffListError) {
        console.error("Staff lookup error:", staffListError);
        toast.error("Error checking staff records. Please try again.");
        setIsLoading(false);
        return;
      }
      
      // If no staff found or empty array
      if (!staffList || staffList.length === 0) {
        toast.error("No staff account found with this email");
        setIsLoading(false);
        return;
      }
      
      const staffData = staffList[0];
      
      // Check if staff has an auth_id (has completed setup)
      if (!staffData.auth_id) {
        // This is a first-time login for a staff member without auth account
        onFirstTimeLoginDetected(true);
        toast.info("First time login detected. Please set your password.");
        setIsLoading(false);
        return;
      }
      
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
