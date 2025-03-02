
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function usePasswordSetup(
  signIn: (email: string, password: string) => Promise<void>
) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSetPassword = async (
    email: string,
    firstName: string,
    lastName: string,
    newPassword: string,
    confirmPassword: string,
    onComplete: () => void
  ) => {
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
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password: newPassword,
      });
      
      if (signUpError) {
        throw signUpError;
      }
      
      if (data?.user?.id) {
        const { error: createStaffError } = await supabase
          .from('staff')
          .insert({
            email,
            first_name: firstName,
            last_name: lastName,
            auth_id: data.user.id,
            role: 'staff'
          });
          
        if (createStaffError) throw createStaffError;
        
        toast.success("Account created successfully! You can now login");
        
        await signIn(email, newPassword);
      } else {
        toast.error("Failed to create account");
      }
    } catch (error: any) {
      if (error.message?.includes("User already registered")) {
        toast.error("An account with this email already exists. Please use the login form.");
      } else {
        toast.error(error.message || "Failed to setup account");
        console.error("Setup error:", error);
      }
    } finally {
      setIsLoading(false);
      onComplete();
    }
  };

  return {
    isLoading,
    handleSetPassword,
  };
}
