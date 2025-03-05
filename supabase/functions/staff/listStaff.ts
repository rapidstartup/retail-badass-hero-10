
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"
import { CorsHeaders, createErrorResponse, createSuccessResponse } from "./types.ts"

// Handle listing all staff members
export async function handleListStaff(
  supabase: SupabaseClient,
  corsHeaders: CorsHeaders
): Promise<Response> {
  console.log("Handling list-staff request in edge function");
  
  try {
    // Using the service role key in the edge function lets us bypass RLS
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching staff:', error);
      return createErrorResponse(error.message, corsHeaders);
    }
    
    console.log(`Found ${data?.length || 0} staff members`);
    return createSuccessResponse(data || [], corsHeaders);
  } catch (error: any) {
    console.error('Exception in handleListStaff:', error);
    return createErrorResponse(error.message, corsHeaders, 500);
  }
}
