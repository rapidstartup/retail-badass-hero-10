
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { StaffMember } from "@/types/staff";
import { supabase } from "@/integrations/supabase/client";

export function useStaffFetch() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStaffMembers = async () => {
    setLoading(true);
    
    try {
      console.log("Fetching staff members from Supabase...");
      
      // First check if we can connect to Supabase
      const connectionCheck = await supabase.from('staff').select('count(*)');
      
      if (connectionCheck.error) {
        console.error("Supabase connection error:", connectionCheck.error);
        throw new Error(`Connection error: ${connectionCheck.error.message}`);
      }
      
      console.log("Connection successful, fetching staff data...");
      
      // Now fetch all staff data
      const { data, error } = await supabase
        .from('staff')
        .select('*');
      
      if (error) {
        console.error("Supabase query error:", error);
        throw error;
      }
      
      // Add detailed logging
      console.log("Staff data response received:", data);
      if (data && data.length > 0) {
        console.log(`Found ${data.length} staff members:`, data);
      } else {
        console.log("No staff members returned from the query");
      }
      
      // Ensure we're setting the state with the data
      setStaffMembers(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Error fetching staff data:", error);
      toast.error(`Failed to load staff: ${error.message}`);
      // Set empty array to prevent undefined errors in the UI
      setStaffMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    console.log("useStaffFetch hook mounted - fetching initial data");
    fetchStaffMembers();
  }, []);

  return {
    staffMembers,
    setStaffMembers,
    loading,
    refetch: fetchStaffMembers
  };
}
