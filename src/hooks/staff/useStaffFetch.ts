
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
      
      // Use a direct query with better debugging
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
      setStaffMembers(data || []);
    } catch (error: any) {
      console.error("Error fetching staff data:", error);
      toast.error(`Failed to load staff: ${error.message}`);
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
