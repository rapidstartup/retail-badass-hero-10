
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function usePasswordSetup(
  signIn: (email: string, password: string) => Promise<void>
) {
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSetPassword = async (
    email: string,
    firstName: string,
    lastName: string,
    newPassword: string,
    confirmPassword: string,
    onComplete: () => void,
    isNewStaffSetup: boolean = false
  ) => {
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
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
      // First, check if this is a new staff setup or updating an existing staff
      if (!isNewStaffSetup) {
        // For existing staff, check if the staff record exists
        const { data: staffData, error: staffCheckError } = await supabase
          .from('staff')
          .select('*')
          .eq('email', email)
          .maybeSingle();
          
        if (staffCheckError) throw staffCheckError;
        
        if (!staffData) {
          toast.error("No staff account found with this email. Please contact your administrator or use the New Staff Setup option.");
          setIsLoading(false);
          return;
        }

        // Check if the staff record already has an auth_id
        if (staffData.auth_id) {
          // Staff already has an auth account, redirect to login
          toast.info("An account already exists for this email. Please use the login form.");
          setIsLoading(false);
          onComplete();
          return;
        }
      }
      
      // Create the auth user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password: newPassword,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });
      
      if (signUpError) {
        throw signUpError;
      }
      
      if (data?.user?.id) {
        // Important: If this is a new staff creation, create the staff record
        if (isNewStaffSetup) {
          // Wait a moment to ensure the auth user is fully created
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const { error: createStaffError } = await supabase
            .from('staff')
            .insert({ 
              email: email,
              auth_id: data.user.id,
              first_name: firstName,
              last_name: lastName,
              role: 'staff' // Default role
            });
            
          if (createStaffError) {
            console.error("Staff creation error:", createStaffError);
            throw createStaffError;
          }
          
          toast.success("New staff account created successfully! You can now login");
        } else {
          // For existing staff, update the auth_id
          // Wait a moment to ensure the auth user is fully created
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const { error: updateStaffError } = await supabase
            .from('staff')
            .update({ 
              auth_id: data.user.id,
              first_name: firstName,
              last_name: lastName
            })
            .eq('email', email);
            
          if (updateStaffError) {
            console.error("Staff update error:", updateStaffError);
            throw updateStaffError;
          }
          
          toast.success("Account created successfully! You can now login");
        }
        
        // Wait a moment before signing in to ensure data is properly saved
        setTimeout(async () => {
          try {
            await signIn(email, newPassword);
          } catch (signInError) {
            console.error("Sign in after registration failed:", signInError);
            toast.info("Account created, but automatic login failed. Please try logging in manually.");
          }
        }, 2500);
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
