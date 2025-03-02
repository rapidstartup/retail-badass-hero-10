
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
      console.log("Starting account creation process for:", email);
      
      // If updating existing staff, check if the record exists
      if (!isNewStaffSetup) {
        const { data: staffData, error: staffCheckError } = await supabase
          .from('staff')
          .select('*')
          .eq('email', email)
          .maybeSingle();
          
        if (staffCheckError) {
          console.error("Staff check error:", staffCheckError);
          throw staffCheckError;
        }
        
        if (!staffData) {
          toast.error("No staff account found with this email. Please contact your administrator or use the New Staff Setup option.");
          setIsLoading(false);
          return;
        }

        // If staff record exists and already has an auth_id, redirect to login
        if (staffData.auth_id) {
          toast.info("An account already exists for this email. Please use the login form.");
          setIsLoading(false);
          onComplete();
          return;
        }
      }
      
      // Create the auth user
      console.log("Creating auth user for:", email);
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
        console.error("Auth signup error:", signUpError);
        throw signUpError;
      }
      
      if (!data?.user?.id) {
        throw new Error("User creation failed - no user ID returned");
      }
      
      const userId = data.user.id;
      console.log("Auth user created with ID:", userId);
      
      // Create or update staff record
      try {
        console.log("Proceeding with staff record creation/update");
        
        if (isNewStaffSetup) {
          // For new staff, create a new staff record
          console.log("Creating new staff record");
          const { error: createStaffError } = await supabase
            .from('staff')
            .insert({ 
              email: email,
              auth_id: userId,
              first_name: firstName,
              last_name: lastName,
              role: 'staff' // Default role
            });
            
          if (createStaffError) {
            console.error("Staff creation error:", createStaffError);
            throw createStaffError;
          }
          
          console.log("New staff record created successfully");
          toast.success("New staff account created successfully! You can now login");
        } else {
          // For existing staff, update the auth_id
          console.log("Updating existing staff record");
          const { error: updateStaffError } = await supabase
            .from('staff')
            .update({ 
              auth_id: userId,
              first_name: firstName,
              last_name: lastName
            })
            .eq('email', email);
            
          if (updateStaffError) {
            console.error("Staff update error:", updateStaffError);
            throw updateStaffError;
          }
          
          console.log("Existing staff record updated successfully");
          toast.success("Account created successfully! You can now login");
        }
        
        // Try to auto-login the user after a short delay
        console.log("Attempting auto-login after 2 second delay");
        setTimeout(async () => {
          try {
            await signIn(email, newPassword);
            console.log("Auto-login successful");
          } catch (signInError) {
            console.error("Auto-login failed:", signInError);
            toast.info("Account created, but automatic login failed. Please try logging in manually.");
          }
        }, 2000);
        
      } catch (dbError: any) {
        console.error("Database operation error:", dbError);
        toast.error(`Database error: ${dbError.message || "Failed to save staff record"}`);
        
        // Despite the staff record error, we created an auth user, so let's try to login
        setTimeout(async () => {
          try {
            await signIn(email, newPassword);
          } catch (signInError) {
            console.error("Sign in after registration failed:", signInError);
            toast.info("Auth account created, but staff record failed. Please contact an administrator.");
          }
        }, 2000);
      }
    } catch (error: any) {
      console.error("Setup error:", error);
      if (error.message?.includes("User already registered")) {
        toast.error("An account with this email already exists. Please use the login form.");
      } else {
        toast.error(error.message || "Failed to setup account");
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
