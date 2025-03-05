
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"
import { CorsHeaders, createErrorResponse, createSuccessResponse } from "./types.ts"

// Handle staff update
export async function handleUpdateStaff(
  supabase: SupabaseClient,
  requestBody: any,
  corsHeaders: CorsHeaders
): Promise<Response> {
  const { id, email, firstName, lastName, role } = requestBody
  
  if (!id || !email || !firstName || !lastName || !role) {
    return createErrorResponse('Missing required fields', corsHeaders)
  }
  
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
    .single()
  
  if (error) {
    console.error('Error updating staff:', error)
    return createErrorResponse(error.message, corsHeaders)
  }
  
  return createSuccessResponse(data, corsHeaders)
}
