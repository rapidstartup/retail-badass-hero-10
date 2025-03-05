
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

// CORS headers type
export type CorsHeaders = {
  'Access-Control-Allow-Origin': string,
  'Access-Control-Allow-Headers': string,
  'Access-Control-Allow-Methods': string,
}

// Standard response helper functions
export const createErrorResponse = (
  message: string, 
  corsHeaders: CorsHeaders, 
  status = 400
): Response => {
  return new Response(
    JSON.stringify({ error: message }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status }
  )
}

export const createSuccessResponse = (
  data: any, 
  corsHeaders: CorsHeaders
): Response => {
  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
