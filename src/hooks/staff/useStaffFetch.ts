
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
      
      // Instead of checking connection, let's directly query and see the raw response
      const { data, error, status, statusText, count } = await supabase
        .from('staff')
        .select('*');
      
      // Log complete information about the response
      console.log("Supabase query response:", {
        status,
        statusText,
        errorMessage: error?.message,
        errorDetails: error?.details,
        dataReceived: !!data,
        dataLength: data?.length || 0,
        count
      });
      
      if (error) {
        console.error("Supabase query error details:", error);
        throw error;
      }
      
      // Log the actual data received
      console.log("Staff data received:", data);
      
      // Debug check - is the data in the expected format?
      if (data) {
        if (data.length === 0) {
          console.log("Query successful but no staff records found in the database");
        } else {
          console.log(`Found ${data.length} staff records:`, data);
          data.forEach((staff, index) => {
            console.log(`Staff #${index + 1}:`, {
              id: staff.id,
              email: staff.email,
              firstName: staff.first_name,
              lastName: staff.last_name,
              role: staff.role
            });
          });
        }
      } else {
        console.log("No data returned from query (data is null/undefined)");
      }
      
      // Ensure we're setting the state with a valid array
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
