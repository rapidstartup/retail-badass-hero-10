
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { StaffMember } from "@/types/staff";
import { supabase } from "@/integrations/supabase/client";

export function useStaffFetch() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  const fetchStaffMembers = async () => {
    setLoading(true);
    try {
      console.log("Fetching staff members from Supabase...");
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      console.log("Staff members fetched:", data);
      
      if (!data || data.length === 0) {
        console.log("No staff members found in database");
      }
      
      setStaffMembers(data || []);
    } catch (error: any) {
      console.error("Error fetching staff:", error);
      toast.error(`Error fetching staff: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    staffMembers,
    setStaffMembers,
    loading,
    fetchStaffMembers
  };
}
