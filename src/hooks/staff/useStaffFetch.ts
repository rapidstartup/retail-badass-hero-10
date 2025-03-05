
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
      console.log("Fetching staff members directly from Supabase staff table...");
      
      // Check Supabase connection
      console.log("Supabase URL:", supabase.supabaseUrl);
      
      // Explicitly set timeout for fetch operation
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .timeout(10000); // 10 second timeout
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log("Staff data fetched successfully:", data);
      if (data && data.length > 0) {
        console.log("First staff member:", data[0]);
      } else {
        console.log("No staff members found in the database");
      }
      
      setStaffMembers(data || []);
    } catch (error: any) {
      console.error("Error fetching staff:", error);
      toast.error(`Error fetching staff: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    console.log("useStaffFetch hook mounted, fetching staff...");
    fetchStaffMembers();
  }, []);

  // Expose refetch method for manual refreshes
  return {
    staffMembers,
    setStaffMembers,
    loading,
    refetch: fetchStaffMembers
  };
}
