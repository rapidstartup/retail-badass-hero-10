
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"
import { 
  handleCreateStaff, 
  handleUpdateStaff, 
  handleDeleteStaff, 
  handleSyncGoHighLevel,
  handleListStaff,
  CorsHeaders
} from "./handlers.ts"

// CORS headers for browser requests
const corsHeaders: CorsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the admin key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    
    console.log("Creating Supabase client with URL:", supabaseUrl)
    if (!supabaseKey) {
      console.error("Missing SUPABASE_SERVICE_ROLE_KEY env variable")
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Parse the request body
    const requestBody = await req.json()
    const { action } = requestBody
    
    console.log(`Processing ${action} request:`, requestBody)
    
    // Route to the appropriate handler based on action
    switch (action) {
      case 'create-staff':
        return await handleCreateStaff(supabase, requestBody, corsHeaders)
      
      case 'update-staff':
        return await handleUpdateStaff(supabase, requestBody, corsHeaders)
      
      case 'delete-staff':
        return await handleDeleteStaff(supabase, requestBody, corsHeaders)
      
      case 'sync-gohighlevel':
        return await handleSyncGoHighLevel(requestBody, corsHeaders)
      
      case 'list-staff':
        return await handleListStaff(supabase, corsHeaders)
      
      default:
        return new Response(
          JSON.stringify({ error: 'Unknown action' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
    
  } catch (error) {
    console.error('Unhandled error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
