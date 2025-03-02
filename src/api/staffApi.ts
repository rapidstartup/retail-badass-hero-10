
import { supabase } from "@/integrations/supabase/client";
import { StaffMember } from "@/types/staff";

export const fetchStaffMembers = async () => {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const addStaffMember = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: string
) => {
  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: window.location.origin,
    }
  });
  
  if (authError) throw authError;
  if (!authData.user) throw new Error("User creation failed");
  
  // 2. Add staff record
  const { error: staffError } = await supabase
    .from('staff')
    .insert([
      {
        auth_id: authData.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
        role
      }
    ]);
  
  if (staffError) throw staffError;
  
  return true;
};

export const updateStaffMember = async (
  id: string,
  email: string,
  firstName: string,
  lastName: string,
  role: string
) => {
  const { error } = await supabase
    .from('staff')
    .update({
      email,
      first_name: firstName,
      last_name: lastName,
      role
    })
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

export const deleteStaffMember = async (id: string, authId: string | null) => {
  // Delete staff record first
  const { error: staffError } = await supabase
    .from('staff')
    .delete()
    .eq('id', id);
  
  if (staffError) throw staffError;
  
  // Note: Auth user deletion would require admin privileges
  // This is just a placeholder for future implementation
  if (authId) {
    console.log("Would delete auth user with ID:", authId);
  }
  
  return true;
};

export const syncStaffWithGoHighLevel = async (goHighLevelApiKey: string | undefined) => {
  if (!goHighLevelApiKey) {
    throw new Error("GoHighLevel API key is not configured");
  }
  
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
    throw new Error(response.error.message);
  }
  
  return true;
};
