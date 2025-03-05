
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"
import { CorsHeaders, createErrorResponse, createSuccessResponse } from "./types.ts"

// Handle staff deletion
export async function handleDeleteStaff(
  supabase: SupabaseClient,
  requestBody: any,
  corsHeaders: CorsHeaders
): Promise<Response> {
  const { staffId, userId } = requestBody
  
  if (!staffId) {
    return createErrorResponse('Staff ID is required', corsHeaders)
  }
  
  // Delete staff record first
  const { error: staffError } = await supabase
    .from('staff')
    .delete()
    .eq('id', staffId)
  
  if (staffError) {
    console.error('Error deleting staff record:', staffError)
    return createErrorResponse(staffError.message, corsHeaders)
  }
  
  // If auth_id exists, delete the auth user
  if (userId) {
    try {
      const { error: authError } = await supabase.auth.admin.deleteUser(userId)
      
      if (authError) {
        console.error('Error deleting auth user:', authError)
        // Continue anyway since the staff record was deleted
      }
    } catch (error) {
      console.error('Exception when deleting auth user:', error)
      // Continue anyway since the staff record was deleted
    }
  }
  
  return createSuccessResponse({ message: 'Staff deleted successfully' }, corsHeaders)
}
