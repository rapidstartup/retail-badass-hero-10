
import { supabase } from "@/integrations/supabase/client";
import { StaffMember } from "@/types/staff";
import { toast } from "sonner";

export const fetchStaffMembers = async () => {
  try {
    console.log("Fetching all staff members");
    
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Supabase error fetching staff members:", error);
      throw error;
    }
    
    console.log("Fetched staff members:", data);
    return data || [];
  } catch (error) {
    console.error("Error fetching staff members:", error);
    toast.error(`Failed to fetch staff members: ${error instanceof Error ? error.message : "Unknown error"}`);
    return [];
  }
};

export const addStaffMember = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: string
) => {
  try {
    console.log("Adding new staff member:", { email, firstName, lastName, role });
    
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      }
    });
    
    if (authError) {
      console.error("Supabase auth error creating user:", authError);
      throw authError;
    }
    
    if (!authData.user) {
      throw new Error("User creation failed - no user returned");
    }
    
    console.log("Auth user created:", authData.user);
    
    // 2. Add staff record
    const { data: staffData, error: staffError } = await supabase
      .from('staff')
      .insert([
        {
          auth_id: authData.user.id,
          email,
          first_name: firstName,
          last_name: lastName,
          role
        }
      ])
      .select()
      .single();
    
    if (staffError) {
      console.error("Supabase error creating staff record:", staffError);
      throw staffError;
    }
    
    console.log("Staff record created:", staffData);
    toast.success("Staff member added successfully");
    return true;
  } catch (error) {
    console.error("Error adding staff member:", error);
    toast.error(`Failed to add staff member: ${error instanceof Error ? error.message : "Unknown error"}`);
    throw error;
  }
};

export const updateStaffMember = async (
  id: string,
  email: string,
  firstName: string,
  lastName: string,
  role: string
) => {
  try {
    console.log("Updating staff member ID:", id, "with data:", { email, firstName, lastName, role });
    
    const { data, error } = await supabase
      .from('staff')
      .update({
        email,
        first_name: firstName,
        last_name: lastName,
        role
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Supabase error updating staff member:", error);
      throw error;
    }
    
    console.log("Staff member updated:", data);
    toast.success("Staff member updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating staff member:", error);
    toast.error(`Failed to update staff member: ${error instanceof Error ? error.message : "Unknown error"}`);
    throw error;
  }
};

export const deleteStaffMember = async (id: string, authId: string | null) => {
  try {
    console.log("Deleting staff member ID:", id, "Auth ID:", authId);
    
    // Delete staff record first
    const { error: staffError } = await supabase
      .from('staff')
      .delete()
      .eq('id', id);
    
    if (staffError) {
      console.error("Supabase error deleting staff record:", staffError);
      throw staffError;
    }
    
    console.log("Staff record deleted successfully");
    
    // Note: Auth user deletion would require admin privileges
    // This is just a placeholder for future implementation
    if (authId) {
      console.log("Would delete auth user with ID:", authId);
      // In a production environment, you might want to use Supabase admin API to delete the user
      // or use a Supabase Edge Function with admin rights
    }
    
    toast.success("Staff member deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting staff member:", error);
    toast.error(`Failed to delete staff member: ${error instanceof Error ? error.message : "Unknown error"}`);
    throw error;
  }
};

export const syncStaffWithGoHighLevel = async (goHighLevelApiKey: string | undefined) => {
  try {
    if (!goHighLevelApiKey) {
      throw new Error("GoHighLevel API key is not configured");
    }
    
    console.log("Syncing staff with GoHighLevel");
    
    // Call our Edge Function for GoHighLevel sync
    const response = await supabase.functions.invoke('staff', {
      body: { 
        apiKey: goHighLevelApiKey 
      },
      method: 'POST',
      headers: {
        action: 'sync-gohighlevel'
      }
    });
    
    if (response.error) {
      console.error("Supabase function error syncing with GoHighLevel:", response.error);
      throw new Error(response.error.message);
    }
    
    console.log("Staff synchronized with GoHighLevel successfully:", response.data);
    toast.success("Staff synchronized with GoHighLevel successfully");
    return true;
  } catch (error) {
    console.error("Error syncing with GoHighLevel:", error);
    toast.error(`Failed to sync with GoHighLevel: ${error instanceof Error ? error.message : "Unknown error"}`);
    throw error;
  }
};
