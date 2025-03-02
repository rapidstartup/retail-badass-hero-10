
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

// CORS headers for browser requests
const corsHeaders = {
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
    const supabase = createClient(supabaseUrl, supabaseKey)

    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    
    // GET request - Fetch settings
    if (req.method === 'GET') {
      // If ID is provided, get specific settings, otherwise get the first record
      // (most implementations will only have one settings record)
      let query = supabase.from('settings').select('*')
      
      if (id) {
        query = query.eq('id', id)
      }
      
      const { data, error } = await query.limit(1).single()
      
      if (error) {
        console.error('Error fetching settings:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }
      
      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // POST request - Create or update settings
    if (req.method === 'POST') {
      const requestData = await req.json()
      
      let result
      
      // If ID is provided, update existing settings
      if (id) {
        result = await supabase
          .from('settings')
          .update(requestData)
          .eq('id', id)
          .select()
          .single()
      } else {
        // Check if settings record already exists
        const { data: existingSettings } = await supabase
          .from('settings')
          .select('id')
          .limit(1)
        
        if (existingSettings && existingSettings.length > 0) {
          // Update the first settings record if it exists
          result = await supabase
            .from('settings')
            .update(requestData)
            .eq('id', existingSettings[0].id)
            .select()
            .single()
        } else {
          // Create new settings record if none exists
          result = await supabase
            .from('settings')
            .insert(requestData)
            .select()
            .single()
        }
      }
      
      if (result.error) {
        console.error('Error saving settings:', result.error)
        return new Response(
          JSON.stringify({ error: result.error.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }
      
      return new Response(
        JSON.stringify(result.data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Return 405 for unsupported methods
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
    )
    
  } catch (error) {
    console.error('Unhandled error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
